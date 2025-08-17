export function convertSecondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedTime = [
    (hours > 0 && String(hours).padStart(2, "0")) || "00",
    (minutes > 0 && String(minutes).padStart(2, "0")) || "00",
    (secs > 0 && String(secs).padStart(2, "0")) || "00",
  ].join(":");

  return formattedTime;
}
