import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useForm } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, Bell, Globe, MessageCircle, Truck } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  
  const form = useForm({
    defaultValues: settings,
  });

  React.useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

  const onSubmit = (values: any) => {
    updateSettings(values);
    toast.success('Configuración actualizada correctamente');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="font-heading font-black text-4xl uppercase italic tracking-tighter">Configuración</h1>
        <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">Ajustes globales de la plataforma</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="bg-secondary/10 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <CardTitle className="font-heading font-black text-xl uppercase italic tracking-tighter">Contacto</CardTitle>
                </div>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Información de comunicación con el cliente</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Número de WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary/20 h-11 rounded-xl" />
                      </FormControl>
                      <FormDescription className="text-[9px] uppercase font-bold">Sin símbolos ni espacios (ej: 1138582368)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="bg-secondary/10 border-b border-border">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <CardTitle className="font-heading font-black text-xl uppercase italic tracking-tighter">Envíos</CardTitle>
                </div>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Costos y beneficios de logística</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingFree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Envío Gratis desde</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-secondary/20 h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Costo de Envío</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-secondary/20 h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-border rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="bg-secondary/10 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle className="font-heading font-black text-xl uppercase italic tracking-tighter">Comunicación</CardTitle>
                </div>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Textos promocionales y alertas</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="promoText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Banner Promocional</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary/20 h-11 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="rounded-xl h-12 px-10 uppercase font-bold text-xs tracking-widest glow gap-2">
              <Save className="w-5 h-5" />
              Guardar Configuración
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettings;
