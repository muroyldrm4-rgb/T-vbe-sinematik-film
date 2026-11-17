import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CAMERA_ORIGIN, cameraTransform } from "./camera";
import { RainWindow, WINDOW } from "./RainWindow";

/**
 * GEÇİCİ GÖRÜNTÜ — gerçek çekim (public/media/video/sahne01_yatak_odasi.mp4)
 * gelene kadar kullanılan prosedürel SVG sahne.
 *
 * Gece, karanlık yatak odası; yatağın kenarında sırtı kameraya dönük oturan
 * genç bir erkek; yağmurlu pencereden gelen soğuk mavi ışık ve dramatik gölgeler.
 * Üç derinlik katmanı (arka plan / özne / ön plan) ayrı ölçeklenerek
 * paralakslı bir "dolly-in" kamera hareketi elde edilir.
 */

const W = 1080;
const H = 1920;
const FLOOR_Y = 1240;
const BED_EDGE_Y = 1345;

const DUST = Array.from({ length: 40 }, (_, i) => ({
  x: 260 + random(`px-${i}`) * 560,
  y: 380 + random(`py-${i}`) * 1100,
  r: 0.8 + random(`pr-${i}`) * 2.2,
  vx: (random(`pvx-${i}`) - 0.5) * 0.25,
  vy: -0.08 - random(`pvy-${i}`) * 0.25,
  op: 0.15 + random(`po-${i}`) * 0.4,
  ph: random(`pph-${i}`) * 6.28,
}));

