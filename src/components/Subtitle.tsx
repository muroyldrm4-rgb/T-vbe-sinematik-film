import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Seslendirme altyazısı. Bir <Sequence> içinde kullanılır; kare 0 = satırın başlangıcı.
 * Yumuşak giriş (bulanıktan netliğe + hafif yukarı kayma) ve çıkış.
 */
export const Subtitle: React.FC<{ text: string; fadeFrames?: number }> = ({ text, fadeFrames = 14 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const inP = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const outP = interpolate(frame, [durationInFrames - fadeFrames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(inP, outP);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 400 }}>
      <div
        style={{
          maxWidth: 900,
          padding: "0 60px",
          textAlign: "center",
          fontFamily: '"Liberation Serif", "DejaVu Serif", Georgia, "Times New Roman", serif',
          fontSize: 62,
          lineHeight: 1.3,
          letterSpacing: 0.5,
          color: "#e9f0fa",
          opacity,
          transform: `translateY(${(1 - inP) * 18}px)`,
          filter: `blur(${(1 - inP) * 6}px)`,
          textShadow: "0 0 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9), 0 0 40px rgba(60,110,180,0.25)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
