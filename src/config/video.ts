/** Proje genel video ayarları — 9:16 dikey, 1080x1920, 30 FPS. */
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const PROJECT_TITLE = "Tövbe – Dönmek İçin Geç Değil";

/** Saniyeyi kareye çevirir (30 FPS). */
export const sec = (s: number): number => Math.round(s * VIDEO.fps);

/** Sahne 1 — Açılış: 8 saniye = 240 kare. */
export const ACILIS_DURATION = sec(8);
