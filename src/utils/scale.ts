import { Dimensions, PixelRatio } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

// Giá trị chuẩn (ví dựa trên iPhone 12)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export function widthScale(size: number) {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

export function heightScale(size: number) {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
}

export function fontScale(size: number) {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
