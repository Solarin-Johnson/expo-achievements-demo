import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  useFonts,
  Righteous_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/dev";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Righteous_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    const setNavBar = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await NavigationBar.setPositionAsync("absolute");
        await NavigationBar.setBackgroundColorAsync("#00000000");
      } catch (e) {
        console.warn("Error setting navigation bar:", e);
      } finally {
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      }
    };
    if (Platform.OS === "android") {
      setNavBar();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
