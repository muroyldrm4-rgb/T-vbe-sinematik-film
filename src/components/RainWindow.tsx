import React from "react";
import { random } from "remotion";

/** Pencere geometrisi (1080x1920 kadraj koordinatları). */
export const WINDOW = {
  x: 330,
  y: 340,
  w: 520,
  h: 700,
  frame: 22,
  mullionX: 590,
  mullionY: 640,
} as const;

const GLASS = {
  x: WINDOW.x + WINDOW.frame,
  y: WINDOW.y + WINDOW.frame,
  w: WINDOW.w - WINDOW.frame * 2,
  h: WINDOW.h - WINDOW.frame * 2,
};

type Streak = { x: number; speed: number; len: number; phase: number; op: number; w: number };
type Drop = { x: number; y: number; r: number; op: number };
type Trickle = { x: number; y0: number; speed: number; r: number; wobble: number };

const STREAKS: Streak[] = Array.from({ length: 110 }, (_, i) => ({
  x: GLASS.x - 60 + random(`sx-${i}`) * (GLASS.w + 80),
  speed: 38 + random(`ss-${i}`) * 30,
  len: 40 + random(`sl-${i}`) * 90,
  phase: random(`sp-${i}`) * 2000,
  op: 0.12 + random(`so-${i}`) * 0.35,
  w: 1 + random(`sw-${i}`) * 1.6,
}));

const DROPS: Drop[] = Array.from({ length: 150 }, (_, i) => ({
  x: GLASS.x + random(`dx-${i}`) * GLASS.w,
  y: GLASS.y + random(`dy-${i}`) * GLASS.h,
  r: 1.5 + Math.pow(random(`dr-${i}`), 2.2) * 7,
  op: 0.35 + random(`do-${i}`) * 0.5,
}));

const TRICKLES: Trickle[] = Array.from({ length: 9 }, (_, i) => ({
  x: GLASS.x + 20 + random(`tx-${i}`) * (GLASS.w - 40),
  y0: GLASS.y + random(`ty-${i}`) * GLASS.h * 0.6,
  speed: 0.5 + random(`ts-${i}`) * 1.4,
  r: 4 + random(`tr-${i}`) * 4,
  wobble: random(`tw-${i}`) * 10,
}));

const BOKEH = Array.from({ length: 16 }, (_, i) => ({
  x: GLASS.x + random(`bx-${i}`) * GLASS.w,
  y: GLASS.y + GLASS.h * 0.45 + random(`by-${i}`) * GLASS.h * 0.55,
  r: 10 + random(`br-${i}`) * 26,
  warm: random(`bw-${i}`) > 0.62,
  op: 0.08 + random(`bo-${i}`) * 0.18,
}));

/**
 * Yağmurlu gece penceresi: arka plandaki bulanık şehir ışıkları, yağan yağmur,
 * camdaki damlalar ve aşağı süzülen su izleri.
 */
