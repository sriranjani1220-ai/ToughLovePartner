/* Temporary showcase — visit /logos to pick your logo */

// Option A: Bold Helper & Climber — large chunky silhouettes, hands clasping
export function LogoA({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0c29" />
          <stop offset="45%" stopColor="#8e2de2" />
          <stop offset="100%" stopColor="#f7971e" />
        </linearGradient>
        <radialGradient id="a-glow" cx="50%" cy="62%" r="35%">
          <stop offset="0%" stopColor="#ffe066" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f7971e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#a-sky)" rx="12" />
      <ellipse cx="50" cy="62" rx="38" ry="22" fill="url(#a-glow)" />
      {/* Mountain */}
      <polygon points="10,100 50,42 90,100" fill="#0a0618" />
      <polygon points="0,100 22,60 44,100" fill="#0f0c29" opacity="0.7" />
      <polygon points="60,100 82,55 100,100" fill="#0f0c29" opacity="0.6" />

      {/* Helper — on peak, leaning, big arm down */}
      <circle cx="44" cy="33" r="5.5" fill="#0a0618" />
      <path d="M44,38.5 L41,51" stroke="#0a0618" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M43,43 L55,52" stroke="#0a0618" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M43,43 L37,48" stroke="#0a0618" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M41,51 L37,60" stroke="#0a0618" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M41,51 L45,60" stroke="#0a0618" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Climber — on slope, arm up */}
      <circle cx="63" cy="52" r="5" fill="#0a0618" />
      <path d="M63,57 L60,69" stroke="#0a0618" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M62,61 L55,53" stroke="#0a0618" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M62,61 L69,65" stroke="#0a0618" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M60,69 L57,78" stroke="#0a0618" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M60,69 L64,78" stroke="#0a0618" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Clasped hands glow */}
      <circle cx="55" cy="52.5" r="2.5" fill="#ffe066" opacity="0.95" />
    </svg>
  );
}

// Option B: Summit Victory — single figure arms raised at peak, sun behind
export function LogoB({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1b2a" />
          <stop offset="50%" stopColor="#1b4f72" />
          <stop offset="100%" stopColor="#2e86ab" />
        </linearGradient>
        <radialGradient id="b-sun" cx="50%" cy="45%" r="28%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="#aedff7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2e86ab" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#b-sky)" rx="12" />
      {/* Sun */}
      <circle cx="50" cy="44" r="10" fill="white" opacity="0.92" />
      <ellipse cx="50" cy="44" rx="22" ry="18" fill="url(#b-sun)" />
      {/* Rays */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i}
          x1={50 + Math.cos((deg * Math.PI) / 180) * 12}
          y1={44 + Math.sin((deg * Math.PI) / 180) * 12}
          x2={50 + Math.cos((deg * Math.PI) / 180) * 20}
          y2={44 + Math.sin((deg * Math.PI) / 180) * 20}
          stroke="white" strokeWidth="1.5" strokeOpacity="0.6"
        />
      ))}
      {/* Mountains */}
      <polygon points="0,100 50,36 100,100" fill="#0d1b2a" />
      <polygon points="0,100 18,55 38,100" fill="#0a1520" opacity="0.8" />
      <polygon points="62,100 84,52 100,100" fill="#0a1520" opacity="0.7" />
      {/* Figure with arms up in victory */}
      <circle cx="50" cy="27" r="5" fill="#0a1520" />
      <path d="M50,32 L50,46" stroke="#0a1520" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Arms raised in V */}
      <path d="M50,36 L41,27" stroke="#0a1520" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M50,36 L59,27" stroke="#0a1520" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M50,46 L45,56" stroke="#0a1520" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M50,46 L55,56" stroke="#0a1520" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Option C: Two figures walking together toward a bright horizon
export function LogoC({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="c-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141e30" />
          <stop offset="55%" stopColor="#243b55" />
          <stop offset="100%" stopColor="#0d6e8a" />
        </linearGradient>
        <radialGradient id="c-horizon" cx="50%" cy="68%" r="40%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0d6e8a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#c-sky)" rx="12" />
      {/* Horizon glow */}
      <ellipse cx="50" cy="68" rx="45" ry="18" fill="url(#c-horizon)" />
      {/* Horizon line */}
      <rect x="0" y="67" width="100" height="33" fill="#0a1a28" rx="0" />
      <line x1="0" y1="67" x2="100" y2="67" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.5" />

      {/* Stars */}
      {[[15,15],[30,8],[65,10],[80,18],[90,8],[50,5]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.9" fill="white" opacity="0.7" />
      ))}

      {/* Figure 1 — slightly taller (mentor) */}
      <circle cx="40" cy="44" r="5.5" fill="#0a1a28" />
      <path d="M40,49.5 L40,63" stroke="#0a1a28" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M40,54 L47,58" stroke="#0a1a28" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M40,63 L36,74" stroke="#0a1a28" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M40,63 L44,74" stroke="#0a1a28" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Figure 2 — slightly smaller (person being helped) */}
      <circle cx="58" cy="47" r="4.5" fill="#0a1a28" />
      <path d="M58,51.5 L58,63" stroke="#0a1a28" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M58,56 L47,58" stroke="#0a1a28" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M58,63 L54,73" stroke="#0a1a28" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M58,63 L62,73" stroke="#0a1a28" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Joined hands highlight */}
      <circle cx="47" cy="58" r="2.2" fill="#00d4ff" opacity="0.9" />

      {/* Path/road ahead */}
      <path d="M35,100 L50,67 L65,100" fill="none" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2,3" />
    </svg>
  );
}

// Option D: Lighthouse — guiding light, steady through the dark
export function LogoD({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a1a" />
          <stop offset="60%" stopColor="#0d2b4a" />
          <stop offset="100%" stopColor="#0a3d5c" />
        </linearGradient>
        <radialGradient id="d-beam" cx="60%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#ffe066" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#d-sky)" rx="12" />
      {/* Stars */}
      {[[10,12],[25,7],[70,9],[85,14],[92,6],[55,18],[15,28]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity="0.65" />
      ))}
      {/* Sea */}
      <rect x="0" y="75" width="100" height="25" fill="#061828" rx="0" />
      <path d="M0,75 Q25,72 50,75 Q75,78 100,75" fill="none" stroke="#1a6b8a" strokeWidth="1.2" />
      {/* Light beam */}
      <polygon points="58,30 95,10 95,55" fill="url(#d-beam)" opacity="0.6" />
      {/* Lighthouse body */}
      <rect x="44" y="38" width="14" height="37" fill="#e8e0d0" rx="2" />
      {/* Stripes */}
      <rect x="44" y="44" width="14" height="5" fill="#c0392b" opacity="0.8" />
      <rect x="44" y="56" width="14" height="5" fill="#c0392b" opacity="0.8" />
      <rect x="44" y="68" width="14" height="7" fill="#b0a898" />
      {/* Light room */}
      <rect x="42" y="30" width="18" height="10" fill="#f5f0e0" rx="2" />
      <circle cx="51" cy="35" r="4" fill="#ffe066" />
      <circle cx="51" cy="35" r="2" fill="white" />
      {/* Top cap */}
      <polygon points="42,30 51,22 60,30" fill="#c0392b" />
      {/* Base */}
      <rect x="40" y="75" width="22" height="5" fill="#b0a898" rx="1" />
      {/* Rocks */}
      <ellipse cx="34" cy="78" rx="10" ry="4" fill="#0a1a28" />
      <ellipse cx="68" cy="79" rx="9" ry="3.5" fill="#0a1a28" />
    </svg>
  );
}
