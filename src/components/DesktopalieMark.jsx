export default function DesktopalieMark({ className = "", size = 28, style = {}, platform = "alpha", useImage = false }) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const pKey = String(platform || "alpha").toLowerCase();

  if (useImage) {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}>
        <img
          src="/Desktopalie.jpg"
          alt="Desktopalie Logo"
          style={{
            width: pixelSize,
            height: pixelSize,
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
          }}
        />
      </span>
    );
  }

  // BETA PLATFORM 🌿: Bio-Circuit Capsule & Concentric Organic Portal
  if (pKey === "beta") {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: pixelSize, height: pixelSize, flexShrink: 0, ...style }}>
        <svg viewBox="0 0 512 480" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="72" y="65" width="368" height="350" rx="100" stroke="currentColor" strokeWidth="30" />
          <rect x="126" y="120" width="260" height="240" rx="65" stroke="currentColor" strokeWidth="28" />
          <path d="M181 240C181 190 215 155 256 155C297 155 331 190 331 240C331 290 297 325 256 325C215 325 181 290 181 240Z" stroke="currentColor" strokeWidth="28" />
          <circle cx="256" cy="240" r="38" fill="currentColor" />
        </svg>
      </span>
    );
  }

  // GAMMA PLATFORM ✨: Optical Prism & Diamond-Faceted Ray Aperture
  if (pKey === "gamma") {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: pixelSize, height: pixelSize, flexShrink: 0, ...style }}>
        <svg viewBox="0 0 512 480" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M256 65L435 168V312L256 415L77 312V168L256 65Z" stroke="currentColor" strokeWidth="30" strokeLinejoin="round" />
          <path d="M256 130L380 202V278L256 350L132 278V202L256 130Z" stroke="currentColor" strokeWidth="28" strokeLinejoin="round" />
          <path d="M256 185L325 240L256 295L187 240L256 185Z" stroke="currentColor" strokeWidth="24" strokeLinejoin="round" />
          <circle cx="256" cy="240" r="28" fill="currentColor" />
        </svg>
      </span>
    );
  }

  // DELTA PLATFORM 🔥: Cyber Apex & Interlocking Trilateral Delta Nexus
  if (pKey === "delta") {
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: pixelSize, height: pixelSize, flexShrink: 0, ...style }}>
        <svg viewBox="0 0 512 480" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M256 65L440 395C445 405 438 415 425 415H87C74 415 67 405 72 395L256 65Z" stroke="currentColor" strokeWidth="30" strokeLinejoin="round" />
          <path d="M140 375L256 168L372 375H140Z" stroke="currentColor" strokeWidth="28" strokeLinejoin="round" />
          <path d="M205 350L256 258L307 350H205Z" stroke="currentColor" strokeWidth="24" strokeLinejoin="round" />
          <rect x="236" y="275" width="40" height="75" rx="14" fill="currentColor" />
        </svg>
      </span>
    );
  }

  // ALPHA PLATFORM ⚡ / DEFAULT DESKTOPALIE: Iconic Arch & Monolith Portal
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: pixelSize, height: pixelSize, flexShrink: 0, ...style }}>
      <svg viewBox="0 0 512 480" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M72 420V132C72 94.9969 101.997 65 139 65H373C410.003 65 440 94.9969 440 132V420" stroke="currentColor" strokeWidth="30" strokeLinejoin="round" />
        <path d="M126 145V339C126 369.376 150.624 394 181 394H331C361.376 394 386 369.376 386 339V145" stroke="currentColor" strokeWidth="28" />
        <path d="M181 340V181C181 154.49 202.49 133 229 133H283C309.51 133 331 154.49 331 181V340" stroke="currentColor" strokeWidth="28" />
        <rect x="219" y="181" width="74" height="157" rx="20" fill="currentColor" />
      </svg>
    </span>
  );
}
