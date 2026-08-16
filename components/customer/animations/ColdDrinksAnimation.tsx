export default function ColdDrinksAnimation() {
  return (
    <svg viewBox="0 0 300 160" className="h-40 w-full">
      <rect x="115" y="0" width="16" height="16" rx="3" fill="#EAF3F0" className="animate-ice-drop" style={{ animationDelay: "0s" }} />
      <rect x="145" y="-6" width="14" height="14" rx="3" fill="#DDEDE8" className="animate-ice-drop" style={{ animationDelay: "0.5s" }} />
      <rect x="170" y="0" width="16" height="16" rx="3" fill="#EAF3F0" className="animate-ice-drop" style={{ animationDelay: "1s" }} />

      <g transform="translate(150,105)">
        <clipPath id="glassClip">
          <path d="M-42 -55 H42 L32 62 C31 72, 17 80, 0 80 C-17 80, -31 72, -32 62 Z" />
        </clipPath>
        <path
          d="M-42 -55 H42 L32 62 C31 72, 17 80, 0 80 C-17 80, -31 72, -32 62 Z"
          fill="#F3ECDC"
          fillOpacity="0.35"
          stroke="#B8862E"
          strokeWidth="3"
        />
        <rect x="-42" y="-25" width="84" height="105" fill="#B8862E" fillOpacity="0.55" clipPath="url(#glassClip)" className="animate-liquid-rise" />

        <circle cx="-24" cy="60" r="2.4" fill="#F3ECDC" className="animate-condensation" style={{ animationDelay: "0.2s" }} />
        <circle cx="26" cy="30" r="2.4" fill="#F3ECDC" className="animate-condensation" style={{ animationDelay: "0.7s" }} />
        <circle cx="-28" cy="0" r="2" fill="#F3ECDC" className="animate-condensation" style={{ animationDelay: "1.1s" }} />
        <circle cx="30" cy="-10" r="2" fill="#F3ECDC" className="animate-condensation" style={{ animationDelay: "1.5s" }} />
      </g>
    </svg>
  );
}
