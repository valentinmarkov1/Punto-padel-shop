import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHONE_NUMBER = '5491138582368';

const WhatsAppWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mostrar mensaje automático después de 8 segundos solo una vez por sesión
        const hasSeenNotification = sessionStorage.getItem('whatsapp_notification_seen');

        if (!hasSeenNotification) {
            const timer = setTimeout(() => {
                setShowNotification(true);
                sessionStorage.setItem('whatsapp_notification_seen', 'true');
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        // Cerrar si hace click fuera
        const handleClickOutside = (event: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSendMessage = (text?: string) => {
        const finalMessage = text || message.trim();
        if (!finalMessage) return;

        const encodedMessage = encodeURIComponent(finalMessage);
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`, '_blank');

        if (!text) setMessage(''); // Limpiar si es mensaje personalizado
    };

    const quickMessages = [
        { id: 1, text: ' Quiero asesoramiento para elegir una pala' },
        { id: 2, text: ' ¿Qué productos están en oferta?' },
        { id: 3, text: ' Consultas sobre envíos y pagos' },
    ];

    return (
        <div className="whatsapp-container" ref={chatRef}>
            {/* Notificación automática (Globo de texto) */}
            {showNotification && !isOpen && (
                <div className="whatsapp-message animate-slide-up">
                    <button
                        onClick={() => setShowNotification(false)}
                        className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-gray-600 hover:bg-gray-300 transition-colors"
                    >
                        <X size={12} />
                    </button>
                    <p className="text-sm font-medium text-gray-800 leading-tight">
                        ¿Necesitás ayuda para elegir tu equipamiento?
                    </p>
                </div>
            )}

            {/* Chat Modal */}
            <div
                className={cn(
                    "bg-white w-[350px] max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right pointer-events-auto",
                    isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-10 pointer-events-none"
                )}
            >
                {/* Header Style WhatsApp */}
                <div className="bg-[#25D366] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            <img src="/logo.jpeg" alt="Punto Padel" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-white">
                            <h3 className="font-bold text-sm leading-tight">Punto Padel Shop </h3>
                            <p className="text-[11px] opacity-90">Te respondemos en minutos</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-black/10 rounded-full p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                    <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm relative text-sm text-gray-700 leading-relaxed border border-gray-100">
                        <span className="block font-semibold text-[#25D366] mb-1">Punto Padel Shop</span>
                        ¡Hola! 👋 ¿En qué podemos ayudarte hoy? Escribe tu mensaje aquí debajo.
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider px-1">Consultas rápidas</span>
                        {quickMessages.map((msg) => (
                            <button
                                key={msg.id}
                                onClick={() => handleSendMessage(msg.text)}
                                className="bg-white hover:bg-gray-50 text-gray-700 text-left p-3 rounded-xl border border-gray-100 transition-all text-sm font-medium shadow-sm active:scale-[0.98] hover:border-[#25D366]/30"
                            >
                                {msg.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] transition-all"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!message.trim()}
                        className={cn(
                            "p-2.5 rounded-xl transition-all shadow-lg shadow-[#25D366]/20",
                            message.trim() ? "bg-[#25D366] text-white hover:bg-[#20bd5a]" : "bg-gray-100 text-gray-400"
                        )}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (showNotification) setShowNotification(false);
                }}
                className={cn(
                    "whatsapp-button",
                    isOpen ? "bg-white text-gray-400 rotate-90" : "text-white"
                )}
            >
                {isOpen ? (
                    <X size={28} className="transition-transform duration-300" />
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="group-hover:scale-110 transition-transform duration-300"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default WhatsAppWidget;
