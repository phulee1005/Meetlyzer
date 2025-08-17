import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "constants/colors";

const AudioWaveform: React.FC = () => {
  const animatedValues = useRef<Animated.Value[]>([]).current;

  // Initialize animated values for each bar
  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      animatedValues[i] = new Animated.Value(0.3);
    }
  }, []);

  // Create animation sequence
  useEffect(() => {
    const animations = animatedValues.map((value, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: Math.random() * 0.7 + 0.3, // Random height between 0.3 and 1.0
            duration: 200 + Math.random() * 300, // Random duration between 200-500ms
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
        ]),
        {
          iterations: -1,
        }
      );
    });

    // Start all animations with staggered delays
    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, index * 50);
    });

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, [animatedValues]);

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        {animatedValues.map((animatedValue, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 100],
                }),
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: 300,
  },
  bar: {
    width: 4,
    backgroundColor: Colors.blue,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  centerCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: Colors.blue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  innerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
});

export default AudioWaveform;
