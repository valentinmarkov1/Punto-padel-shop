import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Checkout from "./pages/Checkout";
import Carrito from "./pages/Carrito";
import { SobreNosotros, Terminos, Envios, Devoluciones, MetodosPago, Contacto } from "./pages/StaticPages";
import NotFound from "./pages/NotFound";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:slug" element={<ProductoDetalle />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/terminos" element={<Terminos />} />
                <Route path="/envios" element={<Envios />} />
                <Route path="/devoluciones" element={<Devoluciones />} />
                <Route path="/metodos-de-pago" element={<MetodosPago />} />
                <Route path="/contacto" element={<Contacto />} />
                
                {/* Admin Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <WhatsAppWidget />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