export const RainWindow: React.FC<{ frame: number; lightLevel: number }> = ({ frame, lightLevel }) => {
  return (
    <g>
      <defs>
        <clipPath id="glass-clip">
          <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} />
        </clipPath>
        <linearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1a2e" />
          <stop offset="55%" stopColor="#24456f" />
          <stop offset="100%" stopColor="#4d7fb5" />
        </linearGradient>
        <radialGradient id="drop-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e6f1ff" stopOpacity={0.95} />
          <stop offset="45%" stopColor="#7ea7d8" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#0b1626" stopOpacity={0.7} />
        </radialGradient>
        <filter id="bokeh-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <filter id="far-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <filter id="streak-blur">
          <feGaussianBlur stdDeviation={0.8} />
        </filter>
        <linearGradient id="glass-glare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cfe3ff" stopOpacity={0.12} />
          <stop offset="40%" stopColor="#cfe3ff" stopOpacity={0} />
          <stop offset="100%" stopColor="#cfe3ff" stopOpacity={0.05} />
        </linearGradient>
      </defs>

      {/* Cam arkası: gece göğü ve uzak şehir */}
      <g clipPath="url(#glass-clip)">
        <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} fill="url(#night-sky)" opacity={0.75 + 0.25 * lightLevel} />
        {/* Uzak bina silüetleri */}
        <g filter="url(#far-blur)" opacity={0.75}>
          <path
            d={`M${GLASS.x - 20} ${GLASS.y + GLASS.h} L${GLASS.x - 20} ${GLASS.y + 470} L${GLASS.x + 60} ${GLASS.y + 470} L${GLASS.x + 60} ${GLASS.y + 400} L${GLASS.x + 130} ${GLASS.y + 400} L${GLASS.x + 130} ${GLASS.y + 500} L${GLASS.x + 210} ${GLASS.y + 500} L${GLASS.x + 210} ${GLASS.y + 360} L${GLASS.x + 280} ${GLASS.y + 360} L${GLASS.x + 280} ${GLASS.y + 450} L${GLASS.x + 380} ${GLASS.y + 450} L${GLASS.x + 380} ${GLASS.y + 420} L${GLASS.x + 500} ${GLASS.y + 420} L${GLASS.x + 500} ${GLASS.y + GLASS.h} Z`}
            fill="#0e1b2d"
          />
        </g>
        {/* Bulanık şehir ışıkları */}
        <g filter="url(#bokeh-blur)">
          {BOKEH.map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={b.warm ? "#ffc27a" : "#9cc6ff"}
              opacity={b.op * (0.85 + 0.15 * Math.sin(frame / 11 + i))}
            />
          ))}
        </g>
        {/* Yağan yağmur */}
        <g filter="url(#streak-blur)">
          {STREAKS.map((s, i) => {
            const span = GLASS.h + s.len + 80;
            const y = ((s.phase + frame * s.speed) % span) + GLASS.y - s.len - 40;
            const x = s.x + (y - GLASS.y) * 0.1;
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x + s.len * 0.1}
                y2={y + s.len}
                stroke="#b9d4f5"
                strokeWidth={s.w}
                strokeLinecap="round"
                opacity={s.op}
              />
            );
          })}
        </g>
        {/* Camdaki duran damlalar */}
        {DROPS.map((d, i) => (
          <g key={i} opacity={d.op}>
            <ellipse cx={d.x} cy={d.y} rx={d.r} ry={d.r * 1.15} fill="url(#drop-grad)" />
            <circle cx={d.x - d.r * 0.3} cy={d.y - d.r * 0.35} r={Math.max(0.6, d.r * 0.22)} fill="#f4f9ff" opacity={0.8} />
          </g>
        ))}
        {/* Aşağı süzülen damlalar ve izleri */}
        {TRICKLES.map((t, i) => {
          // Takıl-kay hareketi: damla bazen durur, bazen hızlanır.
          const stick = Math.max(0, Math.sin(frame / 9 + t.wobble));
          const travel = frame * t.speed + stick * 6 + Math.pow(Math.max(0, Math.sin(frame / 23 + i)), 6) * 40;
          const y = t.y0 + travel;
          const x = t.x + Math.sin((y + t.wobble * 20) / 40) * 3;
          if (y > GLASS.y + GLASS.h + 20) return null;
          return (
            <g key={i}>
              <path
                d={`M ${t.x} ${t.y0} Q ${x + 4} ${(t.y0 + y) / 2} ${x} ${y}`}
                stroke="#a9c8ee"
                strokeWidth={t.r * 0.55}
                strokeLinecap="round"
                fill="none"
                opacity={0.22}
              />
              <ellipse cx={x} cy={y} rx={t.r} ry={t.r * 1.3} fill="url(#drop-grad)" opacity={0.9} />
              <circle cx={x - t.r * 0.3} cy={y - t.r * 0.4} r={t.r * 0.25} fill="#ffffff" opacity={0.85} />
            </g>
          );
        })}
        {/* Cam parlaması */}
        <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} fill="url(#glass-glare)" />
      </g>

      {/* Pencere çerçevesi */}
      <g fill="#070a11">
        <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.frame} />
        <rect x={WINDOW.x} y={WINDOW.y + WINDOW.h - WINDOW.frame} width={WINDOW.w} height={WINDOW.frame} />
        <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.frame} height={WINDOW.h} />
        <rect x={WINDOW.x + WINDOW.w - WINDOW.frame} y={WINDOW.y} width={WINDOW.frame} height={WINDOW.h} />
        <rect x={WINDOW.mullionX - 8} y={WINDOW.y} width={16} height={WINDOW.h} />
        <rect x={WINDOW.x} y={WINDOW.mullionY - 7} width={WINDOW.w} height={14} />
      </g>
      {/* Çerçeve kenarlarında soğuk ışık yansıması */}
      <g stroke="#6f97c9" strokeOpacity={0.35} strokeWidth={1.5} fill="none">
        <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} />
        <line x1={WINDOW.mullionX - 8} y1={GLASS.y} x2={WINDOW.mullionX - 8} y2={GLASS.y + GLASS.h} />
        <line x1={GLASS.x} y1={WINDOW.mullionY + 7} x2={GLASS.x + GLASS.w} y2={WINDOW.mullionY + 7} />
      </g>
      {/* Pencere pervazı */}
      <rect x={WINDOW.x - 30} y={WINDOW.y + WINDOW.h} width={WINDOW.w + 60} height={26} fill="#0a0f18" />
      <rect x={WINDOW.x - 30} y={WINDOW.y + WINDOW.h} width={WINDOW.w + 60} height={3} fill="#5b84b8" opacity={0.45} />
    </g>
  );
};
