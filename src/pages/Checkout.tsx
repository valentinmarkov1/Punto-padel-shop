import React, { useState } from "react";
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
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const checkoutSchema = z.object({
    firstName: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido"),
    dni: z.string().optional(),
    address: z.string().min(5, "Dirección inválida"),
    city: z.string().min(3, "Ciudad inválida"),
    zipCode: z.string().min(4, "CP inválido"),
    province: z.string().min(3, "Provincia inválida"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
    const { items, subtotal, shippingCost, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingMethod, setShippingMethod] = useState("domicilio");
    const [paymentMethod, setPaymentMethod] = useState("mercadopago");
    const [orderConfirmed, setOrderConfirmed] = useState(false);

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    const onSubmit = (values: CheckoutFormValues) => {
        console.log("Datos de la orden:", { values, shippingMethod, paymentMethod, items, total: total });
        setOrderConfirmed(true);
        clearCart();
        toast.success("¡Pedido confirmado con éxito!");
    };

    if (orderConfirmed) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4 italic">¡Gracias por tu compra!</h1>
                <p className="text-muted-foreground text-lg max-w-[500px] mb-8">
                    Tu pedido ha sido recibido y está siendo procesado. Te enviamos un mail con todos los detalles.
                </p>
                <Button
                    onClick={() => navigate("/")}
                    className="font-heading font-bold uppercase tracking-widest rounded-xl h-12 px-8 glow"
                >
                    Volver al Inicio
                </Button>
            </div>
        );
    }

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
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                                <RadioGroupItem value="mercadopago" id="mercadopago" />
                                                <Label htmlFor="mercadopago" className="flex flex-col cursor-pointer flex-1">
                                                    <span className="font-bold">Mercado Pago</span>
                                                    <span className="text-[10px] uppercase text-muted-foreground">Tarjetas o Dinero en cuenta</span>
                                                </Label>
                                            </div>
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
                                                    <span className="font-bold">Contra Entrega</span>
                                                    <span className="text-[10px] uppercase text-muted-foreground">Pagá al recibir</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                    <CardFooter className="bg-secondary/20 p-6 flex flex-col gap-4">
                                        <Button type="submit" className="w-full h-14 font-heading font-black text-xl uppercase tracking-widest rounded-xl glow group shadow-lg shadow-primary/20">
                                            Confirmar Compra
                                            <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </Button>
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
