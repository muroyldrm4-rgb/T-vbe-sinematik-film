import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicGrade } from "../components/CinematicGrade";
import { PlaceholderBadge } from "../components/PlaceholderBadge";
import { ProceduralBedroom } from "../components/ProceduralBedroom";
import { Subtitle } from "../components/Subtitle";
import { CAMERA_ORIGIN, cameraTransform } from "../components/camera";
import { ACILIS_MEDIA, missingMedia } from "../config/media";
import { sec } from "../config/video";

export type AcilisSahnesiProps = {
  /** Eksik medya uyarısını kadrajda göster (önizleme için true, final için false). */
  showPlaceholderInfo: boolean;
  /** Seslendirme altyazılarını göster. */
  showSubtitles: boolean;
};

/** Seslendirme satırları ve zamanlamaları (saniye). Gerçek VO gelince bu değerleri ona göre ayarlayın. */
export const ACILIS_VO_LINES = [
  { text: "Kaç defa söz verdin Rabbine?", from: 0.9, to: 3.95 },
  { text: "“Bir daha yapmayacağım” dedin...", from: 4.4, to: 7.75 },
] as const;

const media = ACILIS_MEDIA;

/** Gerçek çekim varsa onu, yoksa prosedürel geçici sahneyi gösterir. */
const SceneVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (media.video.ready) {
    // Gerçek çekimde dolly yoksa diye hafif dijital yaklaşma uygulanır (depth 0 = en yumuşak).
    return (
      <AbsoluteFill style={{ transform: cameraTransform(frame, durationInFrames, 0), transformOrigin: CAMERA_ORIGIN }}>
        <OffthreadVideo src={staticFile(media.video.path)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  return <ProceduralBedroom />;
};

const SceneAudio: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const ambience = media.ambiyans.ready ? media.ambiyans.path : media.ambiyans.geciciPath;
  return (
    <>
      {ambience ? (
        <Audio
          src={staticFile(ambience)}
          volume={(f) =>
            interpolate(f, [0, 30, durationInFrames - 20, durationInFrames], [0, 0.55, 0.55, 0.4], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      {media.muzik.ready ? <Audio src={staticFile(media.muzik.path)} volume={0.35} /> : null}
      {media.seslendirme.ready ? (
        <Sequence from={sec(ACILIS_VO_LINES[0].from)} layout="none">
          <Audio src={staticFile(media.seslendirme.path)} volume={1} />
        </Sequence>
      ) : null}
    </>
  );
};

export const AcilisSahnesi: React.FC<AcilisSahnesiProps> = ({ showPlaceholderInfo, showSubtitles }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <SceneVisual />
      <CinematicGrade />
      {showSubtitles
        ? ACILIS_VO_LINES.map((line) => (
            <Sequence key={line.text} from={sec(line.from)} durationInFrames={sec(line.to - line.from)}>
              <Subtitle text={line.text} />
            </Sequence>
          ))
        : null}
      {showPlaceholderInfo ? <PlaceholderBadge missing={missingMedia(media)} /> : null}
      <SceneAudio />
    </AbsoluteFill>
  );
};
