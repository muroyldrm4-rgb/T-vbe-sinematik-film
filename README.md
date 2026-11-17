# Tövbe – Dönmek İçin Geç Değil

Remotion + TypeScript ile hazırlanan dikey (9:16) sinematik video projesi.
**Etap 1:** yalnızca 8 saniyelik açılış sahnesi.

| Ayar | Değer |
|---|---|
| Çözünürlük | 1080 x 1920 (9:16) |
| FPS | 30 |
| Süre | 8 sn (240 kare) |
| Kompozisyonlar | `AcilisSahnesi` (eksik medya etiketi görünür), `AcilisSahnesi-Temiz` (etiketsiz) |

## Açılış sahnesi

- **Görüntü:** Gece, karanlık yatak odası. Yatağın kenarında sırtı kameraya dönük oturan genç. Pencerede yağmur, soğuk mavi ışık, dramatik gölgeler. Kamera yavaşça gence yaklaşır (katmanlı paralaks dolly-in + hafif el kamerası titreşimi), sığ alan derinliği, film greni, vinyet.
- **Seslendirme / altyazı:**
  - 0:00.9 – 0:03.9 → *Kaç defa söz verdin Rabbine?*
  - 0:04.4 – 0:07.7 → *"Bir daha yapmayacağım" dedin...*

## ⚠ Eksik medya dosyaları (henüz yok)

| Dosya (public/ altında) | Şu an yerine kullanılan |
|---|---|
| `media/video/sahne01_yatak_odasi.mp4` | Prosedürel SVG sahne (`src/components/ProceduralBedroom.tsx`) |
| `media/audio/vo_sahne01.wav` | Ses yok, yalnızca zamanlanmış altyazı |
| `media/audio/ambiyans_yagmur.wav` | `placeholders/yagmur_gecici.wav` (ffmpeg ile üretilmiş gürültü) |
| `media/audio/muzik_acilis.wav` | Yok |

Ayrıntılar: [`public/media/README.md`](public/media/README.md). Durumu görmek için: `npm run check-media`.

## Kurulum ve kullanım

```bash
npm install
npm run check-media      # eksik dosyaları listeler, manifest'i günceller
npm run studio           # tarayıcıda canlı önizleme (http://localhost:3000)
npm run render:acilis    # out/acilis_sahnesi_onizleme.mp4 üretir
npm run typecheck        # TypeScript kontrolü
npm run placeholders     # geçici yağmur sesini yeniden üretir (ffmpeg gerekir)
```

Etiketsiz sürüm: `npx remotion render AcilisSahnesi-Temiz out/acilis_temiz.mp4`

İnternetsiz ortamda Remotion Chrome indiremezse:
`REMOTION_BROWSER_EXECUTABLE=/yol/chrome-headless-shell npm run render:acilis`

## Hazır önizleme

`onizleme/acilis_sahnesi_onizleme.mp4` — geçici görüntü ve geçici yağmur sesiyle üretilmiş 8 sn'lik MP4 (H.264 + AAC, 1080x1920, 30 fps).

## Yapı

```
src/
  index.ts / Root.tsx              # Kompozisyon kaydı
  config/video.ts                  # 1080x1920, 30 fps, süreler
  config/media-manifest.json       # Medya yer tutucuları (yol, açıklama, ready)
  scenes/AcilisSahnesi.tsx         # Sahne 1: gerçek medya varsa onu, yoksa geçiciyi kullanır
  components/ProceduralBedroom.tsx # Geçici görüntü: oda, genç, yatak, toz
  components/RainWindow.tsx        # Yağmurlu pencere
  components/camera.ts             # Dolly-in kamera hareketi
  components/CinematicGrade.tsx    # Renk, vinyet, gren, açılış karartması
  components/Subtitle.tsx          # Altyazı
  components/PlaceholderBadge.tsx  # Kadrajdaki "eksik medya" etiketi
scripts/check-media.mjs, make-placeholders.mjs
```
