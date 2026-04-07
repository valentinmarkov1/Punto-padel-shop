import emailjs from '@emailjs/browser';

/**
 * Email Service - Punto Padel Shop
 * 
 * Gestiona el envío de correos utilizando EmailJS.
 */

export interface EmailOrderDetails {
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    items: any[];
    total: number;
    subtotal?: number;
    shipping_cost?: number;
    payment_method: string;
    status?: string;
    proof_url?: string;
    tracking_number?: string;
    receipt_number?: string;
}

// Credenciales de EmailJS (Desde .env)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_CLIENTE = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENTE;
const TEMPLATE_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Inicializamos EmailJS con la Public Key
if (PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
}

/**
 * Formatea el precio para los emails evitando el signo $ duplicado
 */
const formatPriceForEmail = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
    }).format(price);
};

/**
 * Envía una notificación por correo electrónico.
 */
export const sendEmailNotification = async (type: 'order_confirmation' | 'admin_notification' | 'payment_received', data: EmailOrderDetails) => {
    const ADMIN_EMAIL = "juampa02@hotmail.com.ar";
    
    try {
        // Estructura de parámetros que coincide exactamente con los tags {{ }} del template
        const templateParams = {
            // Control de destinatario
            to_email: type === 'admin_notification' ? ADMIN_EMAIL : data.customer_email,
            
            // Datos básicos
            name: data.customer_name,
            order_id: data.order_number,
            email: data.customer_email,
            telefono: data.customer_phone,
            direccion: data.shipping_address,
            
            // Lista de productos (Array para el loop {{#orders}})
            orders: data.items.map(item => ({
                name: item.name,
                units: item.quantity || 1,
                price: formatPriceForEmail(item.price),
                image_url: item.image || ''
            })),
            
            // Bloque de costos (para {{cost.total}}, etc)
            cost: {
                shipping: formatPriceForEmail(data.shipping_cost || 0),
                tax: "0",
                total: formatPriceForEmail(data.total)
            },
            
            // Campos adicionales para el template de Admin o comprobantes
            metodo_pago: data.payment_method.toUpperCase(),
            comprobante_url: data.proof_url || 'No adjunto'
        };

        let templateId = '';
        if (type === 'order_confirmation') {
            templateId = TEMPLATE_CLIENTE;
        } else if (type === 'admin_notification') {
            templateId = TEMPLATE_ADMIN;
        } else {
            return;
        }

        if (!templateId || !SERVICE_ID) return false;

        const response = await emailjs.send(
            SERVICE_ID,
            templateId,
            templateParams
        );

        console.log(`[EMAILJS] Email ${type} enviado con éxito`);
        return true;
    } catch (error: any) {
        console.error(`[EMAILJS] Error en el envío de ${type}:`, error);
        return false;
    }
};
