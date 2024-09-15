import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = () => {
  // ============= Location ==============
  const { pathname } = useLocation();

  // ============= Effect ==============
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ============= Rendering ==============
  return null;
};

export default ScrollToTop;
