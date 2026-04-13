import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Star, 
  Database, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminProducts from './AdminProducts';
import AdminSettings from './AdminSettings';
import AdminOffers from './AdminOffers';
import AdminFeatured from './AdminFeatured';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Pedidos', icon: ShoppingBag, path: '/admin/pedidos' },
    { name: 'Productos', icon: Package, path: '/admin/productos' },
    { name: 'Ofertas', icon: Tag, path: '/admin/ofertas' },
    { name: 'Destacados', icon: Star, path: '/admin/destacados' },
    { name: 'Configuración', icon: Settings, path: '/admin/configuracion' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        {sidebarOpen && (
          <Link to="/admin" className="font-heading font-black text-xl italic tracking-tighter">
            ADMIN <span className="text-primary">CENTER</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hidden md:flex"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                active 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
              {sidebarOpen && <span className="font-bold uppercase text-xs tracking-widest">{item.name}</span>}
              {sidebarOpen && active && <ChevronRight className="ml-auto w-4 h-4 opacity-50 hidden md:block" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl p-3"
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="font-bold uppercase text-xs tracking-widest">Salir</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-secondary/10 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 hidden md:flex flex-col z-50`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 flex flex-col pt-10">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <Zap className="w-4 h-4 text-primary hidden sm:block" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic truncate max-w-[150px] sm:max-w-none">Gestión en vivo</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase text-[10px] tracking-widest" onClick={() => navigate('/')}>
              Ver Tienda
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/productos" element={<AdminProducts />} />
            <Route path="/pedidos" element={<AdminOrders />} />
            <Route path="/ofertas" element={<AdminOffers />} />
            <Route path="/destacados" element={<AdminFeatured />} />
            <Route path="/configuracion" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

import { useAdmin } from '@/context/AdminContext';

const Overview = () => {
  const { products, orders } = useAdmin();
  
  const stats = [
    { 
      label: 'Pendientes', 
      value: orders.filter(o => o.status === 'pendiente_de_pago').length.toString(), 
      icon: ShoppingBag, 
      color: 'text-orange-500' 
    },
    { 
      label: 'Productos', 
      value: products.length.toString(), 
      icon: Package, 
      color: 'text-blue-500' 
    },
    { 
      label: 'En Oferta', 
      value: products.filter(p => p.isOffer).length.toString(), 
      icon: Tag, 
      color: 'text-emerald-500' 
    },
    { 
      label: 'Destacados', 
      value: products.filter(p => p.isNew).length.toString(), 
      icon: Star, 
      color: 'text-yellow-500' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="font-heading font-black text-4xl uppercase italic tracking-tighter">Resumen General</h1>
        <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">Métricas clave de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-secondary/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black italic tracking-tighter uppercase">{stat.value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-heading font-black text-2xl uppercase italic tracking-tighter mb-2">Listo para despegar</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Desde aquí podrás gestionar todo el contenido de tu tienda. Navega por las secciones del menú lateral para comenzar.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
