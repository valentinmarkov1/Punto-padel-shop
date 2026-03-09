import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import { SobreNosotros, Terminos, Envios, Devoluciones, MetodosPago, Contacto } from "./pages/StaticPages";
import NotFound from "./pages/NotFound";
import WhatsAppWidget from "./components/WhatsAppWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:slug" element={<ProductoDetalle />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/envios" element={<Envios />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/metodos-de-pago" element={<MetodosPago />} />
            <Route path="/contacto" element={<Contacto />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppWidget />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
