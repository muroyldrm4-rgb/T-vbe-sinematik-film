import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * Sinema görünümü katmanı: soğuk renk düzeltmesi, vinyet, film greni,
 * kenarlarda hafif ışık düşüşü ve açılışta karartmadan açılma.
 */
export const CinematicGrade: React.FC<{ grain?: number; fadeInFrames?: number }> = ({
  grain = 0.09,
  fadeInFrames = 36,
}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, fadeInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Soğuk mavi renk tonu (teal/blue grade) */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,45,90,0.10), rgba(5,12,30,0.18))", mixBlendMode: "soft-light" }} />
      {/* Vinyet */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {/* Film greni — her karede farklı tohum */}
      <AbsoluteFill style={{ opacity: grain, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id={`grain-${frame}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 97} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
        </svg>
      </AbsoluteFill>
      {/* Karartmadan açılış */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
