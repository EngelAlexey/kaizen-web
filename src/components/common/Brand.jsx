import { useState, useEffect } from 'react';
import kaizenLogoDark from "../../assets/img/kaizen_logo.png";
import kMark from "../../assets/img/K.png";

const brand = {
  logoDark: kaizenLogoDark.src,
  logoLight: kMark.src,
};

export default function Brand({
  transparent: initialTransparent = false,
  wordmarkHeight = 32,
  markSize = 32,
  className = "",
}) {
  const [transparent, setTransparent] = useState(initialTransparent);

  useEffect(() => {
    const handleScroll = (e) => {
      setTransparent(e.detail.transparent);
    };

    window.addEventListener('header-scrolled', handleScroll);
    return () => window.removeEventListener('header-scrolled', handleScroll);
  }, []);

  const logoSrc = brand.logoLight;

  return (
    <a href={lang === "es" ? "/es/" : "/en/"} className={"flex items-center gap-2 group select-none transition-opacity duration-300 " + className}>
      <span
        className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled || !transparent ? "text-foreground" : "text-white"
          }`}
      >
        Kaizen <span className="text-primary">Apps</span>
      </span>
    </a>
  );
}
