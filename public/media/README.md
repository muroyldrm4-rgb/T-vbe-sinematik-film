# Medya klasörü — gerçek dosyalar buraya

Dosyaları **tam olarak** aşağıdaki adlarla koyun, ardından `npm run check-media` çalıştırın.
Komut `src/config/media-manifest.json` içindeki `ready` alanlarını günceller; sahne otomatik olarak
geçici görüntü/ses yerine gerçek dosyayı kullanır.

| Dosya | İçerik | Teknik |
|---|---|---|
| `video/sahne01_yatak_odasi.mp4` | Gece, karanlık yatak odası; yatağın kenarında sırtı kameraya dönük genç; camda yağmur, soğuk mavi ışık, yavaş dolly-in | 1080x1920, 30 fps, ≥ 8 sn |
| `audio/vo_sahne01.wav` | Seslendirme: "Kaç defa söz verdin Rabbine? 'Bir daha yapmayacağım' dedin..." | WAV 48 kHz mono; 0:00.9'da başlar |
| `audio/ambiyans_yagmur.wav` | Cama vuran yağmur, oda tonu | WAV 48 kHz stereo, ≥ 8 sn |
| `audio/muzik_acilis.wav` | Karanlık, düşük pad / drone | WAV 48 kHz stereo, ≥ 8 sn |
