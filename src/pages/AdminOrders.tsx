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
    Package
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendEmailNotification } from '@/lib/email-service';
import { toast } from 'sonner';

const AdminOrders = () => {
    const { orders, updateOrderStatus, loading } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProofOpen, setIsProofOpen] = useState(false);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(price).replace("ARS", "$");
    };

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'pendiente_de_pago': return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 uppercase text-[10px] font-black">Pendiente de Pago</Badge>;
            case 'pagado': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 uppercase text-[10px] font-black">Pagado</Badge>;
            case 'rechazado': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 uppercase text-[10px] font-black">Rechazado</Badge>;
            case 'enviado': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 uppercase text-[10px] font-black">Enviado</Badge>;
            case 'entregado': return <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 uppercase text-[10px] font-black">Entregado</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px] font-black">{status}</Badge>;
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
        const receiptNumber = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
        await updateOrderStatus(order.id, 'pagado', { receipt_number: receiptNumber });
        
        // Enviar email de confirmación de pago
        await sendEmailNotification('payment_received', { ...order, status: 'pagado', receipt_number: receiptNumber });
        toast.success(`Pago aprobado. Recibo generado: ${receiptNumber}`);
    };

    const handleTrackingSubmit = async () => {
        if (!selectedOrder || !trackingNumber) return;
        
        await updateOrderStatus(selectedOrder.id, 'enviado', { tracking_number: trackingNumber });
        
        // Enviar email con seguimiento opcionalmente
        await sendEmailNotification('payment_received', { ...selectedOrder, status: 'enviado', tracking_number: trackingNumber });
        
        setIsTrackingOpen(false);
        setTrackingNumber('');
        toast.success(`Número de seguimiento guardado: ${trackingNumber}`);
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
                
                <div className="flex flex-wrap gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar pedido, cliente..." 
                            className="pl-10 h-11 rounded-xl bg-card border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 bg-card border border-border px-3 rounded-xl">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select 
                            className="bg-transparent border-none text-xs font-bold uppercase tracking-widest focus:ring-0 p-2 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="todos">TODOS</option>
                            <option value="pendiente_de_pago">PENDIENTES</option>
                            <option value="pagado">PAGADOS</option>
                            <option value="enviado">ENVIADOS</option>
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
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                                {order.payment_method === 'transferencia' ? '🏦 Transferencia' : '💳 Mercado Pago'}
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

                                                {order.status === 'pendiente_de_pago' && (
                                                    <>
                                                        <DropdownMenuItem className="p-3 cursor-pointer text-green-600" onClick={() => handleApprove(order)}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            <span className="font-bold text-xs uppercase tracking-wider">Aprobar Pago</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 cursor-pointer text-red-600" onClick={() => updateOrderStatus(order.id, 'rechazado')}>
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            <span className="font-bold text-xs uppercase tracking-wider">Rechazar Pago</span>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}

                                                {order.status === 'pagado' && (
                                                    <DropdownMenuItem className="p-3 cursor-pointer text-blue-600" onClick={() => { setSelectedOrder(order); setIsTrackingOpen(true); }}>
                                                        <Truck className="w-4 h-4 mr-2" />
                                                        <span className="font-bold text-xs uppercase tracking-wider">Cargar Seguimiento</span>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Detalles */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl bg-card border-border rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-secondary/30 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <DialogTitle className="font-heading font-black text-3xl uppercase italic tracking-tighter">Pedido #{selectedOrder?.order_number}</DialogTitle>
                                <DialogDescription className="text-xs uppercase font-bold tracking-widest mt-1">Realizado el {selectedOrder && new Date(selectedOrder.created_at).toLocaleString()}</DialogDescription>
                            </div>
                            {selectedOrder && getStatusBadge(selectedOrder.status)}
                        </div>
                    </DialogHeader>
                    
                    <ScrollArea className="max-h-[60vh] p-8">
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
                                                    <p className="text-xs font-black uppercase tracking-tight truncate">{item.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">Cant: {item.quantity}</p>
                                                </div>
                                                <span className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    
                    <DialogFooter className="p-8 bg-secondary/10 border-t flex flex-wrap items-center justify-between gap-4">
                        <div className="text-left">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total del Pedido</p>
                            <p className="text-3xl font-black text-primary italic tracking-tighter">{selectedOrder && formatPrice(selectedOrder.total)}</p>
                        </div>
                        <Button 
                            onClick={() => setIsDetailsOpen(false)} 
                            className="rounded-xl font-heading font-bold uppercase tracking-widest h-10 px-6 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        >
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Comprobante */}
            <Dialog open={isProofOpen} onOpenChange={setIsProofOpen}>
                <DialogContent className="max-w-xl bg-card border-border rounded-3xl p-6">
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
                        <Button 
                            asChild 
                            variant="secondary" 
                            size="sm" 
                            className="absolute bottom-4 right-4 rounded-full shadow-lg"
                        >
                            <a href={selectedOrder?.proof_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" /> Ampliar
                            </a>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Seguimiento */}
            <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
                <DialogContent className="max-w-md bg-card border-border rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tighter">Cargar Seguimiento</DialogTitle>
                        <DialogDescription className="text-xs uppercase font-bold tracking-widest">Pedido #{selectedOrder?.order_number}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Número de Guía / Seguimiento</label>
                            <Input 
                                placeholder="Ej: AR123456789" 
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="h-12 rounded-xl bg-secondary/20 border-border font-bold uppercase"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsTrackingOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancelar</Button>
                        <Button onClick={handleTrackingSubmit} className="rounded-xl font-heading font-bold uppercase tracking-widest h-10 px-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 glow">Guardar y Notificar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminOrders;
