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
import Glow from "@/components/ui/Glow";
import { Text } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Index() {
  const { width } = useWindowDimensions();
  const wide = width > 420;
  const inset = useSafeAreaInsets();
  const text = useThemeColor({}, "text");
  const bg = useThemeColor({}, "background");
  const scrollX = useSharedValue(0);

  const hexColors = useMemo(
    () =>
      ACHIEVMENTS.map((item) =>
        item.completed ? hexToRgb(item.color) : hexToRgb(bg)
      ),
    [ACHIEVMENTS, bg]
  );

  const background = useDerivedValue(() => {
    return interpolateColor(
      scrollX.value,
      ACHIEVMENTS.map((_, i) => i * width),
      hexColors
    );
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const animatedBg = useAnimatedStyle(() => {
    return {
      backgroundColor: background.value,
    };
  });

  const Badge = useMemo(() => {
    return ({ item, index }: { index: number; item: any }) => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];

      const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
          scrollX.value,
          inputRange,
          [260, 0, -360],
          Extrapolation.EXTEND
        );

        return {
          transform: [{ rotateY: `${rotate}deg` }],
        };
      });

      return (
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
              filter: item.completed ? "none" : "brightness(0.6) grayscale(8)",
            }}
          >
            <Image
              source={item.image}
              style={[
                styles.image,
                {
                  width: wide ? 250 : width / 1.5,
                },
              ]}
            />
          </View>
          {!item.completed && (
            <Text
              style={{
                color: "#fff",
                lineHeight: 84,
                position: "absolute",
                transform: [{ translateY: "110%" }],
                filter: "drop-shadow(0 0 4px #00000040)",
              }}
            >
              <MaterialIcons name="lock" size={80} />
            </Text>
          )}
        </Animated.View>
      );
    };
  }, [width]);

  const Content = useMemo(() => {
    return ({ item, index }: { index: number; item: any }) => {
      const inputRange = [
        (index - 1) * width,
        (index - 1) * width + width / 2.5,
        index * width,
        (index + 1) * width - width / 2,
        (index + 1) * width,
      ];

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
        <Animated.View style={[styles.content]}>
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
                  opacity: 0.75,
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
                    fontSize: 15,
                    opacity: 0.55,
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
                <ThemedText style={{ opacity: 0.8 }}>
                  <Feather name="share" size={20} />
                </ThemedText>
                <ThemedText
                  style={[
                    generalStyles.family_text,
                    generalStyles.sub_text,
                    {
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      fontSize: 14,
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
  }, [scrollX, width, text]);

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
      <Glow />
      <Animated.View
        style={[generalStyles.overlay, styles.overlay, animatedBg]}
      />
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
        <Animated.FlatList
          horizontal
          data={ACHIEVMENTS}
          renderItem={({ item, index }) => (
            <Badge item={item} index={index} key={index} />
          )}
          keyExtractor={(_, index) => index.toString()}
          snapToInterval={width}
          decelerationRate="fast"
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          style={{ maxWidth: width }}
          contentContainerStyle={styles.scroll}
          onScroll={scrollHandler}
          pagingEnabled={true}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          windowSize={3}
          maxToRenderPerBatch={3}
          initialNumToRender={2}
          disableIntervalMomentum
        />
        <View
          style={{
            flex: 2,
            width,
          }}
        >
          <View style={styles.dotsContainer}>
            {ACHIEVMENTS.map((_, index) => {
              const animatedDotStyle = useAnimatedStyle(() => {
                const scale = interpolate(
                  scrollX.value,
                  [(index - 1) * width, index * width, (index + 1) * width],
                  [0.8, 1.2, 0.8],
                  Extrapolation.CLAMP
                );
                const opacity = interpolate(
                  scrollX.value,
                  [(index - 1) * width, index * width, (index + 1) * width],
                  [0.4, 1, 0.4],
                  Extrapolation.CLAMP
                );
                return { transform: [{ scale }], opacity };
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    animatedDotStyle,
                    {
                      backgroundColor: text + "df",
                    },
                  ]}
                />
              );
            })}
          </View>
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
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  overlay: {
    filter: "opacity(0.6)",
  },
  image: {
    aspectRatio: 1,
    filter: "drop-shadow(0 0 4px #00000030)",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    bottom: 20,
    width: "100%",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginHorizontal: 3,
  },
});
