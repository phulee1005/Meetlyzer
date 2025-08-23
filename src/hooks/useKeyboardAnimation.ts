import { useRef, useEffect } from "react";
import { Animated, Keyboard, KeyboardEvent } from "react-native";
import { heightScale } from "../utils/scale";

interface UseKeyboardAnimationProps {
  bgImageTranslateY?: Animated.Value;
  bgImageOpacity?: Animated.Value;
  contentTranslateY?: Animated.Value;
  onFocus?: () => void;
  onBlur?: () => void;
  bgImageTranslateYValue?: number;
  contentTranslateYValue?: number;
  bgImageOpacityValue?: number;
  animationDuration?: number;
  opacityDuration?: number;
  autoListenKeyboard?: boolean;
}

export const useKeyboardAnimation = ({
  bgImageTranslateY,
  bgImageOpacity,
  contentTranslateY,
  onFocus,
  onBlur,
  bgImageTranslateYValue = -heightScale(240),
  contentTranslateYValue = -heightScale(240),
  bgImageOpacityValue = 0,
  animationDuration = 300,
  opacityDuration = 400,
  autoListenKeyboard = false,
}: UseKeyboardAnimationProps = {}) => {
  const defaultBgImageTranslateY = useRef(new Animated.Value(0)).current;
  const defaultBgImageOpacity = useRef(new Animated.Value(1)).current;
  const defaultContentTranslateY = useRef(new Animated.Value(0)).current;

  const finalBgImageTranslateY = bgImageTranslateY || defaultBgImageTranslateY;
  const finalBgImageOpacity = bgImageOpacity || defaultBgImageOpacity;
  const finalContentTranslateY = contentTranslateY || defaultContentTranslateY;

  const handleInputFocus = () => {
    onFocus?.();
    Animated.parallel([
      Animated.timing(finalBgImageTranslateY, {
        toValue: bgImageTranslateYValue,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(finalBgImageOpacity, {
        toValue: bgImageOpacityValue,
        duration: opacityDuration,
        useNativeDriver: true,
      }),
      Animated.timing(finalContentTranslateY, {
        toValue: contentTranslateYValue,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInputBlur = () => {
    Keyboard.dismiss();
    onBlur?.();
    Animated.parallel([
      Animated.timing(finalBgImageTranslateY, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(finalBgImageOpacity, {
        toValue: 1,
        duration: opacityDuration,
        useNativeDriver: true,
      }),
      Animated.timing(finalContentTranslateY, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Auto listen keyboard events
  useEffect(() => {
    if (!autoListenKeyboard) return;

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        handleInputFocus();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        handleInputBlur();
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return {
    bgImageTranslateY: finalBgImageTranslateY,
    bgImageOpacity: finalBgImageOpacity,
    contentTranslateY: finalContentTranslateY,
    handleInputFocus,
    handleInputBlur,
  };
};
