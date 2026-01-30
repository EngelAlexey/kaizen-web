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

  // Always use the K mark logo
  const logoSrc = brand.logoLight;

  return (
    <div className={"flex items-center gap-2 select-none transition-opacity duration-300 " + className}>
      <img
        src={logoSrc}
        alt="Kaizen"
        style={{ height: transparent ? wordmarkHeight : markSize, objectFit: "contain" }}
        draggable="false"
        loading="eager"
      />
    </div>
  );
}
