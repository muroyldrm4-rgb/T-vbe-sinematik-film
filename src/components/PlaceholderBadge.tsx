import React from "react";
import { AbsoluteFill } from "remotion";
import type { MediaEntry } from "../config/media";

/**
 * Önizlemede eksik medya dosyalarını ekranda açıkça gösterir.
 * Final render'da `showPlaceholderInfo: false` ile kapatılır.
 */
export const PlaceholderBadge: React.FC<{ missing: MediaEntry[] }> = ({ missing }) => {
  if (missing.length === 0) return null;
  return (
    <AbsoluteFill style={{ padding: "70px 50px", pointerEvents: "none" }}>
      <div
        style={{
          alignSelf: "flex-start",
          fontFamily: '"DejaVu Sans Mono", "Liberation Mono", monospace',
          fontSize: 22,
          lineHeight: 1.45,
          color: "#ffd9a0",
          background: "rgba(0,0,0,0.55)",
          border: "2px dashed rgba(255,190,110,0.75)",
          borderRadius: 10,
          padding: "14px 20px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 6 }}>⚠ GEÇİCİ ÖNİZLEME — EKSİK MEDYA</div>
        {missing.map((m) => (
          <div key={m.path}>✕ public/{m.path}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
