import React from "react";
import "./edgeGlow.css";

type EdgeGlowCardProps = {
  className?: string;
  children: React.ReactNode;
  brandColor?: string; // default to login accent orange
  radius?: string; // Tailwind radius class, e.g. 'rounded-xl'
  thicknessPx?: number; // border glow thickness in px
};

export default function EdgeGlowCard({
  className,
  children,
  brandColor = "#F95700",
  radius = "rounded-xl",
  thicknessPx = 3,
}: EdgeGlowCardProps) {
  return (
    <div
      className={"relative " + (className ?? "") + " " + radius + " edge-glow"}
      style={{
        // CSS variables used by the minimal custom CSS mask
        // @ts-ignore - custom properties
        "--edge-glow-color": brandColor,
        // @ts-ignore
        "--edge-glow-thickness": `${thicknessPx}px`,
      }}
    >
      {/* Content layer stays above the rotating border */}
      <div className="relative z-10">{children}</div>
      {/* The animated border is drawn by ::before via CSS, clipped to edges */}
    </div>
  );
}
