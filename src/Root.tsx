import React from "react";
import { Composition, Folder } from "remotion";
import { ACILIS_DURATION, VIDEO } from "./config/video";
import { AcilisSahnesi } from "./scenes/AcilisSahnesi";

/**
 * Tövbe – Dönmek İçin Geç Değil
 * Sahneler burada kaydedilir. İlk etap: yalnızca 8 sn'lik açılış sahnesi.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Tovbe">
      {/* Önizleme: eksik medya uyarısı kadrajda görünür */}
      <Composition
        id="AcilisSahnesi"
        component={AcilisSahnesi}
        durationInFrames={ACILIS_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ showPlaceholderInfo: true, showSubtitles: true }}
      />
      {/* Temiz sürüm: uyarı etiketi olmadan (gerçek medya gelince final için) */}
      <Composition
        id="AcilisSahnesi-Temiz"
        component={AcilisSahnesi}
        durationInFrames={ACILIS_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ showPlaceholderInfo: false, showSubtitles: true }}
      />
    </Folder>
  );
};
