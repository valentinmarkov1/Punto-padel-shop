import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, Plus, MoreVertical, Edit, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  const { products } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

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

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar ofertas..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl bg-card border-border"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
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
