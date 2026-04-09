import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/data/products';
import { toast } from 'sonner';
import { isOfferExpired } from '@/lib/offer-utils';

interface SiteSettings {
  whatsapp: string;
  shippingFree: number;
  shippingCost: number;
  currency: string;
  promoText: string;
  offerCountdownEnd: string | null;
  offerCountdownEnabled: boolean;
  categoryTags?: Record<string, string>;
}

export type OrderStatus = 'pendiente_de_pago' | 'pendiente_pago_local' | 'pagado' | 'rechazado' | 'enviado' | 'entregado';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  proof_url?: string;
  tracking_number?: string;
  receipt_number?: string;
  created_at: string;
}

interface AdminContextType {
  products: Product[];
  settings: SiteSettings;
  orders: Order[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'priceFormatted'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, extraData?: Partial<Order>) => Promise<void>;
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
  offerCountdownEnabled: true,
  categoryTags: {
    palas: 'MÁS VENDIDO',
    pelotas: '',
    bolsos: '',
    indumentaria: 'NUEVO',
    accesorios: ''
  }
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
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
      const expired = isOfferExpired(settings.offerCountdownEnd, settings.offerCountdownEnabled);
      const formattedProducts: Product[] = data.map(p => {
        // Si las ofertas expiraron, forzamos isOffer a false reactivamente
        const isCurrentlyOffer = expired ? false : p.is_offer;
        
        // Si ya no es oferta (porque expiró), mostramos el precio original como precio actual
        const effectivePrice = isCurrentlyOffer ? p.price : (p.original_price || p.price);
        
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          price: effectivePrice,
          originalPrice: p.original_price,
          priceFormatted: new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
          }).format(effectivePrice).replace("ARS", "$"),
          originalPriceFormatted: (isCurrentlyOffer && p.original_price && p.original_price > p.price) ? new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
          }).format(p.original_price).replace("ARS", "$") : undefined,
          category: p.category,
          image: p.image_url,
          images: p.images || [p.image_url],
          isNew: p.is_new,
          isOffer: isCurrentlyOffer,
          discount: p.discount,
          discountPercentage: p.discount_percentage,
          salesCount: p.sales_count || 0,
          level: p.level,
          type: p.type,
          tag1: p.tag1,
          tag2: p.tag2
        };
      });
      setProducts(formattedProducts);
    }
  };

  const checkAndCleanExpiredOffers = async () => {
    // Solo actuamos si el contador está habilitado y ha expirado
    if (settings.offerCountdownEnabled && isOfferExpired(settings.offerCountdownEnd, true)) {
      console.log("[AdminContext] Ofertas expiradas detectadas. Iniciando limpieza en la base de datos...");
      
      try {
        // 1. Obtener productos que están actualmente marcados como oferta
        const { data: offerProducts, error: fetchError } = await supabase
          .from('products')
          .select('id, original_price')
          .eq('is_offer', true);

        if (fetchError) throw fetchError;

        if (offerProducts && offerProducts.length > 0) {
          console.log(`[AdminContext] Revirtiendo precios de ${offerProducts.length} productos...`);
          
          // 2. Actualizar cada producto: price = original_price y is_offer = false
          const updatePromises = offerProducts.map(p => 
            supabase.from('products')
              .update({ 
                price: p.original_price || null, // Se asume que original_price es el correcto
                is_offer: false, 
                discount: null, 
                discount_percentage: null 
              })
              .eq('id', p.id)
          );
          
          await Promise.all(updatePromises);
        }
        
        // 3. Desactivar contador en settings (DB)
        const { error: settingsError } = await supabase
          .from('offers')
          .update({ active: false })
          .eq('active', true);
          
        if (settingsError) throw settingsError;
        
        console.log("[AdminContext] Limpieza completa: precios revertidos y contador desactivado.");
        toast.info("Ofertas finalizadas: los precios han vuelto a su valor original.");
        
        // 4. Recargar todo para asegurar consistencia
        await Promise.all([fetchProducts(), fetchSettings()]);
      } catch (err) {
        console.error("[AdminContext] Error en la limpieza automática de ofertas:", err);
      }
    }
  };

  const fetchSettings = async () => {
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
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    if (data) {
      setOrders(data as Order[]);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, extraData?: Partial<Order>) => {
    try {
      console.log(`[AdminContext] Actualizando pedido ${orderId} a estado: ${status}`);
      
      // Construir objeto de actualización limpio
      const updateData: any = { status };
      if (extraData?.tracking_number !== undefined) updateData.tracking_number = extraData.tracking_number;
      if (extraData?.receipt_number !== undefined) updateData.receipt_number = extraData.receipt_number;

      console.log(`[AdminContext] Datos enviados a Supabase:`, updateData);
      
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();

      if (error) {
        console.error('[AdminContext] Error de Supabase:', error);
        toast.error('Error al actualizar en la base de datos: ' + error.message);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('[AdminContext] No se actualizó ninguna fila. Verificá políticas RLS.');
        toast.error('No se pudo guardar: Error de permisos (RLS).');
        return;
      }

      console.log('[AdminContext] Actualización exitosa:', data);
      toast.success(`Pedido actualizado a ${status.replace(/_/g, ' ')}`);
      
      // Refrescar la lista de pedidos localmente
      await fetchOrders();
    } catch (err) {
      console.error('[AdminContext] Excepción en actualización:', err);
      toast.error('Ocurrió un error inesperado al actualizar.');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchSettings(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Efecto para monitorear la expiración de ofertas
  useEffect(() => {
    if (!loading) {
      checkAndCleanExpiredOffers();
    }
  }, [settings.offerCountdownEnd, settings.offerCountdownEnabled, loading]);

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
        type: newProduct.type,
        tag1: newProduct.tag1,
        tag2: newProduct.tag2
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
    if (updatedFields.tag1 !== undefined) updateData.tag1 = updatedFields.tag1;
    if (updatedFields.tag2 !== undefined) updateData.tag2 = updatedFields.tag2;

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
      orders,
      fetchOrders,
      updateOrderStatus,
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
