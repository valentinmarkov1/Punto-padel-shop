import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente que resetea la posición del scroll al inicio de la página
 * cada vez que cambia la ruta de navegación.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forzamos el scroll al inicio de forma instantánea al cambiar de ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
