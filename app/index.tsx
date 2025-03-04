import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { generalStyles } from "@/constants/styles";
import { ThemedText } from "@/components/ThemedText";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { ACHIEVMENTS } from "@/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Index() {
  const { width } = useWindowDimensions();
  const wide = width > 540;
  const inset = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const text = useThemeColor({}, "text");
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);

  const { title, description, color, date, completed } = useMemo(() => {
    return ACHIEVMENTS[currentIndex];
  }, [currentIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event: any) => {
      const current = Math.round(scrollX.value / width);
      scrollX.value = event.contentOffset.x;
      runOnJS(setCurrentIndex)(current);
    },
  });

  const Badge = useMemo(() => {
    return ({ item, index }: { index: number; item: any }) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];

      const opacity = useAnimatedStyle(() => {
        return {
          opacity: interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
          ),
          transform: [
            {
              translateX: interpolate(
                scrollX.value,
                inputRange,
                [width * -0.4, 0, width * 0.4],
                Extrapolation.CLAMP
              ),
            },
            {
              scale: interpolate(
                scrollX.value,
                inputRange,
                [0.65, 1, 0.65],
                Extrapolation.CLAMP
              ),
            },
          ],
        };
      });

      return (
        <Animated.View
          style={[
            styles.achievment,
            { width: width },
            opacity,
            {
              filter: item.completed ? "none" : "grayscale(1)",
            },
          ]}
        >
          <Image
            source={item.image}
            style={{ width: wide ? 240 : 205, aspectRatio: 1 }}
          />
        </Animated.View>
      );
    };
  }, [width, scrollX]);

  return (
    <ThemedView
      style={[
        generalStyles.container,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
        },
      ]}
    >
      <ScrollView
        style={{
          maxWidth: width,
        }}
        contentContainerStyle={[
          generalStyles.container,
          {
            justifyContent: "space-between",
          },
        ]}
        showsHorizontalScrollIndicator={false}
      >
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          style={{ maxWidth: width }}
          contentContainerStyle={styles.scroll}
          onScroll={scrollHandler}
          pagingEnabled={true}
          scrollEventThrottle={16}
          disableIntervalMomentum
        >
          {ACHIEVMENTS.map((item, index) => (
            <Badge item={item} index={index} key={index} />
          ))}
        </Animated.ScrollView>
        <View style={styles.content}>
          <ThemedText style={[generalStyles.family_text, generalStyles.text]}>
            {title}
          </ThemedText>
          <ThemedText
            style={[
              generalStyles.family_sub,
              generalStyles.sub_text,
              {
                paddingBottom: 16,
              },
            ]}
          >
            {description}
          </ThemedText>
          {completed && (
            <>
              <ThemedText
                style={[
                  generalStyles.family_text,
                  generalStyles.sub_text,
                  {
                    textTransform: "capitalize",
                    letterSpacing: 1,
                    fontSize: 13,
                    opacity: 0.5,
                  },
                ]}
              >
                {`Earned on ${date}`}
              </ThemedText>

              <View
                style={[
                  generalStyles.fill,
                  {
                    justifyContent: "flex-end",
                    minHeight: 60,
                    marginBottom: 24,
                  },
                ]}
              >
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: text + 18,
                      borderColor: text + 24,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      generalStyles.family_text,
                      generalStyles.sub_text,
                      {
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontSize: 12,
                        opacity: 0.5,
                      },
                    ]}
                  >
                    Share
                  </ThemedText>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    alignItems: "center",
    height: "100%",
  },
  achievment: {
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    gap: 16,
    alignItems: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1,
    marginBottom: Platform.OS === "web" ? 16 : 0,
  },
});
