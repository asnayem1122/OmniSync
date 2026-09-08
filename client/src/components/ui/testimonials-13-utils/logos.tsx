import React, { ComponentProps } from "react";

// 1. Electrical: VoltWave
export function Logo01(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 6 L12 26 L22 26 L16 42 L32 20 L22 20 Z"
        fill="#10B981"
      />
      <text
        x="42"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.05em"
      >
        VOLTWAVE
      </text>
      <text
        x="42"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        ELECTRICAL MASTER
      </text>
    </svg>
  );
}

// 2. Plumbing: AquaFlow
export function Logo02(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 8 C22 8 12 22 12 28 A10 10 0 0 0 32 28 C32 22 22 8 22 8 Z"
        fill="#06B6D4"
      />
      <text
        x="42"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        AQUAFLOW
      </text>
      <text
        x="42"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        PRECISION PLUMBING
      </text>
    </svg>
  );
}

// 3. Appliance & Gadget Repair: Apex
export function Logo03(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="12" y="12" width="22" height="22" rx="5" fill="#3B82F6" />
      <circle cx="23" cy="23" r="5" fill="white" />
      <text
        x="44"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        APEX TECH
      </text>
      <text
        x="44"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        APPLIANCE REPAIR
      </text>
    </svg>
  );
}

// 4. Cleaning & Pest: EcoClean
export function Logo04(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 8 L32 14 L32 26 C32 33 22 38 22 38 C22 38 12 33 12 26 L12 14 Z"
        fill="#10B981"
      />
      <circle cx="22" cy="22" r="4" fill="white" />
      <text
        x="44"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        ECOCLEAN
      </text>
      <text
        x="44"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        PEST & SANITIZATION
      </text>
    </svg>
  );
}

// 5. Moving & Shifting: SwiftShift
export function Logo05(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="10" y="16" width="20" height="14" rx="2" fill="#F59E0B" />
      <path d="M30 20 L36 20 L38 25 L38 30 L30 30 Z" fill="#F59E0B" />
      <circle cx="16" cy="31" r="3" fill="#1E293B" />
      <circle cx="34" cy="31" r="3" fill="#1E293B" />
      <text
        x="48"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        SWIFTSHIFT
      </text>
      <text
        x="48"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        RELOCATION FLEET
      </text>
    </svg>
  );
}

// 6. Car Care & Repair: ReviveAuto
export function Logo06(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="22" cy="23" r="13" fill="none" stroke="#EF4444" strokeWidth="4" />
      <circle cx="22" cy="23" r="5" fill="#EF4444" />
      <text
        x="44"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        REVIVEAUTO
      </text>
      <text
        x="44"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        MOBILE MECHANIC
      </text>
    </svg>
  );
}

// 7. Personal Care: GlowWell
export function Logo07(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="22" cy="23" r="11" fill="#EC4899" opacity="0.85" />
      <circle cx="22" cy="23" r="5" fill="white" />
      <text
        x="44"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        GLOWWELL
      </text>
      <text
        x="44"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        SALON & WELLNESS
      </text>
    </svg>
  );
}

// 8. Home Maintenance: Craftsman Pro
export function Logo08(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 180 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 14 L24 14 L24 34 L12 34 Z" fill="#6366F1" />
      <rect x="20" y="18" width="12" height="12" rx="3" fill="#818CF8" />
      <text
        x="44"
        y="28"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        CRAFTSMAN
      </text>
      <text
        x="44"
        y="38"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="700"
        fillOpacity="0.6"
        letterSpacing="0.12em"
      >
        HOME MAINTENANCE
      </text>
    </svg>
  );
}
