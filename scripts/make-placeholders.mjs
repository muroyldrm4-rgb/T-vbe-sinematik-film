// Geçici ses dosyalarını ffmpeg ile üretir (gerçek kayıt gelene kadar).
// Kullanım: npm run placeholders   (sistemde ffmpeg kurulu olmalı)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/placeholders");
fs.mkdirSync(outDir, { recursive: true });

const rain = path.join(outDir, "yagmur_gecici.wav");
// Pembe + kahverengi gürültü karışımı, band filtreli → uzaktan yağmur hissi.
execFileSync("ffmpeg", [
  "-y", "-hide_banner", "-loglevel", "error",
  "-f", "lavfi", "-i", "anoisesrc=color=pink:amplitude=0.5:duration=8:seed=7",
  "-f", "lavfi", "-i", "anoisesrc=color=brown:amplitude=0.6:duration=8:seed=11",
  "-filter_complex",
  "[0]highpass=f=900,lowpass=f=6500,volume=0.35[a];[1]lowpass=f=400,volume=0.5[b];[a][b]amix=inputs=2:normalize=0,afade=t=in:d=1.2,afade=t=out:st=7:d=1,volume=0.8",
  "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", rain,
]);
console.log("✅ Üretildi:", path.relative(root, rain));
