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
        <p className="text-xl mb-6">En Punto Pádel, no solo vendemos equipamiento; vivimos el deporte.</p>
        <p className="mb-4">Nuestra misión es proporcionar a cada jugador, desde el principiante hasta el profesional, las herramientas necesarias para dominar la cancha. Seleccionamos cuidadosamente cada producto de nuestro catálogo para asegurar los más altos estándares de calidad y rendimiento.</p>
        <p>Fundada en 2024, nos hemos convertido rápidamente en el referente para los apasionados del pádel que buscan lo último en tecnología y diseño.</p>
    </BasePage>
);

export const Blog = () => (
    <BasePage title="Blog">
        <div className="grid gap-12">
            {[1, 2, 3].map((i) => (
                <article key={i} className="group cursor-pointer">
                    <div className="aspect-video rounded-3xl overflow-hidden bg-secondary mb-6">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-4xl font-heading font-black">ARTÍCULO {i}</div>
                    </div>
                    <h2 className="text-2xl font-black uppercase mb-3 group-hover:text-primary transition-colors">Cómo elegir tu pala ideal en 2026</h2>
                    <p className="text-muted-foreground line-clamp-3">Descubrí los factores clave para encontrar la pala que mejor se adapte a tu estilo de juego, desde la forma hasta el tipo de carbono utilizado en su construcción...</p>
                </article>
            ))}
        </div>
    </BasePage>
);

export const Terminos = () => (
    <BasePage title="Términos y condiciones">
        <p className="mb-4 text-sm uppercase font-bold tracking-widest text-primary">Última actualización: Febrero 2026</p>
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4">1. General</h2>
                <p>Al acceder y realizar un pedido en Punto Pádel, usted confirma que está de acuerdo y sujeto a los términos de servicio contenidos en los Términos y condiciones que se detallan a continuación.</p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4">2. Productos y Precios</h2>
                <p>Todos los precios están expresados en pesos argentinos e incluyen IVA. Nos reservamos el derecho de modificar los precios sin previo aviso.</p>
            </section>
        </div>
    </BasePage>
);

export const Privacidad = () => (
    <BasePage title="Política de privacidad">
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-foreground uppercase mb-4">Uso de sus datos</h2>
                <p>En Punto Pádel, valoramos su privacidad. Sus datos personales se utilizan exclusivamente para procesar sus pedidos y mejorar su experiencia de compra. Nunca compartiremos su información con terceros sin su consentimiento explícito.</p>
            </section>
        </div>
    </BasePage>
);
