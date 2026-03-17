import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Star, LayoutGrid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AdminFeatured = () => {
  const { products, updateProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  // Para este MVP, consideraremos "isNew" o products con salesCount alto como candidatos a destacados
  // o simplemente los que tengan un flag (que añadiremos si no existe).
  // La interfaz permitirá marcar/desmarcar.
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-4xl uppercase italic tracking-tighter">Destacados</h1>
          <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">Selecciona productos para la Home</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar productos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl bg-card border-border"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className={`bg-card border-2 rounded-2xl p-4 transition-all relative group ${
              product.isNew ? 'border-primary shadow-lg shadow-primary/5' : 'border-border'
            }`}
          >
            <div className="w-full aspect-square rounded-xl bg-secondary mb-4 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black mb-4">{product.category}</p>
            
            <Button 
              size="sm"
              variant={product.isNew ? 'default' : 'outline'}
              className="w-full rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest"
              onClick={() => updateProduct(product.id, { isNew: !product.isNew })}
            >
              <Star className={`w-3 h-3 ${product.isNew ? 'fill-current' : ''}`} />
              {product.isNew ? 'Destacado' : 'Marcar Destacado'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeatured;
