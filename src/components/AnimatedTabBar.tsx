import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");

interface TabItem {
  id: string;
  title: string;
}

interface AnimatedTabBarProps {
  tabs: TabItem[];
  activeIndex: number;
  flatListRef: React.RefObject<any>;
  animationFirst?: boolean; // true: animation trước, false: scroll trước
  animationDelay?: number; // Delay time in ms
}

const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  tabs,
  activeIndex,
  flatListRef,
  animationFirst = false, // Mặc định scroll trước
  animationDelay = 300, // Mặc định delay 300ms
}) => {
  const animatedTabIndex = useSharedValue(activeIndex);

  useEffect(() => {
    animatedTabIndex.value = withSpring(activeIndex, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex]);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const animateTab = (index: number) => {
    animatedTabIndex.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleTabPress = (index: number) => {
    if (animationFirst) {
      // Cách 1: Animation trước, scroll sau
      animateTab(index);

      setTimeout(() => {
        runOnJS(scrollToIndex)(index);
      }, animationDelay);
    } else {
      // Cách 2: Scroll trước, animation sau (khuyến nghị)
      scrollToIndex(index);

      setTimeout(() => {
        runOnJS(animateTab)(index);
      }, animationDelay);
    }

    // Gọi callback nếu cần (có thể comment out nếu không cần cập nhật state)
    // onTabPress(index);
  };

  // Animated styles for tab indicator
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedTabIndex.value,
      [0, tabs.length - 1],
      [0, width - 40 - (width - 40) / tabs.length],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  // Animated styles for tab text
  const getAnimatedTabStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const opacity = interpolate(
        animatedTabIndex.value,
        [index - 0.5, index, index + 0.5],
        [0.6, 1, 0.6],
        Extrapolate.CLAMP
      );

      const scale = interpolate(
        animatedTabIndex.value,
        [index - 0.5, index, index + 0.5],
        [0.95, 1, 0.95],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const animatedStyle = getAnimatedTabStyle(index);
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <Animated.Text style={[styles.tabText, animatedStyle]}>
              {tab.title}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
      <Animated.View style={[styles.tabIndicator, animatedIndicatorStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: Colors.primaryText,
    fontWeight: "500",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: (width - 40) / 2,
    height: 3,
    backgroundColor: Colors.primaryText,
    borderRadius: 2,
  },
});

export default AnimatedTabBar;
