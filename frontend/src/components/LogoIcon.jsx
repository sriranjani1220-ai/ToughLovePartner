export default function LogoIcon({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size * 0.78}
      viewBox="0 0 120 94"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#1a0a2e" />
          <stop offset="35%" stopColor="#7b2460" />
          <stop offset="65%" stopColor="#d9541e" />
          <stop offset="100%" stopColor="#f9a825" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="54%" cy="58%" r="32%">
          <stop offset="0%"  stopColor="#fff8e1" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffc947" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d9541e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="120" height="94" fill="url(#sky-grad)" rx="6" />

      {/* Sun burst glow */}
      <ellipse cx="62" cy="55" rx="40" ry="26" fill="url(#sun-glow)" />

      {/* Sun rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line
          key={i}
          x1="62" y1="55"
          x2={62 + Math.cos((deg * Math.PI) / 180) * 34}
          y2={55 + Math.sin((deg * Math.PI) / 180) * 22}
          stroke="#ffc947"
          strokeWidth="0.4"
          strokeOpacity="0.35"
        />
      ))}

      {/* Background mountain */}
      <polygon points="0,94 28,34 56,94" fill="#12082a" opacity="0.65" />

      {/* Right hill */}
      <polygon points="72,94 102,42 120,94" fill="#12082a" opacity="0.55" />

      {/* Main mountain */}
      <polygon points="22,94 62,16 102,94" fill="#0d0520" />

      {/* ── Person 1: HELPER (on peak, leaning forward, arm reaching down) ── */}
      {/* head */}
      <circle cx="56" cy="10" r="3.2" fill="#0d0520" />
      {/* torso leaning right */}
      <path d="M56,13 L53,23" stroke="#0d0520" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* right arm reaching down toward climber */}
      <path d="M55,17 L65,26" stroke="#0d0520" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* left arm (bracing) */}
      <path d="M55,17 L50,22" stroke="#0d0520" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* legs */}
      <path d="M53,23 L49,31" stroke="#0d0520" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M53,23 L56,31" stroke="#0d0520" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* ── Person 2: CLIMBER (on slope, arm reaching up to helper) ── */}
      {/* head */}
      <circle cx="73" cy="30" r="2.8" fill="#0d0520" />
      {/* torso angled up-left */}
      <path d="M73,32.8 L70,43" stroke="#0d0520" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      {/* left arm reaching up toward helper */}
      <path d="M72,36 L65,27" stroke="#0d0520" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* right arm on rock */}
      <path d="M72,36 L78,40" stroke="#0d0520" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* legs */}
      <path d="M70,43 L67,52" stroke="#0d0520" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M70,43 L74,51" stroke="#0d0520" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Connection spark — hands almost touching */}
      <circle cx="65" cy="26.5" r="1.4" fill="#ffc947" opacity="0.85" />
    </svg>
  );
}
