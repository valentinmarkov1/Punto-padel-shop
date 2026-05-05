import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    subtotal: number;
    shippingCost: number;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, quantityToAdd: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
            const stockAvailable = product.stock ?? 0;

            if (currentQuantityInCart + quantityToAdd > stockAvailable) {
                toast.error(`Lo sentimos, solo quedan ${stockAvailable} unidades disponibles de ${product.name}`);
                return prevItems;
            }

            if (existingItem) {
                toast.success(`Se aumentó la cantidad de ${product.name}`);
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            }
            toast.success(`${product.name} agregado al carrito`);
            return [...prevItems, { ...product, quantity: quantityToAdd }];
        });
    };

    const removeItem = (productId: string) => {
        setItems((prevItems) => {
            const item = prevItems.find((i) => i.id === productId);
            if (item) {
                toast.error(`${item.name} eliminado del carrito`);
            }
            return prevItems.filter((item) => item.id !== productId);
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prevItems) => {
            const item = prevItems.find((i) => i.id === productId);
            if (item && quantity > (item.stock ?? 0)) {
                toast.error(`Solo hay ${item.stock} unidades disponibles`);
                return prevItems;
            }
            return prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    };

    const clearCart = () => {
        setItems([]);
        toast.info("Carrito vaciado");
    };

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const SHIPPING_THRESHOLD = 350000;
    const FIXED_SHIPPING_COST = 25000;

    const shippingCost = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FIXED_SHIPPING_COST;
    const total = subtotal + shippingCost;

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                subtotal,
                shippingCost,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
