export default function DesktopalieMark({ className = "", size = 28, style = {} }) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
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
