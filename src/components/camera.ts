import { Easing, interpolate } from "remotion";

/**
 * Yavaş "dolly-in" kamera hareketi.
 * Katmanlar farklı derinlikte olduğu için her biri farklı oranda büyür
 * (paralaks) — bu, düz bir zoom yerine gerçek bir kamera yaklaşması hissi verir.
 *
 * depth: 0 = en uzak (duvar/pencere), 1 = özne (genç), 2 = ön plan (yatak)
 */
export const cameraTransform = (
  frame: number,
  durationInFrames: number,
  depth: number,
): string => {
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  const startScale = 1.04;
  const endScale = 1.1 + depth * 0.08; // 1.10 / 1.18 / 1.26
  const scale = startScale + (endScale - startScale) * p;

  // Hafif "omuz kamerası" titreşimi — deterministik, frame tabanlı.
  const drift = 0.6 + depth * 0.35;
  const dx = (Math.sin(frame / 37) * 3 + Math.sin(frame / 17 + 1.3) * 1.5) * drift;
  const dy = (Math.sin(frame / 29 + 2.1) * 2.5 + Math.sin(frame / 13) * 1) * drift;

  // Yaklaşırken kadraj gencin başına doğru hafifçe kayar.
  const tiltY = -14 * p * (1 + depth * 0.4);

  return `translate(${dx}px, ${dy + tiltY}px) scale(${scale})`;
};

/** Kamera hareketinin odak noktası (gencin baş/omuz bölgesi). */
export const CAMERA_ORIGIN = "50% 50%";
