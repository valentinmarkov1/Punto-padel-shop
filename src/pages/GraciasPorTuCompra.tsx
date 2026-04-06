import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
    CheckCircle2, 
    ShoppingBag, 
    Truck, 
    MessageCircle, 
    ChevronRight,
    ArrowLeft,
    Clock,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const GraciasPorTuCompra = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    // Redirigir si no hay datos de orden (acceso directo a la URL)
    useEffect(() => {
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    if (!orderData) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    const isTransfer = orderData.payment_method === 'transferencia';
    const isPickup = orderData.payment_method === 'contrapago'; // Usamos contrapago para Local/Efectivo
    
    // El número de WhatsApp debería venir de la configuración o ser constante
    const whatsappNumber = "5491131101234"; // Ejemplo, se puede parametrizar
    const whatsappMessage = `Hola!%20Realicé%20el%20pedido%20%23${orderData.order_number}%20y%20quisiera%20coordinar%20el%20retiro.`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div className="min-h-screen bg-secondary/10 pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Encabezado Éxito */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-2 shadow-xl shadow-primary/5">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="font-heading font-black text-5xl uppercase italic tracking-tighter">¡Compra Exitosa!</h1>
                    <p className="text-muted-foreground text-lg uppercase font-bold tracking-widest">Pedido #{orderData.order_number}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    
                    {/* Columna Detalles */}
                    <div className="md:col-span-3 space-y-6">
                        <Card className="border-border rounded-3xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-secondary/20 border-b">
                                <CardTitle className="font-heading font-black text-xl uppercase italic tracking-tighter flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-primary" /> Resumen de Compra
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {orderData.items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center bg-secondary/5 p-3 rounded-2xl border border-border/50">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className="font-black text-sm uppercase italic tracking-tight truncate">{item.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Cantidad: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <Separator className="my-6" />
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground uppercase font-bold text-[10px]">Subtotal</span>
                                        <span className="font-bold">{formatPrice(orderData.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground uppercase font-bold text-[10px]">Envío / Retiro</span>
                                        <span className="font-bold text-emerald-600">{orderData.shipping_cost === 0 ? "GRATIS" : formatPrice(orderData.shipping_cost)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-heading font-black text-xl uppercase italic tracking-tight">Total Final</span>
                                        <span className="font-heading font-black text-2xl text-primary italic underline underline-offset-4">{formatPrice(orderData.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-card border border-border rounded-3xl p-6 flex items-start gap-4 shadow-sm">
                            <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase italic mb-1">Dirección de Envío / Entrega</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{orderData.shipping_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Instrucciones */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden shadow-lg shadow-primary/5 border-2">
                            <CardHeader>
                                <CardTitle className="font-heading font-black text-xl uppercase italic tracking-tighter flex items-center gap-2 text-primary">
                                    <Clock className="w-5 h-5" /> Próximos Pasos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isTransfer ? (
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium leading-relaxed">
                                            Estamos procesando tu pago. Una vez verificado el comprobante, despacharemos tu pedido y te avisaremos por email.
                                        </p>
                                        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                                            <p className="text-[10px] font-black uppercase text-primary mb-1">Estado: Pendiente</p>
                                            <p className="text-xs italic">Te notificaremos dentro de las 24hs hábiles.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-center md:text-left">
                                        <p className="text-sm font-medium leading-relaxed">
                                            Tu pedido está registrado. Podés coordinar el retiro y pago en efectivo directamente con nosotros.
                                        </p>
                                        
                                        <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 glow group shadow-xl shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-700">
                                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                Coordinar por WhatsApp
                                            </a>
                                        </Button>
                                        
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold italic">
                                            Indica tu número de pedido al contactarnos.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-sm group hover:border-primary/30 transition-colors">
                            <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Link to="/" className="hover:text-primary transition-colors">¿Dudas con tu compra?</Link>
                            </h4>
                            <p className="text-xs italic text-muted-foreground">Te enviamos una copia de este resumen a <strong>{orderData.customer_email}</strong>.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Button asChild variant="ghost" className="rounded-full font-bold uppercase tracking-widest text-[10px] group">
                        <Link to="/">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                            Volver a la tienda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GraciasPorTuCompra;
