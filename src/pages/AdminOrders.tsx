import React, { useState } from 'react';
import { useAdmin, Order } from '@/context/AdminContext';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Truck, 
    ExternalLink,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    FileText,
    Package,
    Banknote,
    Download,
    Trash2
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendEmailNotification } from '@/lib/email-service';
import { toast } from 'sonner';

const AdminOrders = () => {
    const { orders, updateOrderStatus, deleteOrder, loading, fetchOrders } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProofOpen, setIsProofOpen] = useState(false);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pendiente_de_pago': return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 uppercase text-[10px] font-black italic">Pendiente de Pago</Badge>;
            case 'pendiente_pago_local': return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 uppercase text-[10px] font-black italic">Pendiente de Pago Efectivo</Badge>;
            case 'pagado': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 uppercase text-[10px] font-black italic">Pagado</Badge>;
            case 'rechazado': return <Badge variant="outline" className="bg-red-600 text-white border-none uppercase text-[10px] font-black italic shadow-[0_0_10px_rgba(220,38,38,0.3)] px-3 py-1">Rechazado</Badge>;
            case 'enviado': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 uppercase text-[10px] font-black italic">Enviado</Badge>;
            case 'entregado': return <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 uppercase text-[10px] font-black italic">Entregado</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px] font-black italic">{status.replace(/_/g, ' ')}</Badge>;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const handleApprove = async (order: Order) => {
        try {
            console.log("Intentando aprobar pedido:", order.id);
            const receiptNumber = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
            
            // 1. Actualizar estado en DB
            await updateOrderStatus(order.id, 'pagado', { receipt_number: receiptNumber });
            
            // 2. Notificación Email
            try {
                await sendEmailNotification('payment_received', { ...order, status: 'pagado', receipt_number: receiptNumber });
            } catch (emailError) {
                console.error("Error enviando email:", emailError);
                toast.error("Pago aprobado pero falló el envío del email.");
            }
            
            toast.success(`Pago aprobado satisfactoriamente.`);
        } catch (error: any) {
            console.error("Error en handleApprove:", error);
            toast.error("Error al aprobar el pago: " + (error.message || "Error desconocido"));
        }
    };

    const handleTrackingSubmit = async () => {
        if (!selectedOrder || !trackingNumber) return;
        
        try {
            console.log("Intentando marcar como enviado:", selectedOrder.id);
            await updateOrderStatus(selectedOrder.id, 'enviado', { tracking_number: trackingNumber });
            
            try {
                await sendEmailNotification('payment_received', { ...selectedOrder, status: 'enviado', tracking_number: trackingNumber });
            } catch (emailError) {
                console.error("Error enviando notification de envío:", emailError);
            }
            
            setIsTrackingOpen(false);
            setTrackingNumber('');
            toast.success(`Pedido marcado como ENVIADO.`);
        } catch (error: any) {
            console.error("Error en handleTrackingSubmit:", error);
            toast.error("Error al actualizar seguimiento.");
        }
    };

    const handleExportPDF = () => {
        if (!selectedOrder) return;
        
        const element = document.getElementById('order-details-content');
        if (!element) return;
        
        const opt = {
            margin: 10,
            filename: `Pedido_${selectedOrder.order_number}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc: any) => {
                    // Quitamos las restricciones de scroll para que capture todo el contenido
                    const scrollArea = clonedDoc.querySelector('.pdf-scroll-area');
                    // Aseguramos que el contenedor de exportación tenga un fondo blanco limpio y márgenes seguros
                    const content = clonedDoc.getElementById('order-details-content');
                    if (content) {
                        content.style.width = '700px'; // Ancho fijo tipo A4 para evitar variaciones
                        content.style.margin = '0 auto';
                        content.style.paddingLeft = '40px';
                        content.style.paddingRight = '40px';
                        content.style.paddingBottom = '60px';
                        
                        // Ocultamos el badge de estado para el PDF
                        const statusBadge = clonedDoc.getElementById('pdf-status-badge');
                        if (statusBadge) {
                            statusBadge.style.display = 'none';
                        }
                    }
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        // Clonamos el elemento para aplicar estilos específicos de PDF si fuera necesario
        // pero html2pdf ya captura el estado actual.
        toast.promise(html2pdf().set(opt).from(element).save(), {
            loading: 'Generando PDF...',
            success: 'PDF descargado con éxito',
            error: 'Error al generar el PDF'
        });
    };

    if (loading) {
        return <div className="p-8 text-center font-bold animate-pulse">CARGANDO PEDIDOS...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading font-black text-4xl uppercase italic tracking-tighter">Pedidos</h1>
                    <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">Gestión de ventas y pagos</p>
                </div>
                
                <div className="flex flex-col md:flex-row flex-wrap gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar pedido, cliente..." 
                            className="pl-10 h-11 rounded-xl bg-card border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center w-full md:w-auto gap-2 bg-card border border-border px-3 rounded-xl overflow-hidden">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select 
                            className="bg-transparent border-none text-xs font-bold uppercase tracking-widest focus:ring-0 p-2 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                             <option value="todos">TODOS</option>
                             <option value="pendiente_de_pago">PENDIENTES TRF</option>
                             <option value="pendiente_pago_local">PENDIENTES EFECTIVO</option>
                             <option value="pagado">PAGADOS</option>
                             <option value="enviado">ENVIADOS</option>
                             <option value="entregado">ENTREGADOS</option>
                             <option value="rechazado">RECHAZADOS</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30 border-b border-border">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pedido</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cliente</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fecha</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground italic font-medium">No se encontraron pedidos con estos filtros.</td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm uppercase italic">#{order.order_number}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter flex items-center gap-1">
                                                {order.payment_method === 'transferencia' ? '🏦 Transferencia' : '💵 Efectivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{order.customer_name}</span>
                                            <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-black text-primary">{formatPrice(order.total)}</span>
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="p-4 text-[11px] font-medium text-muted-foreground uppercase">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border shadow-xl">
                                                <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest p-3">Acciones de Pedido</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
                                                    <Eye className="w-4 h-4 mr-2 text-blue-500" />
                                                    <span className="font-bold text-xs uppercase tracking-wider">Ver Detalles</span>
                                                </DropdownMenuItem>
                                                
                                                {order.payment_method === 'transferencia' && order.proof_url && (
                                                    <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => { setSelectedOrder(order); setIsProofOpen(true); }}>
                                                        <FileText className="w-4 h-4 mr-2 text-primary" />
                                                        <span className="font-bold text-xs uppercase tracking-wider">Ver Comprobante</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {['pendiente_de_pago', 'pendiente_pago_local'].includes(order.status) && (
                                                    <>
                                                        <DropdownMenuItem className="p-3 cursor-pointer text-green-600" onClick={() => handleApprove(order)}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            <span className="font-bold text-xs uppercase tracking-wider">Aprobar Pago</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 cursor-pointer text-red-600" onClick={() => {
                                                            updateOrderStatus(order.id, 'rechazado').catch(err => toast.error("Error al rechazar"));
                                                        }}>
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            <span className="font-bold text-xs uppercase tracking-wider">Rechazar Pago</span>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                
                                                {order.status === 'pagado' && (
                                                    <DropdownMenuItem className="p-3 cursor-pointer text-blue-600" onClick={() => { setSelectedOrder(order); setIsTrackingOpen(true); }}>
                                                        <Truck className="w-4 h-4 mr-2" />
                                                        <span className="font-bold text-xs uppercase tracking-wider">Marcar como Enviado</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {order.status === 'enviado' && (
                                                    <DropdownMenuItem className="p-3 cursor-pointer text-purple-600" onClick={() => {
                                                        updateOrderStatus(order.id, 'entregado').catch(err => toast.error("Error al marcar entregado"));
                                                    }}>
                                                        <Package className="w-4 h-4 mr-2" />
                                                        <span className="font-bold text-xs uppercase tracking-wider">Marcar como Entregado</span>
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="p-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" 
                                                    onClick={() => {
                                                        setOrderToDelete(order.id);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    <span className="font-bold text-xs uppercase tracking-wider">Eliminar Pedido</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modales... */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] flex flex-col bg-card border-border rounded-3xl p-0 overflow-hidden border-none shadow-none">
                    <div id="order-details-content" className="bg-white text-black p-0 relative flex-1 overflow-y-auto">
                        {/* Marca amarilla de la tienda - Más prominente */}
                        <div className="h-6 w-full bg-primary flex items-center justify-center">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-foreground">Punto Padel Shop &bull; Detalle de Pedido Oficial</span>
                        </div>
                        
                        <DialogHeader className="p-8 bg-secondary/30 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <DialogTitle className="font-heading font-black text-3xl uppercase italic tracking-tighter">Pedido #{selectedOrder?.order_number}</DialogTitle>
                                <DialogDescription className="text-xs uppercase font-bold tracking-widest mt-1">Realizado el {selectedOrder && new Date(selectedOrder.created_at).toLocaleString()}</DialogDescription>
                            </div>
                            <div id="pdf-status-badge">
                                {selectedOrder && getStatusBadge(selectedOrder.status)}
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <ScrollArea className="max-h-[60vh] p-8 pdf-scroll-area">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                        <User className="w-3 h-3 text-primary" /> Datos del Cliente
                                    </h4>
                                    <div className="bg-secondary/20 p-4 rounded-2xl border border-border space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold w-16 text-muted-foreground">Nombre:</span>
                                            <span className="text-xs font-black uppercase text-foreground">{selectedOrder?.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs font-medium">{selectedOrder?.customer_email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs font-medium">{selectedOrder?.customer_phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-primary" /> Dirección de Envío
                                    </h4>
                                    <div className="bg-secondary/20 p-4 rounded-2xl border border-border">
                                        <p className="text-xs font-medium">{selectedOrder?.shipping_address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                        <CreditCard className="w-3 h-3 text-primary" /> Transacción
                                    </h4>
                                    <div className="bg-secondary/20 p-4 rounded-2xl border border-border space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-muted-foreground uppercase">Método:</span>
                                            <span className="text-xs font-black uppercase">{selectedOrder?.payment_method}</span>
                                        </div>
                                        {selectedOrder?.receipt_number && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-muted-foreground uppercase">Recibo:</span>
                                                <span className="text-xs font-black uppercase text-primary">{selectedOrder.receipt_number}</span>
                                            </div>
                                        )}
                                        {selectedOrder?.tracking_number && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-muted-foreground uppercase">Seguimiento:</span>
                                                <span className="text-xs font-black uppercase text-blue-500">{selectedOrder.tracking_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                        <Package className="w-3 h-3 text-primary" /> Productos ({selectedOrder?.items.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedOrder?.items.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-card border border-border p-3 rounded-xl">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{item.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">Cant: {item.quantity}</p>
                                                </div>
                                                <span className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total integrado para el PDF - DISEÑO CENTRADO PARA EVITAR CORTES */}
                        <div className="mt-12 pt-8 border-t border-dashed border-border flex flex-col items-center text-center space-y-6">
                            <div className="space-y-1">
                                <p className="text-xs text-primary font-black uppercase tracking-[0.2em]">Gracias por tu compra</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">Punto Padel Shop</p>
                            </div>
                        </div>
                    </ScrollArea>
                    </div>
                    
                    <DialogFooter className="p-8 bg-secondary/10 border-t flex flex-wrap items-center justify-between gap-4">
                        <div className="text-left">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total del Pedido</p>
                            <p className="text-3xl font-black text-primary italic tracking-tighter">{selectedOrder && formatPrice(selectedOrder.total)}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                onClick={handleExportPDF} 
                                variant="outline"
                                size="sm"
                                className="rounded-xl font-heading font-bold uppercase tracking-widest h-8 px-4 text-[9px] border-primary/20 text-primary hover:bg-primary/5"
                            >
                                <Download className="mr-2 w-3 h-3" />
                                Exportar PDF
                            </Button>
                            <Button 
                                onClick={() => setIsDetailsOpen(false)} 
                                size="sm"
                                className="rounded-xl font-heading font-bold uppercase tracking-widest h-8 px-4 text-[9px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            >
                                Cerrar
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isProofOpen} onOpenChange={setIsProofOpen}>
                <DialogContent className="max-w-xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto bg-card border-border rounded-3xl p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tighter">Comprobante de Pago</DialogTitle>
                        <DialogDescription className="text-xs uppercase font-bold tracking-widest">Pedido #{selectedOrder?.order_number}</DialogDescription>
                    </DialogHeader>
                    <div className="aspect-[3/4] bg-secondary/20 rounded-2xl border border-dashed border-border overflow-hidden relative flex items-center justify-center">
                        {selectedOrder?.proof_url?.toLowerCase().endsWith('.pdf') ? (
                            <div className="text-center p-8">
                                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <p className="font-bold text-sm mb-4">El comprobante es un archivo PDF</p>
                                <Button asChild className="rounded-xl" variant="outline">
                                    <a href={selectedOrder.proof_url} target="_blank" rel="noopener noreferrer">Abrir PDF</a>
                                </Button>
                            </div>
                        ) : (
                            <img src={selectedOrder?.proof_url} alt="Comprobante" className="w-full h-full object-contain p-2" />
                        )}
                        <Button asChild variant="secondary" size="sm" className="absolute bottom-4 right-4 rounded-full shadow-lg">
                            <a href={selectedOrder?.proof_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" /> Ampliar
                            </a>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
                <DialogContent className="max-w-md w-[95vw] sm:w-full bg-card border-border rounded-3xl p-4 sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tighter">Cargar Seguimiento</DialogTitle>
                        <DialogDescription className="text-xs uppercase font-bold tracking-widest">Pedido #{selectedOrder?.order_number}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input 
                            placeholder="Número de Guía / Seguimiento" 
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="h-12 rounded-xl bg-secondary/20 border-border font-bold uppercase"
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsTrackingOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancelar</Button>
                        <Button onClick={handleTrackingSubmit} className="rounded-xl font-heading font-bold uppercase tracking-widest h-10 px-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg glow">Guardar y Marcar Enviado</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación para eliminación */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-card border-border rounded-3xl p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-heading font-black text-2xl uppercase tracking-tighter text-red-600 italic">
                            ¿Eliminar definitivamente?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
                            Esta acción no se puede deshacer. Se borrará permanentemente la información del pedido de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px] border-border hover:bg-secondary/20">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            className="rounded-xl font-heading font-bold uppercase tracking-widest h-10 px-8 text-xs bg-red-600 text-white hover:bg-red-700 shadow-lg"
                            onClick={async () => {
                                if (orderToDelete) {
                                    await deleteOrder(orderToDelete);
                                    setOrderToDelete(null);
                                    setIsDeleteDialogOpen(false);
                                }
                            }}
                        >
                            Confirmar Eliminación
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminOrders;
