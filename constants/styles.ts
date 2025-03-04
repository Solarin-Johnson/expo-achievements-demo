import { StyleSheet } from "react-native";

export const generalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    lineHeight: 42,
    textAlign: "center",
  },
  sub_text: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 12,
    textAlign: "center",
  },
  family_text: {
    fontFamily: "Righteous_400Regular",
  },
  family_sub: {
    fontFamily: "Inter_500Medium",
  },
  fill: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