const Layer: React.FC<{ depth: number; blur?: number; children: React.ReactNode }> = ({ depth, blur = 0, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        transform: cameraTransform(frame, durationInFrames, depth),
        transformOrigin: CAMERA_ORIGIN,
        // Sığ alan derinliği: odak gençte, arka plan ve ön plan hafif flu.
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

/** Pencereden gelen ışığın yağmur bulutlarıyla hafifçe dalgalanması. */
const useLightLevel = (frame: number): number =>
  0.88 + 0.06 * Math.sin(frame / 19) + 0.04 * Math.sin(frame / 7.3 + 1) + 0.02 * Math.sin(frame / 3.1);

/* ----------------------------- KATMAN 0: ODA ----------------------------- */
const RoomLayer: React.FC<{ frame: number; light: number }> = ({ frame, light }) => (
  <Layer depth={0} blur={1.6}>
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#03050a" />
        <stop offset="60%" stopColor="#080d17" />
        <stop offset="100%" stopColor="#05080e" />
      </linearGradient>
      <radialGradient id="window-glow" cx="0.5" cy="0.36" r="0.55">
        <stop offset="0%" stopColor="#3e6aa3" stopOpacity={0.55} />
        <stop offset="45%" stopColor="#1b3355" stopOpacity={0.25} />
        <stop offset="100%" stopColor="#000000" stopOpacity={0} />
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0b111c" />
        <stop offset="100%" stopColor="#04060a" />
      </linearGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8fb6ea" stopOpacity={0.16} />
        <stop offset="70%" stopColor="#5c86c0" stopOpacity={0.04} />
        <stop offset="100%" stopColor="#5c86c0" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="curtain" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#020306" />
        <stop offset="70%" stopColor="#0b1322" />
        <stop offset="100%" stopColor="#1d3150" />
      </linearGradient>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={18} />
      </filter>
      <filter id="soft-sm" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={4} />
      </filter>
    </defs>

    {/* Duvar ve pencere çevresindeki soğuk ışık */}
    <rect x={-200} y={-200} width={W + 400} height={FLOOR_Y + 200} fill="url(#wall)" />
    <rect x={-200} y={-200} width={W + 400} height={FLOOR_Y + 200} fill="url(#window-glow)" opacity={light} />

    <RainWindow frame={frame} lightLevel={light} />

    {/* Sol perde */}
    <path
      d={`M ${WINDOW.x - 120} 250 C ${WINDOW.x - 60} 600, ${WINDOW.x - 30} 900, ${WINDOW.x - 90} ${FLOOR_Y}
          L ${WINDOW.x + 40} ${FLOOR_Y} C ${WINDOW.x + 70} 900, ${WINDOW.x + 30} 600, ${WINDOW.x + 55} 250 Z`}
      fill="url(#curtain)"
      opacity={0.96}
    />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M ${WINDOW.x - 80 + i * 40} 260 C ${WINDOW.x - 40 + i * 40} 650, ${WINDOW.x - 20 + i * 40} 950, ${WINDOW.x - 60 + i * 42} ${FLOOR_Y}`}
        stroke={i === 2 ? "#4f77ad" : "#000"}
        strokeOpacity={i === 2 ? 0.35 : 0.6}
        strokeWidth={i === 2 ? 3 : 10}
        fill="none"
        filter="url(#soft-sm)"
      />
    ))}

    {/* Sağda komodin ve sönük gece lambası */}
    <g>
      <rect x={880} y={1060} width={190} height={200} fill="#05080d" />
      <rect x={880} y={1060} width={190} height={3} fill="#3f6394" opacity={0.4} />
      <path d="M 945 1060 L 950 960 L 1000 960 L 1005 1060 Z" fill="#070b12" />
      <path d="M 915 960 L 940 870 L 1010 870 L 1035 960 Z" fill="#0a101b" />
      <path d="M 915 960 L 940 870" stroke="#5a83bb" strokeOpacity={0.35} strokeWidth={2} />
      {/* Komodin üstünde ters duran telefon — ince ekran yansıması */}
      <rect x={1010} y={1052} width={46} height={8} rx={2} fill="#0d1420" />
    </g>

    {/* Zemin */}
    <rect x={-200} y={FLOOR_Y} width={W + 400} height={H - FLOOR_Y + 200} fill="url(#floor)" />
    <rect x={-200} y={FLOOR_Y} width={W + 400} height={2} fill="#2c4568" opacity={0.5} />
    {/* Zemindeki pencere ışığı izi */}
    <path
      d={`M ${WINDOW.x + 30} ${FLOOR_Y + 8} L ${WINDOW.x + WINDOW.w - 30} ${FLOOR_Y + 8} L ${WINDOW.x + WINDOW.w + 90} ${BED_EDGE_Y + 30} L ${WINDOW.x - 90} ${BED_EDGE_Y + 30} Z`}
      fill="#5d87bf"
      opacity={0.18 * light}
      filter="url(#soft)"
    />

    {/* Hacimsel ışık huzmesi */}
    <path
      d={`M ${WINDOW.x + 22} ${WINDOW.y + 22} L ${WINDOW.x + WINDOW.w - 22} ${WINDOW.y + 22} L ${W + 160} ${H - 200} L ${-160} ${H - 200} Z`}
      fill="url(#beam)"
      opacity={light}
      filter="url(#soft)"
    />
  </Layer>
);

/* ----------------------- KATMAN 1: GENÇ (SIRTI DÖNÜK) ----------------------- */
const TORSO = `
  M 506 932
  C 482 958, 442 962, 412 984
  C 389 1002, 381 1040, 379 1090
  L 374 1232
  C 374 1266, 392 1286, 418 1292
  L 424 1366
  L 656 1366
  L 662 1292
  C 688 1286, 706 1266, 706 1232
  L 701 1090
  C 699 1040, 691 1002, 668 984
  C 638 962, 598 958, 574 932
  Z`;

const HAIR = `
  M 478 870
  C 474 812, 506 792, 540 792
  C 578 792, 608 812, 604 872
  C 600 858, 594 846, 586 842
  C 588 852, 584 860, 578 864
  C 570 846, 556 838, 542 836
  C 528 840, 514 846, 504 862
  C 500 852, 494 848, 490 846
  C 486 856, 484 864, 478 870 Z`;

const Subject: React.FC<{ frame: number; light: number }> = ({ frame, light }) => {
  // Nefes alma: omuzlar çok hafif yükselip alçalır.
  const breath = Math.sin((frame / 30) * Math.PI * 0.42);
  // Baş zamanla biraz daha öne eğilir — pişmanlık.
  const headDrop = Math.min(1, frame / 200) * 7;

  const body = (fill: string) => (
    <g>
      <g transform={`translate(0 ${headDrop + breath * -1.2})`}>
        <rect x={514} y={900} width={52} height={60} rx={20} fill={fill} />
        <ellipse cx={540} cy={872} rx={62} ry={76} fill={fill} />
        <path d={HAIR} fill={fill} />
        {/* Kulaklar */}
        <ellipse cx={477} cy={885} rx={9} ry={17} fill={fill} />
        <ellipse cx={603} cy={885} rx={9} ry={17} fill={fill} />
      </g>
      <g transform={`translate(540 1366) scale(0.9 ${1 + breath * 0.004}) translate(-540 -1366)`}>
        <path d={TORSO} fill={fill} />
      </g>
    </g>
  );

  return (
    <Layer depth={1}>
      <defs>
        <filter id="rim-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <filter id="rim-wide" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b111d" />
          <stop offset="35%" stopColor="#05070c" />
          <stop offset="100%" stopColor="#020305" />
        </linearGradient>
        <linearGradient id="rim-fade" x1="0" y1="780" x2="0" y2="1380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="45%" stopColor="#fff" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.08} />
        </linearGradient>
        <mask id="rim-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920">
          <rect x="0" y="0" width="1080" height="1920" fill="url(#rim-fade)" />
        </mask>
        <filter id="cloth-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id="spine-shadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="50%" stopColor="#000" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Arkadan gelen ışıkla oluşan geniş hale */}
      <g filter="url(#rim-wide)" opacity={0.35 * light}>{body("#5f8fd1")}</g>
      {/* Keskin kontur ışığı (rim light) — ışık pencereden geldiği için üstte güçlü, aşağıda sönük */}
      <g mask="url(#rim-mask)">
        <g filter="url(#rim-blur)" opacity={0.95 * light} transform="translate(540 1100) scale(1.014) translate(-540 -1104)">
          {body("#b4d1f8")}
        </g>
      </g>
      {/* Silüet */}
      {body("url(#shirt)")}
      {/* Tişört kıvrımları ve omurga gölgesi */}
      <rect x={518} y={990} width={44} height={370} fill="url(#spine-shadow)" />
      {/* Tişört kıvrımları — yumuşak, flu ışık/gölge */}
      <g filter="url(#cloth-blur)">
        <path d="M 445 1010 C 470 995, 500 990, 520 992" stroke="#3d6596" strokeOpacity={0.35} strokeWidth={6} fill="none" />
        <path d="M 560 992 C 585 990, 615 995, 640 1010" stroke="#3d6596" strokeOpacity={0.35} strokeWidth={6} fill="none" />
        <path d="M 455 1175 C 490 1195, 515 1200, 535 1195" stroke="#000" strokeOpacity={0.6} strokeWidth={10} fill="none" />
        <path d="M 560 1140 C 590 1155, 610 1170, 630 1195" stroke="#000" strokeOpacity={0.55} strokeWidth={10} fill="none" />
      </g>
    </Layer>
  );
};

/* ---------------------- KATMAN 2: ÖN PLAN (YATAK) ---------------------- */
const BedLayer: React.FC<{ light: number }> = ({ light }) => (
  <Layer depth={2} blur={2.5}>
    <defs>
      <linearGradient id="quilt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#141e30" />
        <stop offset="18%" stopColor="#0a1019" />
        <stop offset="100%" stopColor="#010203" />
      </linearGradient>
      <filter id="fold-blur" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation={6} />
      </filter>
      <filter id="dof" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={28} />
      </filter>
      <radialGradient id="hip-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#000" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#000" stopOpacity={0} />
      </radialGradient>
    </defs>

    {/* Yatak yüzeyi (genç uzak kenarda oturuyor) */}
    <path
      d={`M -200 ${BED_EDGE_Y + 30} C 200 ${BED_EDGE_Y - 6}, 420 ${BED_EDGE_Y + 2}, 540 ${BED_EDGE_Y + 14}
          C 680 ${BED_EDGE_Y + 2}, 900 ${BED_EDGE_Y - 4}, ${W + 200} ${BED_EDGE_Y + 22}
          L ${W + 200} ${H + 200} L -200 ${H + 200} Z`}
      fill="url(#quilt)"
    />
    {/* Oturduğu yerde çöküntü gölgesi */}
    <ellipse cx={540} cy={BED_EDGE_Y + 40} rx={230} ry={46} fill="url(#hip-shadow)" />
    {/* Kenar ışığı */}
    <path
      d={`M -200 ${BED_EDGE_Y + 30} C 200 ${BED_EDGE_Y - 6}, 400 ${BED_EDGE_Y + 2}, 410 ${BED_EDGE_Y + 6}`}
      stroke="#7aa2d8"
      strokeOpacity={0.55 * light}
      strokeWidth={3}
      fill="none"
    />
    <path
      d={`M 670 ${BED_EDGE_Y + 6} C 900 ${BED_EDGE_Y - 4}, 1000 ${BED_EDGE_Y + 4}, ${W + 200} ${BED_EDGE_Y + 22}`}
      stroke="#7aa2d8"
      strokeOpacity={0.5 * light}
      strokeWidth={3}
      fill="none"
    />
    {/* Yorgan kıvrımları: ışık alan sırtlar + karanlık oyuklar */}
    <g filter="url(#fold-blur)">
      <path d="M 40 1420 C 220 1460, 330 1520, 420 1640" stroke="#2c4366" strokeOpacity={0.6} strokeWidth={10} fill="none" />
      <path d="M 70 1440 C 240 1490, 350 1560, 430 1690" stroke="#000" strokeOpacity={0.8} strokeWidth={22} fill="none" />
      <path d="M 1040 1430 C 860 1470, 760 1560, 700 1700" stroke="#2c4366" strokeOpacity={0.5} strokeWidth={10} fill="none" />
      <path d="M 1020 1460 C 850 1500, 770 1590, 720 1740" stroke="#000" strokeOpacity={0.75} strokeWidth={24} fill="none" />
      <path d="M 300 1390 C 420 1410, 470 1400, 520 1395" stroke="#38557f" strokeOpacity={0.4} strokeWidth={6} fill="none" />
      <path d="M 600 1398 C 680 1405, 760 1415, 860 1395" stroke="#38557f" strokeOpacity={0.35} strokeWidth={6} fill="none" />
    </g>
    {/* Kameraya çok yakın, odak dışı yatak başı / yastık kenarı → derinlik */}
    <path d="M -200 1700 C 80 1660, 240 1760, 300 2120 L -200 2120 Z" fill="#010204" filter="url(#dof)" />
    <path d={`M ${W + 200} 1640 C 980 1620, 880 1760, 860 2120 L ${W + 200} 2120 Z`} fill="#010204" filter="url(#dof)" />
  </Layer>
);

/* ---------------------- Havada süzülen toz parçacıkları ---------------------- */
const DustLayer: React.FC<{ frame: number; light: number }> = ({ frame, light }) => (
  <Layer depth={1.4}>
    {DUST.map((d, i) => {
      const x = d.x + d.vx * frame + Math.sin(frame / 40 + d.ph) * 6;
      const y = d.y + d.vy * frame + Math.cos(frame / 33 + d.ph) * 4;
      const tw = 0.6 + 0.4 * Math.sin(frame / 12 + d.ph);
      return <circle key={i} cx={x} cy={y} r={d.r} fill="#c8dcff" opacity={d.op * tw * light * 0.6} />;
    })}
  </Layer>
);

export const ProceduralBedroom: React.FC = () => {
  const frame = useCurrentFrame();
  const light = useLightLevel(frame);
  return (
    <AbsoluteFill style={{ backgroundColor: "#020306" }}>
      <RoomLayer frame={frame} light={light} />
      <Subject frame={frame} light={light} />
      <DustLayer frame={frame} light={light} />
      <BedLayer light={light} />
    </AbsoluteFill>
  );
};
