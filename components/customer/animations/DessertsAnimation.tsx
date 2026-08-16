export default function DessertsAnimation() {
  return (
    <svg viewBox="0 0 300 160" className="h-40 w-full">
      <g transform="translate(150,120)">
        <ellipse cx="0" cy="10" rx="90" ry="22" fill="#F3ECDC" stroke="#B8862E" strokeWidth="3" />
        <ellipse cx="0" cy="5" rx="70" ry="15" fill="#E8C77E" />
      </g>

      {/* sprinkles: chocolate chips, cookie crumbs, strawberries falling in */}
      <circle cx="110" cy="10" r="4" fill="#5A3A22" className="animate-sprinkle" style={{ animationDelay: "0s", ["--sprinkle-x" as string]: "8px" }} />
      <circle cx="150" cy="0" r="4" fill="#5A3A22" className="animate-sprinkle" style={{ animationDelay: "0.3s", ["--sprinkle-x" as string]: "-6px" }} />
      <circle cx="190" cy="10" r="4" fill="#5A3A22" className="animate-sprinkle" style={{ animationDelay: "0.6s", ["--sprinkle-x" as string]: "10px" }} />
      <circle cx="130" cy="5" r="3" fill="#7A5230" className="animate-sprinkle" style={{ animationDelay: "0.9s", ["--sprinkle-x" as string]: "-4px" }} />
      <path
        d="M168 -2 q5 -16 12 -20 q-3 14 3 22 q-10 3 -15 -2Z"
        fill="#B23A2E"
        className="animate-sprinkle"
        style={{ animationDelay: "1.2s", ["--sprinkle-x" as string]: "6px" }}
      />
    </svg>
  );
}
