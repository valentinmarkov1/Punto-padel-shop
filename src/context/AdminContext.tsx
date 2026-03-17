import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, Product } from '@/data/products';

interface SiteSettings {
  whatsapp: string;
  shippingFree: number;
  shippingCost: number;
  currency: string;
  promoText: string;
}

interface AdminContextType {
  products: Product[];
  settings: SiteSettings;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'priceFormatted'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'admin_products';
const STORAGE_KEY_SETTINGS = 'admin_settings';

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: '1138582368',
  shippingFree: 100000,
  shippingCost: 8500,
  currency: 'ARS',
  promoText: 'Envío gratis en compras superiores a $100.000'
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts as Product[]);
    }

    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'slug' | 'priceFormatted'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const slug = generateSlug(newProduct.name);
    const priceFormatted = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(newProduct.price).replace("ARS", "$");

    const product: Product = {
      ...newProduct,
      id,
      slug,
      priceFormatted,
      salesCount: 0
    };

    setProducts([...products, product]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const product = { ...p, ...updatedFields };
        if (updatedFields.name) {
          product.slug = generateSlug(updatedFields.name);
        }
        if (updatedFields.price) {
          product.priceFormatted = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
          }).format(updatedFields.price).replace("ARS", "$");
        }
        return product;
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  return (
    <AdminContext.Provider value={{ products, settings, addProduct, updateProduct, deleteProduct, updateSettings }}>
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
