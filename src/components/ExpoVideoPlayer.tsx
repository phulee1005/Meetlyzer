import React, { useMemo, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import SubtitleOverlay from "./SubtitleOverlay";
import { TranslationAI } from "types/record";
import { convertSecondsToTime } from "utils/time";

interface ExpoVideoPlayerProps {
  uri: string;
  translations: TranslationAI[];
}

export default function ExpoVideoPlayer({
  uri,
  translations,
}: ExpoVideoPlayerProps) {
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");

  // Memoize the time translation mapping
  const arrayTimeTrans = useMemo(() => {
    const result: { [x: string]: string } = {};
    translations?.forEach((trans) => {
      result[`${trans.start}-${trans.end}`] = trans.transcript || "";
    });
    return result;
  }, [translations]);

  // Memoize the time update handler to prevent recreation on every render
  const handleTimeUpdate = useCallback(
    (payload: any) => {
      const currentTime = payload.currentTime * 1000;
      if (currentTime > 0) {
        const key = Object.keys(arrayTimeTrans).find((key) => {
          const [start, end] = key.split("-");
          return currentTime >= parseInt(start) && currentTime <= parseInt(end);
        });

        if (key) {
          setCurrentSubtitle(arrayTimeTrans[key]);
        } else {
          setCurrentSubtitle("");
        }
      }
    },
    [arrayTimeTrans]
  );

  const player = useVideoPlayer(uri, (player) => {
    player.timeUpdateEventInterval = 1;
  });

  useEventListener(player, "timeUpdate", handleTimeUpdate);

  const subtitleOverlay = useMemo(() => {
    if (!currentSubtitle) return null;
    return <SubtitleOverlay content={currentSubtitle} />;
  }, [currentSubtitle]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
      />
      {subtitleOverlay}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
});
