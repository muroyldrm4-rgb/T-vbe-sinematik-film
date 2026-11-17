// Medya dosyalarını kontrol eder, eksikleri listeler ve manifest'teki
// "ready" alanlarını diskteki duruma göre günceller.
// Kullanım: npm run check-media
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "src/config/media-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

let missing = 0;
let changed = false;

for (const [scene, entries] of Object.entries(manifest)) {
  if (scene.startsWith("_")) continue;
  console.log(`\n▶ Sahne: ${scene}`);
  for (const [key, entry] of Object.entries(entries)) {
    const abs = path.join(root, "public", entry.path);
    const exists = fs.existsSync(abs) && fs.statSync(abs).size > 0;
    if (entry.ready !== exists) {
      entry.ready = exists;
      changed = true;
    }
    if (exists) {
      console.log(`  ✅ ${key.padEnd(12)} public/${entry.path}`);
    } else {
      missing++;
      console.log(`  ❌ EKSİK ${key.padEnd(12)} public/${entry.path}`);
      console.log(`       ↳ ${entry.aciklama}`);
      console.log(`       ↳ Teknik: ${entry.teknik}`);
      console.log(`       ↳ Şimdilik: ${entry.gecici}`);
      if (entry.geciciPath) {
        const ph = path.join(root, "public", entry.geciciPath);
        if (!fs.existsSync(ph)) {
          console.log(`       ⚠ Geçici dosya da yok: public/${entry.geciciPath} → npm run placeholders`);
        }
      }
    }
  }
}

if (changed) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("\n✏  media-manifest.json 'ready' alanları güncellendi.");
}
console.log(missing ? `\nToplam ${missing} eksik medya dosyası. Geçici görüntü/ses ile önizleme yapılabilir.` : "\nTüm medya dosyaları hazır.");
