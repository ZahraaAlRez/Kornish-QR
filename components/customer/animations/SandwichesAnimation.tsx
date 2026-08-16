export default function SandwichesAnimation() {
  return (
    <svg viewBox="0 0 300 160" className="h-40 w-full">
      <g transform="translate(150,100)">
        <ellipse cx="0" cy="55" rx="95" ry="12" fill="#000" opacity="0.12" />

        {/* bottom bread */}
        <path d="M-90 25 Q-90 45 -65 45 L65 45 Q90 45 90 25 L84 8 L-84 8 Z" fill="#8F6720" />

        {/* fillings pop in */}
        <g>
          <rect x="-84" y="-4" width="168" height="14" fill="#6B7B4A" className="animate-filling-pop" style={{ animationDelay: "0s" }} />
          <rect x="-84" y="-16" width="168" height="12" rx="3" fill="#B23A2E" className="animate-filling-pop" style={{ animationDelay: "0.3s" }} />
          <circle cx="-55" cy="-8" r="5" fill="#D9AE5C" className="animate-filling-pop" style={{ animationDelay: "0.6s" }} />
          <circle cx="0" cy="-8" r="5" fill="#D9AE5C" className="animate-filling-pop" style={{ animationDelay: "0.6s" }} />
          <circle cx="55" cy="-8" r="5" fill="#D9AE5C" className="animate-filling-pop" style={{ animationDelay: "0.6s" }} />
        </g>

        {/* top bread slides down to close */}
        <path
          d="M-92 -22 Q0 -52 92 -22 L86 -4 Q0 -30 -86 -4 Z"
          fill="#D9AE5C"
          className="animate-bread-close"
        />
      </g>
    </svg>
  );
}
