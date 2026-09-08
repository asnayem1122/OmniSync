import React, { ComponentProps } from "react";

export function Logo01(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28zm0 22a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
        fillOpacity="0.8"
      />
      <circle cx="24" cy="24" r="4" fill="currentColor" />
      <text
        x="50"
        y="30"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="0.05em"
      >
        TECHCORP
      </text>
    </svg>
  );
}

export function Logo02(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="12" y="14" width="20" height="20" rx="6" fillOpacity="0.85" />
      <path d="M17 19l10 5-10 5z" fill="white" />
      <text
        x="42"
        y="29"
        fontFamily="sans-serif"
        fontSize="17"
        fontWeight="800"
        letterSpacing="-0.02em"
      >
        InsightTech
      </text>
    </svg>
  );
}

export function Logo03(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <polygon points="22,10 34,34 10,34" fillOpacity="0.85" />
      <circle cx="22" cy="26" r="3" fill="white" />
      <text
        x="44"
        y="30"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        DesignPro
      </text>
    </svg>
  );
}

export function Logo04(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="16" cy="24" r="8" fillOpacity="0.6" />
      <circle cx="28" cy="24" r="8" fillOpacity="0.85" />
      <text
        x="46"
        y="30"
        fontFamily="sans-serif"
        fontSize="17"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        BrandBoost
      </text>
    </svg>
  );
}

export function Logo05(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 16h20v4H14zm0 8h14v4H14zm0 8h18v4H14z"
        fillOpacity="0.85"
      />
      <text
        x="42"
        y="30"
        fontFamily="sans-serif"
        fontSize="17"
        fontWeight="800"
        letterSpacing="-0.01em"
      >
        CodeCrafters
      </text>
    </svg>
  );
}

export function Logo06(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="12" y="12" width="10" height="24" rx="2" fillOpacity="0.8" />
      <rect x="26" y="18" width="10" height="18" rx="2" fillOpacity="0.6" />
      <text
        x="46"
        y="30"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="0.03em"
      >
        InnovateX
      </text>
    </svg>
  );
}
