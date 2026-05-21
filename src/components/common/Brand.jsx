import kMark from "../../assets/img/K.png";

export default function Brand({ lang = "es", className = "" }) {
  return (
    <a
      href={lang === "es" ? "/" : "/en/"}
      className={"flex items-center select-none transition-opacity duration-300 " + className}
    >
      <img
        src={kMark.src}
        alt="Kaizen"
        style={{ height: 32, width: 32, objectFit: "contain" }}
        draggable="false"
        loading="eager"
      />
    </a>
  );
}
