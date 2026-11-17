import manifest from "./media-manifest.json";

export type MediaEntry = {
  path: string;
  ready: boolean;
  aciklama: string;
  teknik: string;
  gecici: string;
  geciciPath?: string;
};

export type SceneMedia = Record<string, MediaEntry>;

export const ACILIS_MEDIA = manifest.acilis as {
  video: MediaEntry;
  seslendirme: MediaEntry;
  ambiyans: MediaEntry;
  muzik: MediaEntry;
};

/** Hazır olmayan (eksik) medya dosyalarının listesi. */
export const missingMedia = (media: SceneMedia): MediaEntry[] =>
  Object.values(media).filter((m) => !m.ready);
