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
    console.log("[EMAILJS] Inicializado correctamente con la Public Key");
} else {
    console.warn("[EMAILJS] ADVERTENCIA: VITE_EMAILJS_PUBLIC_KEY no encontrada en .env");
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
    }).format(price).replace("ARS", "$");
};

/**
 * Envía una notificación por correo electrónico.
 */
export const sendEmailNotification = async (type: 'order_confirmation' | 'admin_notification' | 'payment_received', data: EmailOrderDetails) => {
    console.log(`[EMAILJS] Preparando envío tipo: ${type}...`);
    
    // Verificación de credenciales antes de intentar
    if (!SERVICE_ID || !PUBLIC_KEY) {
        console.error("[EMAILJS] Error: Faltan credenciales en el archivo .env (SERVICE_ID o PUBLIC_KEY)");
        return false;
    }

    try {
        // Generar HTML de productos para el template
        const productosHTML = data.items.map(item => `
            <div style="margin-bottom:10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <strong style="color: #000;">${item.name}</strong><br/>
                <span style="color: #666;">Cantidad: ${item.quantity || item.units || 1}</span><br/>
                <span style="color: #333; font-weight: bold;">Precio: ${formatPrice(item.price)}</span>
            </div>
        `).join('');

        // Parámetros que espera el template de EmailJS
        const templateParams = {
            name: data.customer_name,
            order_id: data.order_number,
            email: data.customer_email,
            telefono: data.customer_phone,
            direccion: data.shipping_address,
            total: formatPrice(data.total),
            metodo_pago: data.payment_method,
            productos: productosHTML,
            comprobante_url: data.proof_url || 'No adjunto'
        };

        let templateId = '';
        if (type === 'order_confirmation') {
            templateId = TEMPLATE_CLIENTE;
        } else if (type === 'admin_notification') {
            templateId = TEMPLATE_ADMIN;
        } else {
            console.log("[EMAILJS] Tipo de notificación no configurado:", type);
            return;
        }

        if (!templateId) {
            console.error(`[EMAILJS] Error: TEMPLATE_ID para ${type} no configurado en .env`);
            return false;
        }

        console.log(`[EMAILJS] Enviando a Template: ${templateId} via Service: ${SERVICE_ID}`);

        const response = await emailjs.send(
            SERVICE_ID,
            templateId,
            templateParams
        );

        console.log(`[EMAILJS] Email ${type} enviado correctamente! Status:`, response.status);
        return true;
    } catch (error: any) {
        console.error(`[EMAILJS] Error en el envío de ${type}:`, error);
        if (error && error.text) {
            console.error("[EMAILJS] Razón técnica del fallo:", error.text);
        }
        return false;
    }
};
