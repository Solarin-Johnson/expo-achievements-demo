import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { generalStyles } from "@/constants/styles";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  return (
    <ThemedView style={generalStyles.container}>
      <ThemedText style={[generalStyles.family_text, generalStyles.text]}>
        Badiboy!
      </ThemedText>
      <ThemedText style={[generalStyles.family_sub, generalStyles.sub_text]}>
        badboy here
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
