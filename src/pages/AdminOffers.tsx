import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, Plus, MoreVertical, Edit, Search, Save, Clock, Trash2, AlertCircle } from 'lucide-react';
import { isOfferExpired } from '@/lib/offer-utils';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const AdminOffers = () => {
  const { products, settings, updateSettings } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const [countdownEnd, setCountdownEnd] = useState(settings.offerCountdownEnd || '');
  const [countdownEnabled, setCountdownEnabled] = useState(settings.offerCountdownEnabled);

  useEffect(() => {
    setCountdownEnd(settings.offerCountdownEnd || '');
    setCountdownEnabled(settings.offerCountdownEnabled);
  }, [settings.offerCountdownEnd, settings.offerCountdownEnabled]);

  const handleSaveSettings = () => {
    updateSettings({
      offerCountdownEnd: countdownEnd || null,
      offerCountdownEnabled: countdownEnabled
    });
    toast.success('Configuración de ofertas actualizada');
  };

  const handleResetCountdown = () => {
    setCountdownEnd('');
    updateSettings({ offerCountdownEnd: null });
    toast.success('Contador reseteado');
  };

  const offerProducts = products.filter(p => p.isOffer);
  const filteredOffers = offerProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-4xl uppercase italic tracking-tighter">Ofertas</h1>
          <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">Gestiona promociones y descuentos</p>
        </div>
      </div>

      {settings.offerCountdownEnabled && isOfferExpired(settings.offerCountdownEnd, true) && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="bg-orange-500/20 p-3 rounded-xl">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-heading font-black text-lg uppercase italic tracking-tighter text-orange-600">Ofertas Finalizadas</h3>
            <p className="text-xs font-medium text-orange-600/80 uppercase tracking-wider">
              El contador ha llegado a cero. El sistema ha desactivado automáticamente las etiquetas de oferta en toda la tienda.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleResetCountdown}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-orange-500/20 text-orange-600 hover:bg-orange-500/10"
          >
            Limpiar y Resetear Contador
          </Button>
        </div>
      )}

      <Card className="border-border rounded-2xl overflow-hidden shadow-sm mb-8 bg-card">
        <CardHeader className="bg-secondary/10 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <CardTitle className="font-heading font-black text-xl uppercase italic tracking-tighter">Configuración del Contador</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest">
            Ajusta la fecha de finalización y visibilidad del contador de ofertas
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fecha y Hora de Cierre</label>
              <Input 
                type="datetime-local" 
                value={countdownEnd}
                onChange={(e) => setCountdownEnd(e.target.value)}
                className="bg-secondary/20 h-11 rounded-xl w-full"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/5 h-11 mt-6">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground cursor-pointer" htmlFor="countdown-toggle">
                Activar Contador
              </label>
              <Switch 
                id="countdown-toggle"
                checked={countdownEnabled} 
                onCheckedChange={setCountdownEnabled} 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleResetCountdown} className="rounded-xl h-10 px-6 uppercase font-bold text-xs tracking-widest gap-2 text-destructive border-destructive/20 hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
              Resetear
            </Button>
            <Button onClick={handleSaveSettings} className="rounded-xl h-10 px-6 uppercase font-bold text-xs tracking-widest gap-2">
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar ofertas..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl bg-card border-border"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Producto</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Precio Oferta</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Precio Normal</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Descuento</TableHead>
              <TableHead className="text-right uppercase text-[10px] font-black tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-bold">{product.name}</TableCell>
                <TableCell className="font-heading font-black text-primary">{product.priceFormatted}</TableCell>
                <TableCell className="text-muted-foreground line-through decoration-destructive/50">{product.originalPriceFormatted}</TableCell>
                <TableCell>
                  {product.discountPercentage ? (
                    <Badge className="bg-orange-500 rounded-lg">-{product.discountPercentage}%</Badge>
                  ) : (
                    <Badge className="bg-orange-500 rounded-lg">{product.discount || 'OFERTA'}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredOffers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No hay ofertas activas que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
