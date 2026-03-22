import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/data/products';
import { toast } from 'sonner';

interface SiteSettings {
  whatsapp: string;
  shippingFree: number;
  shippingCost: number;
  currency: string;
  promoText: string;
  offerCountdownEnd: string | null;
  offerCountdownEnabled: boolean;
}

interface AdminContextType {
  products: Product[];
  settings: SiteSettings;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'priceFormatted'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: '1138582368',
  shippingFree: 100000,
  shippingCost: 8500,
  currency: 'ARS',
  promoText: 'Envío gratis en compras superiores a $100.000',
  offerCountdownEnd: null,
  offerCountdownEnabled: true
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    if (data) {
      const formattedProducts: Product[] = data.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        price: p.price,
        originalPrice: p.original_price,
        priceFormatted: new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 0,
        }).format(p.price).replace("ARS", "$"),
        originalPriceFormatted: (p.is_offer && p.original_price && p.original_price > p.price) ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 0,
        }).format(p.original_price).replace("ARS", "$") : undefined,
        category: p.category,
        image: p.image_url,
        images: p.images || [p.image_url],
        isNew: p.is_new,
        isOffer: p.is_offer,
        discount: p.discount,
        discountPercentage: p.discount_percentage,
        salesCount: p.sales_count || 0,
        level: p.level,
        type: p.type
      }));
      setProducts(formattedProducts);
    }
  };

  const fetchSettings = async () => {
    // We'll use the 'offers' table for the countdown and a 'settings' table or similar for the rest.
    // Given the constraints, let's assume 'offers' table stores the countdown and maybe others.
    // For now, let's try to fetch specifically the countdown from 'offers'.
    const { data: offersData, error: offersError } = await supabase
      .from('offers')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!offersError && offersData) {
      setSettings(prev => ({
        ...prev,
        offerCountdownEnd: offersData.end_date,
        offerCountdownEnabled: offersData.active
      }));
    }
    
    // In a real scenario, we'd also have a 'site_settings' table.
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchSettings()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const addProduct = async (newProduct: Omit<Product, 'id' | 'slug' | 'priceFormatted'>) => {
    const slug = generateSlug(newProduct.name);
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: newProduct.name,
        slug,
        description: newProduct.description,
        price: newProduct.price,
        original_price: newProduct.originalPrice,
        category: newProduct.category,
        image_url: newProduct.image,
        images: newProduct.images,
        is_new: newProduct.isNew,
        is_offer: newProduct.isOffer,
        discount: newProduct.discount,
        discount_percentage: newProduct.discountPercentage,
        sales_count: 0,
        level: newProduct.level,
        type: newProduct.type
      }])
      .select();

    if (error) {
      toast.error('Error al guardar el producto: ' + error.message);
      return;
    }

    toast.success('Producto agregado correctamente');
    await fetchProducts();
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const updateData: any = {};
    if (updatedFields.name) {
      updateData.name = updatedFields.name;
      updateData.slug = generateSlug(updatedFields.name);
    }
    if (updatedFields.description !== undefined) updateData.description = updatedFields.description;
    if (updatedFields.price !== undefined) updateData.price = updatedFields.price;
    if (updatedFields.originalPrice !== undefined) updateData.original_price = updatedFields.originalPrice;
    if (updatedFields.category) updateData.category = updatedFields.category;
    if (updatedFields.image) updateData.image_url = updatedFields.image;
    if (updatedFields.images) updateData.images = updatedFields.images;
    if (updatedFields.isNew !== undefined) updateData.is_new = updatedFields.isNew;
    if (updatedFields.isOffer !== undefined) updateData.is_offer = updatedFields.isOffer;
    if (updatedFields.discount !== undefined) updateData.discount = updatedFields.discount;
    if (updatedFields.discountPercentage !== undefined) updateData.discount_percentage = updatedFields.discountPercentage;
    if (updatedFields.level !== undefined) updateData.level = updatedFields.level;
    if (updatedFields.type !== undefined) updateData.type = updatedFields.type;

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast.error('Error al actualizar: ' + error.message);
      return;
    }

    toast.success('Producto actualizado');
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar: ' + error.message);
      return;
    }

    toast.success('Producto eliminado');
    await fetchProducts();
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    // If offer countdown is being updated
    if (newSettings.offerCountdownEnd !== undefined || newSettings.offerCountdownEnabled !== undefined) {
      const { data: currentOffer } = await supabase.from('offers').select('id').limit(1).maybeSingle();
      
      const offerData = {
        end_date: newSettings.offerCountdownEnd !== undefined ? newSettings.offerCountdownEnd : settings.offerCountdownEnd,
        active: newSettings.offerCountdownEnabled !== undefined ? newSettings.offerCountdownEnabled : settings.offerCountdownEnabled
      };

      if (currentOffer) {
        await supabase.from('offers').update(offerData).eq('id', currentOffer.id);
      } else {
        await supabase.from('offers').insert([offerData]);
      }
    }

    setSettings({ ...settings, ...newSettings });
  };

  return (
    <AdminContext.Provider value={{ 
      products, 
      settings, 
      loading, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateSettings,
      refreshProducts: fetchProducts
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
