import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    ChevronRight,
    CreditCard,
    Truck,
    Store,
    Mail,
    ArrowLeft,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { sendEmailNotification } from "@/lib/email-service";

const checkoutSchema = z.object({
    firstName: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido"),
    dni: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    province: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
    const { items, subtotal, shippingCost, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingMethod, setShippingMethod] = useState("domicilio");
    const [paymentMethod, setPaymentMethod] = useState("transferencia");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const captchaRef = useRef<ReCAPTCHA>(null);

    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dni: "",
            address: "",
            city: "",
            zipCode: "",
            province: "",
        },
    });

    // Debug: Loguear errores de validación si el botón parece no funcionar
    React.useEffect(() => {
        if (Object.keys(form.formState.errors).length > 0) {
            console.log("Errores de validación:", form.formState.errors);
        }
    }, [form.formState.errors]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    const onSubmit = async (values: CheckoutFormValues) => {
        console.log("Inicio de onSubmit - Valores:", values);
        
        // 0. Validar reCAPTCHA
        if (!captchaToken) {
            toast.error("Por favor, completa el captcha 'No soy un robot'.");
            return;
        }

        setIsSubmitting(true);
        const orderNumber = `PP-${Math.floor(1000 + Math.random() * 9000)}`;
        
        try {
            let proofUrl = "";
            let currentStatus = paymentMethod === 'transferencia' ? 'pendiente_de_pago' : 'pendiente_pago_local';
            
            // 1. Validaciones y Subida de Comprobante
            if (paymentMethod === 'transferencia') {
                if (!proofFile) throw new Error("Por favor adjunta el comprobante de transferencia");
                
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!allowedTypes.includes(proofFile.type)) {
                    throw new Error("Formato no permitido. Solo JPG, PNG o PDF.");
                }

                if (proofFile.size > 5 * 1024 * 1024) {
                    throw new Error("El archivo es demasiado pesado (Máx 5MB).");
                }

                const fileExt = proofFile.name.split('.').pop();
                const fileName = `${orderNumber}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('comprobantes')
                    .upload(filePath, proofFile);

                if (uploadError) throw new Error("Error al subir el comprobante: " + uploadError.message);
                
                const { data: { publicUrl } } = supabase.storage
                    .from('comprobantes')
                    .getPublicUrl(filePath);
                
                proofUrl = publicUrl;
            }

            // 2. Guardar pedido en DB
            const orderData = {
                order_number: orderNumber,
                customer_name: `${values.firstName} ${values.lastName}`,
                customer_email: values.email,
                customer_phone: values.phone,
                shipping_address: shippingMethod === 'tienda' 
                    ? "Retiro en tienda / Coordinar con vendedor" 
                    : `${values.address}, ${values.city}, ${values.province} (CP: ${values.zipCode})`,
                items: items,
                subtotal: subtotal,
                shipping_cost: shippingCost,
                total: total,
                payment_method: paymentMethod,
                status: currentStatus,
                proof_url: proofUrl,
                created_at: new Date().toISOString()
            };

            const { error: dbError } = await supabase
                .from('orders')
                .insert([orderData]);

            if (dbError) throw new Error("Error al procesar el pedido en el servidor. Reintentá.");

            // 2.5 Descontar stock de los productos
            const stockUpdatePromises = items.map(async (item) => {
                // Obtener el stock actual primero para evitar inconsistencias
                const { data: currentProduct, error: fetchError } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.id)
                    .single();

                if (fetchError || !currentProduct) {
                    console.error(`Error al obtener stock del producto ${item.id}:`, fetchError);
                    return;
                }

                const newStock = Math.max(0, (currentProduct.stock || 0) - item.quantity);
                
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ stock: newStock })
                    .eq('id', item.id);

                if (updateError) {
                    console.error(`Error al actualizar stock del producto ${item.id}:`, updateError);
                }
            });

            await Promise.all(stockUpdatePromises);

            // 3. Notificaciones
            await sendEmailNotification('order_confirmation', orderData);
            await sendEmailNotification('admin_notification', orderData);

            // 3.5 Resetear captcha tras éxito
            setCaptchaToken(null);
            captchaRef.current?.reset();

            // 4. Limpieza y Redirección
            clearCart();
            toast.success("¡Compra realizada con éxito!");
            navigate('/gracias-por-tu-compra', { state: { orderData } });
        } catch (error: any) {
            toast.error(error.message || "Hubo un error al procesar tu compra. Intentá nuevamente.");
            console.error("Error en checkout:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <h2 className="font-heading font-black text-3xl uppercase tracking-tighter mb-4 italic">Tu carrito está vacío</h2>
                <Button
                    onClick={() => navigate("/productos")}
                    variant="outline"
                    className="font-heading font-bold uppercase tracking-widest rounded-xl"
                >
                    Ir a la tienda
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-8 text-sm uppercase font-bold tracking-widest text-muted-foreground">
                    <span className="text-primary">Carrito</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Confirmación</span>
                </div>

                <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-8 italic">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario a la izquierda */}
                    <div className="lg:col-span-2 space-y-8">
                        <Form {...form}>
                            <form 
                                onSubmit={(e) => {
                                    console.log("Form submit intercalado");
                                    form.handleSubmit(onSubmit, (errors) => {
                                        console.log("Errores detectados por Zod:", errors);
                                        toast.error("Faltan completar campos obligatorios.");
                                    })(e);
                                }} 
                                className="space-y-8"
                            >
                                <Card className="border-border shadow-md overflow-hidden bg-card">
                                    <CardHeader className="bg-secondary/50 border-b">
                                        <CardTitle className="font-heading uppercase italic text-lg flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-primary" />
                                            Datos del Cliente
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nombre</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-secondary/20 h-11" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Apellido</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-secondary/20 h-11" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" {...field} className="bg-secondary/20 h-11" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Teléfono</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-secondary/20 h-11" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="dni"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>DNI (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-secondary/20 h-11" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="border-border shadow-md overflow-hidden bg-card">
                                    <CardHeader className="bg-secondary/50 border-b">
                                        <CardTitle className="font-heading uppercase italic text-lg flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-primary" />
                                            Datos de Envío
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        <RadioGroup
                                            value={shippingMethod}
                                            onValueChange={setShippingMethod}
                                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        >
                                            <div className="flex items-center space-x-2 border rounded-xl p-4 transition-all cursor-pointer hover:border-primary aria-checked:border-primary aria-checked:bg-primary/5 h-20">
                                                <RadioGroupItem value="domicilio" id="domicilio" />
                                                <Label htmlFor="domicilio" className="flex flex-col cursor-pointer flex-1">
                                                    <span className="font-bold flex items-center gap-2">
                                                        Domicilio
                                                    </span>
                                                    <span className="text-[10px] uppercase text-muted-foreground">Envío a casa</span>
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 border rounded-xl p-4 transition-all cursor-pointer hover:border-primary aria-checked:border-primary aria-checked:bg-primary/5 h-20">
                                                <RadioGroupItem value="tienda" id="tienda" />
                                                <Label htmlFor="tienda" className="flex flex-col cursor-pointer flex-1">
                                                    <span className="font-bold flex items-center gap-2">
                                                        Coordinar
                                                    </span>
                                                    <span className="text-[10px] uppercase text-muted-foreground">con el vendedor</span>
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 border rounded-xl p-4 transition-all cursor-pointer hover:border-primary aria-checked:border-primary aria-checked:bg-primary/5 h-20">
                                                <RadioGroupItem value="correo" id="correo" />
                                                <Label htmlFor="correo" className="flex flex-col cursor-pointer flex-1">
                                                    <span className="font-bold flex items-center gap-2">
                                                        Correo
                                                    </span>
                                                    <span className="text-[10px] uppercase text-muted-foreground">Punto retiro</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {shippingMethod === "tienda" ? (
                                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                                Este método es válido para <span className="text-primary font-bold">clientes</span> que residen en zonas aledañas a Berazategui.
                                            </div>
                                        ) : (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <FormField
                                                    control={form.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Dirección</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="bg-secondary/20 h-11" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="city"
                                                        render={({ field }) => (
                                                            <FormItem className="md:col-span-1">
                                                                <FormLabel>Ciudad</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="bg-secondary/20 h-11" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="zipCode"
                                                        render={({ field }) => (
                                                            <FormItem className="md:col-span-1">
                                                                <FormLabel>Código Postal</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="bg-secondary/20 h-11" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="province"
                                                        render={({ field }) => (
                                                            <FormItem className="md:col-span-1">
                                                                <FormLabel>Provincia</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="bg-secondary/20 h-11" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-border shadow-md overflow-hidden bg-card">
                                    <CardHeader className="bg-secondary/50 border-b">
                                        <CardTitle className="font-heading uppercase italic text-lg flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            Método de Pago
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <RadioGroup
                                            value={paymentMethod}
                                            onValueChange={setPaymentMethod}
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        >
                                            <div className="flex items-center space-x-2 border rounded-xl p-4 transition-all cursor-pointer hover:border-primary aria-checked:border-primary aria-checked:bg-primary/5 h-20">
                                                <RadioGroupItem value="transferencia" id="transferencia" />
                                                <Label htmlFor="transferencia" className="flex flex-col cursor-pointer flex-1">
                                                    <span className="font-bold">Transferencia</span>
                                                    <span className="text-[10px] uppercase text-muted-foreground"></span>
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2 border rounded-xl p-4 transition-all cursor-pointer hover:border-primary aria-checked:border-primary aria-checked:bg-primary/5 h-20">
                                                <RadioGroupItem value="contrapago" id="contrapago" />
                                                <Label htmlFor="contrapago" className="flex flex-col cursor-pointer flex-1">
                                                    <span className="font-bold">Efectivo</span>
                                                    <span className="text-[10px] uppercase text-muted-foreground">En el local</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {paymentMethod === 'transferencia' && (
                                            <div className="mt-6 p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 space-y-4 animate-in fade-in slide-in-from-top-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-heading font-black text-lg uppercase italic tracking-tighter">Datos Bancarios</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Banco</p>
                                                            <p className="font-bold">BRUBANK</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Titular</p>
                                                            <p className="font-bold">Juan Pablo Casasola</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black">CBU</p>
                                                            <p className="font-bold font-mono">1430001713022116440019</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Alias</p>
                                                            <p className="font-bold text-primary">puntopadelshop</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black">CUIT</p>
                                                            <p className="font-bold">20-43985752-9</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Monto a Transferir</p>
                                                            <p className="font-black text-lg text-primary">{formatPrice(total)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-primary/10">
                                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-3">Adjuntar comprobante (PDF, JPG, PNG)</p>
                                                    <div className="flex flex-col gap-2">
                                                        <Input 
                                                            type="file" 
                                                            accept="image/*,.pdf" 
                                                            onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                                                            className="bg-card cursor-pointer"
                                                        />
                                                        <p className="text-[10px] text-muted-foreground italic">
                                                            Una vez realizada la transferencia, por favor adjunte el comprobante. Su pedido será procesado una vez que confirmemos el pago.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="bg-secondary/20 p-6 flex flex-col gap-4">
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full h-14 font-heading font-black text-xl uppercase tracking-widest rounded-xl glow group shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span>Procesando...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    Confirmar Compra
                                                    <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>

                                        {/* Google reCAPTCHA v2 */}
                                        <div className="flex flex-col items-center gap-4 py-2 bg-secondary/10 rounded-xl border border-dashed border-border">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Verificación de seguridad</p>
                                            <ReCAPTCHA
                                                ref={captchaRef}
                                                sitekey={RECAPTCHA_SITE_KEY}
                                                onChange={(token) => setCaptchaToken(token)}
                                                onExpired={() => setCaptchaToken(null)}
                                            />
                                            {RECAPTCHA_SITE_KEY === "PEGA_AQUI_TU_SITE_KEY" && (
                                                <p className="text-[9px] text-destructive font-bold uppercase animate-pulse text-center px-4">
                                                    Error: Configuración de reCAPTCHA incompleta. <br/>Añadí tu Site Key en el archivo .env
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Store className="w-3 h-3" />
                                            Compra 100% segura y protegida
                                        </p>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    </div>

                    {/* Resumen a la derecha */}
                    <div className="space-y-6">
                        <Card className="border-border shadow-md overflow-hidden bg-card sticky top-24">
                            <CardHeader className="bg-secondary/50 border-b">
                                <CardTitle className="font-heading uppercase italic text-lg">Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary border flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-[11px] font-bold uppercase leading-tight line-clamp-2">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                                                <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-bold">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Envío</span>
                                        {shippingCost === 0 ? (
                                            <span className="text-[hsl(145,80%,42%)] font-bold">GRATIS</span>
                                        ) : (
                                            <span className="font-bold">{formatPrice(shippingCost)}</span>
                                        )}
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="flex justify-between items-end">
                                        <span className="font-heading font-black text-lg uppercase italic">Total</span>
                                        <div className="text-right">
                                            <p className="font-heading font-black text-3xl text-primary leading-none">{formatPrice(total)}</p>
                                            <p className="text-[9px] uppercase text-muted-foreground tracking-tighter mt-1 italic font-bold">Incluye IVA</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/carrito")}
                                    className="w-full text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest gap-2"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Volver al carrito
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
