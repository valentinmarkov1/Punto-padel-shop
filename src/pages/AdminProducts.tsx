import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Tag as TagIcon,
  Star as StarIcon,
  Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from './ProductForm';

const AdminProducts = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      deleteProduct(id);
      toast.success('Producto eliminado correctamente');
    }
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsEditing(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleFormSubmit = (values: any) => {
    const productData = {
      ...values,
      images: [values.image, ...values.additionalImages],
      priceFormatted: `$${values.price.toLocaleString('es-AR')}`,
      originalPriceFormatted: values.originalPrice ? `$${values.originalPrice.toLocaleString('es-AR')}` : undefined
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Producto actualizado correctamente');
    } else {
      addProduct(productData);
      toast.success('Producto creado correctamente');
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-4xl uppercase italic tracking-tighter">Productos</h1>
          <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">Gestiona el catálogo de tu tienda</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="rounded-xl font-heading font-bold uppercase tracking-widest gap-2 glow h-12"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o categoría..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl bg-card border-border"
          />
        </div>
        <Button variant="outline" className="rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Producto</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Categoría</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Precio</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-widest">Estado</TableHead>
              <TableHead className="text-right uppercase text-[10px] font-black tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-secondary/10 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden border border-border flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">ID: {product.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg text-[10px] font-black uppercase tracking-widest bg-secondary/50">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-heading font-black text-base">{product.priceFormatted}</span>
                    {product.isOffer && product.originalPrice && (
                      <span className="text-[10px] text-muted-foreground line-through font-bold">{product.originalPriceFormatted}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {product.isOffer && (
                      <div title="En Oferta">
                        <TagIcon className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                      </div>
                    )}
                    {product.isNew && (
                      <Badge className="bg-blue-500 text-[8px] px-1 h-4">NEW</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl p-2 border-border">
                      <DropdownMenuItem 
                        onClick={() => handleEdit(product)}
                        className="rounded-lg gap-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest group"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest group">
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        Ver en tienda
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="rounded-lg gap-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest text-destructive hover:bg-destructive/5 group"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg uppercase tracking-tighter italic">No se encontraron productos</h3>
            <p className="text-muted-foreground text-sm">Prueba ajustando los términos de búsqueda</p>
          </div>
        )}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-border p-8">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-3xl uppercase italic tracking-tighter">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm 
            product={editingProduct} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsEditing(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
