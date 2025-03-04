import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import { generalStyles } from "@/constants/styles";
import { ThemedText } from "@/components/ThemedText";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { ACHIEVMENTS, hexToRgb } from "@/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Index() {
  const { width } = useWindowDimensions();
  const wide = width > 540;
  const inset = useSafeAreaInsets();
  const text = useThemeColor({}, "text");
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);

  const hexColors = useMemo(
    () =>
      ACHIEVMENTS.map((item) =>
        item.completed ? hexToRgb(item.color) : "rgba(0,0,0,0)"
      ),
    [ACHIEVMENTS]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const animatedBg = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        ACHIEVMENTS.map((_, i) => i * width),
        hexColors
      ),
    };
  });

  const Badge = useMemo(() => {
    return ({ item, index }: { index: number; item: any }) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];

      const animatedValues = useDerivedValue(() => {
        return {
          opacity: interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
          ),
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [width * -0.4, 0, width * 0.4],
            Extrapolation.CLAMP
          ),
          scale: interpolate(
            scrollX.value,
            inputRange,
            [0.65, 1, 0.65],
            Extrapolation.CLAMP
          ),
        };
      });

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: animatedValues.value.opacity,
          transform: [
            { translateX: animatedValues.value.translateX },
            { scale: animatedValues.value.scale },
          ],
        };
      });

      const scrollToNext = () => {
        if (scrollRef.current) {
          const nextIndex = index === ACHIEVMENTS.length - 1 ? 0 : index + 1;
          scrollRef.current.scrollTo({
            x: width * nextIndex,
            animated: true,
          });
        }
      };

      return (
        <Pressable
          onPress={scrollToNext}
          hitSlop={{
            top: 100,
            bottom: 100,
            left: 20,
            right: 20,
          }}
        >
          <Animated.View
            style={[
              styles.achievment,
              { width: width },
              animatedStyle,
              {
                filter: item.completed ? "none" : "grayscale(1)",
              },
            ]}
          >
            <View
              style={{
                filter: item.completed
                  ? "none"
                  : "brightness(0.6) grayscale(8)",
              }}
            >
              <Image
                source={item.image}
                style={[
                  styles.image,
                  {
                    width: wide ? 240 : 205,
                  },
                ]}
              />
            </View>
            {!item.completed && (
              <ThemedText
                style={{
                  lineHeight: 84,
                  position: "absolute",
                  transform: [{ translateY: "70%" }],
                  filter: "drop-shadow(0 0 4px #00000040)",
                }}
              >
                <MaterialIcons name="lock" size={80} />
              </ThemedText>
            )}
          </Animated.View>
        </Pressable>
      );
    };
  }, [width, scrollX]);

  const Content = useMemo(() => {
    return ({ item, index }: { index: number; item: any }) => {
      const inputRange = [
        (index - 1) * width,
        (index - 1) * width + width / 2.5,
        index * width,
        (index + 1) * width - width / 2,
        (index + 1) * width,
      ];

      const zIndex = useAnimatedStyle(() => {
        const value = scrollX.value;
        return {
          zIndex: value > inputRange[0] && value < inputRange[-1] ? 1 : 0,
        };
      });
      const opacity = useAnimatedStyle(() => {
        const value = scrollX.value;
        return {
          opacity: interpolate(
            value,
            inputRange,
            [0, 0, 1, 0, 0],
            Extrapolation.CLAMP
          ),
        };
      });

      const btnOpacity = useAnimatedStyle(() => {
        return {
          opacity: interpolate(
            scrollX.value,
            inputRange,
            [0, 0.5, 1, 0.5, 0],
            Extrapolation.CLAMP
          ),
        };
      });

      return (
        <Animated.View
          style={[
            styles.content,
            {
              filter: item.completed ? "none" : "grayscale(1)",
            },
            zIndex,
          ]}
        >
          <Animated.View
            style={[
              opacity,
              {
                gap: 16,
              },
            ]}
          >
            <ThemedText style={[generalStyles.family_text, generalStyles.text]}>
              {item.title}
            </ThemedText>
            <ThemedText
              style={[
                generalStyles.family_sub,
                generalStyles.sub_text,
                {
                  opacity: 0.7,
                  paddingBottom: 16,
                },
              ]}
            >
              {item.description}
            </ThemedText>
            {item.completed && (
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
                {`Earned on ${item.date}`}
              </ThemedText>
            )}
          </Animated.View>

          {item.completed && (
            <View
              style={[
                generalStyles.fill,
                {
                  justifyContent: "flex-end",
                  marginBottom: 24,
                },
              ]}
            >
              <AnimatedPressable
                style={[
                  styles.button,
                  btnOpacity,
                  {
                    backgroundColor: text + 20,
                    borderColor: text + 30,
                  },
                ]}
                onPress={() => {
                  console.log("Share", index);
                }}
              >
                <ThemedText>
                  <Feather name="share" size={15} />
                </ThemedText>
                <ThemedText
                  style={[
                    generalStyles.family_text,
                    generalStyles.sub_text,
                    {
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      fontSize: 12,
                      opacity: 0.7,
                      paddingHorizontal: 0,
                    },
                  ]}
                >
                  Share
                </ThemedText>
              </AnimatedPressable>
            </View>
          )}
        </Animated.View>
      );
    };
  }, [scrollX, width, text, ACHIEVMENTS]);

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
      <Animated.View style={[styles.overlay, animatedBg]} />
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
          disableIntervalMomentum
        >
          {ACHIEVMENTS.map((item, index) => (
            <Badge item={item} index={index} key={index} />
          ))}
        </Animated.ScrollView>
        <View
          style={{
            flex: 1.3,
            width,
          }}
        >
          {ACHIEVMENTS.map((item, index) => (
            <Content item={item} index={index} key={index} />
          ))}
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
    paddingVertical: 24,
    gap: 16,
    alignItems: "center",
    position: "absolute",
    minHeight: 300,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    filter: "opacity(0.4)",
  },
  image: {
    aspectRatio: 1,
    filter: "drop-shadow(0 0 4px #00000035)",
  },
});
