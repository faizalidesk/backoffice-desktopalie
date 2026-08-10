export default function DesktopalieMark({ className = "", size = 28, style = {} }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <svg width={size} height={size} viewBox="0 0 512 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M72 420V132C72 94.9969 101.997 65 139 65H373C410.003 65 440 94.9969 440 132V420" stroke="currentColor" strokeWidth="30" strokeLinejoin="round" />
        <path d="M126 145V339C126 369.376 150.624 394 181 394H331C361.376 394 386 369.376 386 339V145" stroke="currentColor" strokeWidth="28" />
        <path d="M181 340V181C181 154.49 202.49 133 229 133H283C309.51 133 331 154.49 331 181V340" stroke="currentColor" strokeWidth="28" />
        <rect x="219" y="181" width="74" height="157" rx="20" fill="currentColor" />
      </svg>
    </span>
  );
}
