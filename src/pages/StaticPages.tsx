import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageProps {
    title: string;
    children: React.ReactNode;
}

const BasePage = ({ title, children }: PageProps) => (
    <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">
                {title}
            </h1>
            <div className="prose prose-invert max-w-4xl text-muted-foreground">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

export const SobreNosotros = () => (
    <BasePage title="Sobre nosotros">
        <div className="space-y-6 text-lg">
            <p>En <span className="text-primary font-bold">Punto Pádel</span>, no solo vendemos equipamiento; vivimos el deporte.</p>
            <p>Nuestra misión es proporcionar a cada jugador, desde el principiante hasta el profesional, las herramientas necesarias para dominar la cancha. Seleccionamos cuidadosamente cada producto de nuestro catálogo para asegurar los más altos estándares de calidad y rendimiento.</p>
            <p>Fundada con la pasión de llevar el pádel al siguiente nivel, nos hemos convertido en el referente para los apasionados que buscan lo último en tecnología y diseño. No vendemos palas, vendemos dominio.</p>
        </div>
    </BasePage>
);

export const Envios = () => (
    <BasePage title="Envíos">
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Tiempos de envío</h2>
                <p>Realizamos despachos en un plazo de 24 a 48 horas hábiles tras la confirmación de compra. El tiempo de entrega final depende de la ubicación, variando generalmente entre 2 y 5 días hábiles.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Zonas de envío</h2>
                <p>Contamos con cobertura nacional. Realizamos envíos a todas las provincias y localidades del país a través de los principales operadores logísticos.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Costos de envío</h2>
                <p>El costo se calcula automáticamente al ingresar tu código postal en el carrito de compras. ¡Atención! Ofrecemos <strong>Envío Gratis</strong> en compras superiores al monto indicado en nuestra barra superior.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Proceso de despacho</h2>
                <p>Una vez que tu pedido sale de nuestro depósito, recibirás un correo electrónico con el número de seguimiento para que puedas monitorear tu paquete en tiempo real.</p>
            </section>
        </div>
    </BasePage>
);

export const Devoluciones = () => (
    <BasePage title="Devoluciones">
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Política de cambios</h2>
                <p>Aceptamos cambios de productos por talle o modelo, siempre que el producto se encuentre en las mismas condiciones en que fue entregado (sin uso, con etiquetas y embalaje original).</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Condiciones de devolución</h2>
                <p>Las devoluciones por falla de fábrica están cubiertas por nuestra garantía. Para devoluciones por arrepentimiento, el producto debe estar precintado y sin señales de uso.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Plazo para cambios</h2>
                <p>Disponés de <strong>30 días corridos</strong> desde la recepción del producto para solicitar un cambio o devolución.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Cómo iniciar un proceso</h2>
                <p>Contactanos vía WhatsApp o correo electrónico indicando tu número de pedido y el motivo del cambio. Nuestro equipo te guiará en los pasos a seguir para el reenvío.</p>
            </section>
        </div>
    </BasePage>
);

export const MetodosPago = () => (
    <BasePage title="Métodos de pago">
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Medios de pago disponibles</h2>
                <p>Aceptamos pagos a través de plataformas seguras como Mercado Pago, permitiéndote abonar con saldo en cuenta, tarjetas o efectivo en puntos de pago.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Tarjetas aceptadas</h2>
                <p>Podés utilizar todas las tarjetas de crédito y débito: Visa, Mastercard, American Express, Cabal, entre otras.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Pagos en cuotas</h2>
                <p>Ofrecemos planes de cuotas sin interés en productos seleccionados y promociones bancarias vigentes que verás detalladas al momento de finalizar tu compra.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Seguridad de pago</h2>
                <p>Contamos con protocolos de seguridad SSL para proteger tus datos. Tu información financiera nunca es almacenada en nuestros servidores.</p>
            </section>
        </div>
    </BasePage>
);

export const Contacto = () => (
    <BasePage title="Contacto">
        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">Atención al Cliente</h2>
                    <p className="mb-2">Estamos para ayudarte con cualquier duda o consulta.</p>
                    <p className="text-foreground font-bold">Email: hola@puntopadel.shop</p>
                    <p className="text-foreground font-bold">Instagram: @puntopadel.shop</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-foreground uppercase mb-4 text-primary">¿Sos un club?</h2>
                    <p>Si buscás equipamiento corporativo o para tu complejo de pádel, escribinos para acceder a precios mayoristas.</p>
                </section>
            </div>
            <div className="bg-secondary/30 p-8 rounded-3xl border border-border">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Nombre Completo</label>
                        <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" placeholder="Tu nombre..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                        <input type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" placeholder="tu@email.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Mensaje</label>
                        <textarea className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors min-h-[120px]" placeholder="¿En qué podemos ayudarte?"></textarea>
                    </div>
                    <button className="w-full bg-primary text-primary-foreground font-heading font-black py-4 rounded-xl uppercase tracking-widest hover:bg-primary/90 transition-colors">
                        Enviar Mensaje
                    </button>
                </form>
            </div>
        </div>
    </BasePage>
);

export const Terminos = () => (
    <BasePage title="Términos y condiciones">
        <p className="mb-4 text-sm uppercase font-bold tracking-widest text-primary">Última actualización: Marzo 2026</p>
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4">1. General</h2>
                <p>Al acceder y realizar un pedido en Punto Pádel, usted confirma que está de acuerdo y sujeto a los términos de servicio contenidos en los Términos y condiciones que se detallan a continuación.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4">2. Productos y Precios</h2>
                <p>Todos los precios están expresados en pesos argentinos e incluyen IVA. Nos reservamos el derecho de modificar los precios sin previo aviso.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4">3. Propiedad Intelectual</h2>
                <p>Todo el contenido incluido en este sitio, como texto, gráficos, logotipos e imágenes, es propiedad de Punto Pádel Shop.</p>
            </section>
        </div>
    </BasePage>
);
