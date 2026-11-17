import { Config } from "@remotion/cli/config";

// Çıktı ayarları: H.264 MP4, yüksek kalite önizleme.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setEntryPoint("src/index.ts");

// İnternetsiz / kısıtlı ortamlarda Remotion kendi Chrome'unu indiremezse,
// sistemdeki bir Chrome/Chromium yolunu ortam değişkeniyle verin:
//   REMOTION_BROWSER_EXECUTABLE=/yol/chrome-headless-shell npm run render:acilis
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
