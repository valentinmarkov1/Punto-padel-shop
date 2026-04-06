/**
 * Email Service - Punto Padel Shop
 * 
 * Este servicio gestiona las plantillas y el envío de correos electrónicos.
 * Para que el envío sea efectivo, se recomienda integrar con Resend, EmailJS o 
 * una Edge Function de Supabase.
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

const BANK_DETAILS = {
    banco: "BRUBANK",
    titular: "Juan Pablo Casasola",
    cbu: "1430001713022116440019",
    alias: "puntopadelshop",
    cuit: "20-43985752-9"
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
    }).format(price).replace("ARS", "$");
};

export const emailTemplates = {
    // 1. Confirmación de Compra - Cliente
    orderConfirmationClient: (order: EmailOrderDetails) => ({
        subject: `Confirmación de compra – Pedido ${order.order_number}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #000; text-transform: uppercase;">¡Gracias por tu compra!</h1>
                <p>Su compra fue realizada con éxito, estamos procesando el pago y en la brevedad recibirá un correo de confirmación.</p>
                
                <h2 style="border-bottom: 2px solid #EEE; padding-bottom: 10px;">Resumen del Pedido ${order.order_number}</h2>
                <ul style="list-style: none; padding: 0;">
                    ${order.items.map(item => `
                        <li style="padding: 10px 0; border-bottom: 1px solid #EEE; display: flex; justify-content: space-between;">
                            <span>${item.name} (x${item.quantity})</span>
                            <strong>${formatPrice(item.price * item.quantity)}</strong>
                        </li>
                    `).join('')}
                </ul>
                
                <p style="text-align: right; font-size: 1.2em;"><strong>Total: ${formatPrice(order.total)}</strong></p>
                
                ${order.payment_method === 'transferencia' ? `
                    <div style="background: #F9F9F9; padding: 20px; border-radius: 10px; margin-top: 20px;">
                        <h3 style="margin-top: 0;">Datos Bancarios para Transferencia:</h3>
                        <p><strong>Banco:</strong> ${BANK_DETAILS.banco}</p>
                        <p><strong>Titular:</strong> ${BANK_DETAILS.titular}</p>
                        <p><strong>CBU:</strong> ${BANK_DETAILS.cbu}</p>
                        <p><strong>Alias:</strong> ${BANK_DETAILS.alias}</p>
                        <p><strong>CUIT:</strong> ${BANK_DETAILS.cuit}</p>
                    </div>
                ` : order.payment_method === 'contrapago' ? `
                    <div style="background: #E8F5E9; padding: 20px; border-radius: 10px; margin-top: 20px; border: 1px solid #C8E6C9;">
                        <h3 style="margin-top: 0; color: #2E7D32;">Coordinar Retiro y Pago</h3>
                        <p>Elegiste pagar al retirar. Por favor, comunícate con nosotros para coordinar el día y horario.</p>
                        <p style="text-align: center; margin-top: 20px;">
                            <a href="https://wa.me/5491131101234?text=Hola!%20Realicé%20el%20pedido%20%23${order.order_number}%20y%20quisiera%20coordinar%20el%20retiro." 
                               style="background: #25D366; color: #FFF; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Contactar por WhatsApp
                            </a>
                        </p>
                    </div>
                ` : ''}
                
                <div style="margin-top: 20px;">
                    <h3>Dirección de entrega:</h3>
                    <p>${order.shipping_address}</p>
                </div>
                
                <p style="font-size: 0.8em; color: #666; margin-top: 40px;">
                    El pago será verificado por nuestro equipo administrativo.
                </p>
            </div>
        `
    }),

    // 2. Notificación de Compra - Administrador
    orderNotificationAdmin: (order: EmailOrderDetails) => ({
        subject: `NUEVO PEDIDO # ${order.order_number} - ${order.customer_name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #E63946;">Nuevo Pedido Recibido</h2>
                <p><strong>Cliente:</strong> ${order.customer_name}</p>
                <p><strong>Email:</strong> ${order.customer_email}</p>
                <p><strong>Teléfono:</strong> ${order.customer_phone}</p>
                <p><strong>Dirección:</strong> ${order.shipping_address}</p>
                <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                <p><strong>Número de Pedido:</strong> ${order.order_number}</p>
                <p><strong>Método de Pago:</strong> ${order.payment_method}</p>
                ${order.proof_url ? `<p><a href="${order.proof_url}" style="background: #000; color: #FFF; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Comprobante Adjunto</a></p>` : ''}
            </div>
        `
    }),

    // 3. Confirmación de Pago (Recibo) - Cliente
    paymentReceived: (order: EmailOrderDetails) => ({
        subject: `Pago recibido – Pedido ${order.order_number}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #EEE; padding: 30px; border-radius: 15px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="margin: 0; color: #000;">PUNTO PADEL SHOP</h1>
                    <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8em; color: #666;">RECIBO OFICIAL</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div>
                        <p style="margin: 0; font-size: 0.8em; color: #666;">RECIBO Nº</p>
                        <p style="margin: 0; font-weight: bold; font-size: 1.1em;">${order.receipt_number}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0; font-size: 0.8em; color: #666;">PEDIDO Nº</p>
                        <p style="margin: 0; font-weight: bold; font-size: 1.1em;">${order.order_number}</p>
                    </div>
                </div>

                <p>Hola <strong>${order.customer_name}</strong>,</p>
                <p>El pago fue recibido correctamente y su pedido será despachado dentro de 24 hs hábiles.</p>
                
                ${order.tracking_number ? `
                    <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #2E7D32;">Número de seguimiento: ${order.tracking_number}</p>
                    </div>
                ` : ''}

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead style="background: #F5F5F5;">
                        <tr>
                            <th style="padding: 10px; text-align: left;">Producto</th>
                            <th style="padding: 10px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #EEE;">${item.name} (x${item.quantity})</td>
                                <td style="padding: 10px; border-bottom: 1px solid #EEE; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 20px;">
                    <p style="margin: 0; color: #666;">TOTAL PAGADO</p>
                    <p style="margin: 0; font-size: 1.8em; font-weight: bold; color: #000;">${formatPrice(order.total)}</p>
                </div>

                <p style="margin-top: 40px; text-align: center; font-size: 0.8em; color: #666;">
                    Método de pago: Transferencia bancaria
                </p>
            </div>
        `
    })
};

export const sendEmailNotification = async (type: string, data: EmailOrderDetails) => {
    let template;
    const adminEmail = "juampa02@hotmail.com.ar";

    switch (type) {
        case 'order_confirmation':
            template = emailTemplates.orderConfirmationClient(data);
            console.log(`[EMAIL] Enviando confirmación a: ${data.customer_email}`);
            break;
        case 'admin_notification':
            template = emailTemplates.orderNotificationAdmin(data);
            console.log(`[EMAIL] Enviando notificación a admin: ${adminEmail}`);
            break;
        case 'payment_received':
            template = emailTemplates.paymentReceived(data);
            console.log(`[EMAIL] Enviando recibo a: ${data.customer_email}`);
            break;
        default:
            return;
    }

    // Aquí iría la integración real con Resend o similar.
    // Ejemplo ilustrativo:
    // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to: data.email, ...template }) });
    
    // Por ahora, simulamos el éxito.
    return true;
};
