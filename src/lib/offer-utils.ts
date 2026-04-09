/**
 * Utilidades para la gestión de ofertas y contadores
 */

export const isOfferExpired = (endDate: string | null, enabled: boolean): boolean => {
    if (!enabled || !endDate) return false;
    
    const now = new Date();
    const end = new Date(endDate);
    
    return now.getTime() >= end.getTime();
};

export const getTimeLeft = (targetDate: string | null) => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, isExpired: true };
    const now = new Date();
    const end = new Date(targetDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, isExpired: false };
};
