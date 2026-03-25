import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImagePlus, X, Save, Upload, Info, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  originalPrice: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  price: z.coerce.number().min(1),
  category: z.enum(['Palas', 'Pelotas', 'Bolsos', 'Indumentaria', 'Accesorios']),
  image: z.string().min(1, 'La imagen principal es obligatoria'),
  additionalImages: z.array(z.string()).default([]),
  isOffer: z.boolean().default(false),
  isNew: z.boolean().default(false),
  level: z.string().optional(),
  type: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      originalPrice: product?.originalPrice || product?.price || 0,
      discountPercentage: product?.discountPercentage || 0,
      price: product?.price || 0,
      category: (product?.category as any) || 'Palas',
      image: product?.image || '',
      additionalImages: product?.images?.slice(1) || [],
      isOffer: product?.isOffer || false,
      isNew: product?.isNew || false,
      level: product?.level || '',
      type: product?.type || '',
    },
  });

  const category = form.watch('category');
  const isOffer = form.watch('isOffer');
  const originalPrice = form.watch('originalPrice');
  const discountPercentage = form.watch('discountPercentage');

  // Calcular precio final automáticamente
  useEffect(() => {
    if (isOffer && discountPercentage > 0) {
      const finalPrice = originalPrice - (originalPrice * (discountPercentage / 100));
      form.setValue('price', Math.round(finalPrice));
    } else {
      form.setValue('price', originalPrice);
    }
  }, [originalPrice, discountPercentage, isOffer, form]);

  const getImageLimit = (cat: string) => {
    switch (cat) {
      case 'Palas': return 4;
      case 'Pelotas': return 2;
      case 'Bolsos': return 3;
      case 'Indumentaria': return 1;
      case 'Accesorios': return 0;
      default: return 0;
    }
  };

  const currentLimit = getImageLimit(category);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Solo se aceptan formatos JPG, PNG y WEBP');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (isMain) {
        form.setValue('image', publicUrl);
      } else if (index !== undefined) {
        const currentImages = [...form.getValues('additionalImages')];
        currentImages[index] = publicUrl;
        form.setValue('additionalImages', currentImages);
      } else {
        const currentImages = [...form.getValues('additionalImages')];
        if (currentImages.length < currentLimit) {
          form.setValue('additionalImages', [...currentImages, publicUrl]);
        }
      }
      toast.success('Imagen subida correctamente');
    } catch (error: any) {
      toast.error('Error al subir imagen: ' + (error.message || 'Error desconocido'));
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const currentImages = [...form.getValues('additionalImages')];
    currentImages.splice(index, 1);
    form.setValue('additionalImages', currentImages);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-secondary/20 h-11 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-secondary/20 min-h-[100px] rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/20 h-11 rounded-xl">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border">
                        <SelectItem value="Palas">Palas</SelectItem>
                        <SelectItem value="Pelotas">Pelotas</SelectItem>
                        <SelectItem value="Bolsos">Bolsos</SelectItem>
                        <SelectItem value="Indumentaria">Indumentaria</SelectItem>
                        <SelectItem value="Accesorios">Accesorios</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {category === 'Palas' && (
                <div className="grid grid-cols-2 gap-4 col-span-2 animate-in slide-in-from-top-2 duration-300">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Tipo de Juego</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-primary/5 border-primary/20 h-11 rounded-xl">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-border">
                            <SelectItem value="Control">Control</SelectItem>
                            <SelectItem value="Potencia">Potencia</SelectItem>
                            <SelectItem value="Polivalente">Polivalente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] font-black tracking-widest text-primary">Nivel</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-primary/5 border-primary/20 h-11 rounded-xl">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-border">
                            <SelectItem value="Principiante">Principiante</SelectItem>
                            <SelectItem value="Intermedio">Intermedio</SelectItem>
                            <SelectItem value="Avanzado">Avanzado</SelectItem>
                            <SelectItem value="Profesional">Profesional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-2">
                <FormLabel className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Precio Final</FormLabel>
                <div className="h-11 bg-primary/5 border border-primary/20 rounded-xl flex items-center px-4 font-heading font-black text-primary animate-in fade-in zoom-in-95">
                  ${form.watch('price').toLocaleString()}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isOffer ? 'bg-orange-500/5 border-orange-500/20' : 'bg-secondary/5 border-border'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOffer ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Info className="w-4 h-4" />
                  </div>
                  <FormLabel className="uppercase text-[10px] font-black tracking-widest leading-none">Configuración Comercial</FormLabel>
                </div>
                <FormField
                  control={form.control}
                  name="isOffer"
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest opacity-60">Precio Base ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-background h-10 rounded-lg" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isOffer && (
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-left-2">
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-orange-600">% Descuento</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="bg-background h-10 rounded-lg pr-8" min="0" max="100" />
                            <span className="absolute right-3 top-2.5 text-xs font-bold">%</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <div className="flex items-center justify-between p-4 bg-secondary/5 border border-border rounded-2xl">
                  <FormLabel className="uppercase text-[10px] font-black tracking-widest leading-none">Marcar como Destacado</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </div>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <FormLabel className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
                Imagen Principal <span className="text-destructive">*</span>
              </FormLabel>
              <div className="relative group aspect-video bg-secondary/20 rounded-2xl border-2 border-dashed border-border overflow-hidden hover:border-primary/50 transition-colors">
                {form.watch('image') ? (
                  <>
                    <img src={form.watch('image')} alt="Main" className="w-full h-full object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => form.setValue('image', '')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2">
                    {isUploading ? (
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={isUploading} />
                  </label>
                )}
              </div>
            </div>

            {currentLimit > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">
                    Imágenes Adicionales ({form.watch('additionalImages').length}/{currentLimit})
                  </FormLabel>
                  {form.watch('additionalImages').length < currentLimit && (
                    <label className={`text-primary hover:text-primary/80 cursor-pointer flex items-center gap-1 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Plus className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Agregar</span>
                      {!isUploading && <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />}
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {form.watch('additionalImages').map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl border border-border overflow-hidden bg-secondary/10 group">
                      <img src={img} alt={`Additional ${idx}`} className="w-full h-full object-cover" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeAdditionalImage(idx)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {Array.from({ length: currentLimit - form.watch('additionalImages').length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="aspect-square rounded-xl border border-dashed border-border flex items-center justify-center bg-secondary/5">
                      <ImagePlus className="w-5 h-5 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl h-12 px-8 uppercase font-bold text-xs tracking-widest">
            Cancelar
          </Button>
          <Button type="submit" className="rounded-xl h-12 px-8 uppercase font-bold text-xs tracking-widest glow gap-2" disabled={isUploading}>
            <Save className="w-5 h-5" />
            {product ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
