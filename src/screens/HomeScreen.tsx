// Placeholder landing screen after sign-in, until the role dashboards are built.
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { endSession, getCurrentUser } from "../services/session";

export default function HomeScreen() {
  const user = getCurrentUser();
  if (!user) {
    return <Redirect href="/login" />;
  }

  const handleSignOut = async () => {
    await endSession();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Welcome, {user.full_name}
        </Text>
        <Text style={styles.subtitle}>You are signed in as {user.role}.</Text>
        <Pressable style={styles.button} onPress={handleSignOut} accessibilityRole="button">
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4FB",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#1B1530",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#6B6785",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    height: 44,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: "#4A3A9A",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
