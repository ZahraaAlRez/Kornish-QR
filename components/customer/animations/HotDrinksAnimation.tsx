export default function HotDrinksAnimation() {
  return (
    <svg viewBox="0 0 300 160" className="h-40 w-full">
      <g stroke="#8F6720" strokeWidth="2" opacity="0.85">
        <path d="M115 -20 C108 -30, 108 -40, 115 -50" fill="none" strokeLinecap="round" className="animate-steam-rise" style={{ animationDelay: "0s" }} transform="translate(0,60)" />
        <path d="M150 -20 C143 -30, 143 -40, 150 -50" fill="none" strokeLinecap="round" className="animate-steam-rise" style={{ animationDelay: "0.4s" }} transform="translate(0,60)" />
        <path d="M185 -20 C178 -30, 178 -40, 185 -50" fill="none" strokeLinecap="round" className="animate-steam-rise" style={{ animationDelay: "0.8s" }} transform="translate(0,60)" />
      </g>

      <ellipse cx="150" cy="8" rx="12" ry="9" fill="#8F6720" className="animate-bean-fall" style={{ animationDelay: "0s" }} />
      <ellipse cx="130" cy="4" rx="10" ry="8" fill="#B8862E" className="animate-bean-fall" style={{ animationDelay: "0.5s" }} />
      <ellipse cx="170" cy="4" rx="10" ry="8" fill="#B8862E" className="animate-bean-fall" style={{ animationDelay: "1s" }} />

      <g transform="translate(150,110)">
        <clipPath id="cupClip">
          <path d="M-55 -35 H55 L47 40 C45 55, 25 65, 0 65 C-25 65, -45 55, -47 40 Z" />
        </clipPath>
        <path
          d="M-55 -35 H55 L47 40 C45 55, 25 65, 0 65 C-25 65, -45 55, -47 40 Z"
          fill="#F3ECDC"
          stroke="#B8862E"
          strokeWidth="3"
        />
        <rect x="-55" y="-15" width="110" height="80" fill="#5A3620" clipPath="url(#cupClip)" className="animate-cup-fill" />
        <path d="M55 -28 C78 -28, 82 -2, 62 3 L52 3" fill="none" stroke="#B8862E" strokeWidth="5" strokeLinecap="round" />
        <rect x="-58" y="-45" width="116" height="12" rx="6" fill="#B8862E" />
      </g>
    </svg>
  );
}
