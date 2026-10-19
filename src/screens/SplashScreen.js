import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

// How long the splash stays up before moving on to the landing page.
export const SPLASH_DURATION_MS = 2200;

// The same round icon the landing page uses.
const logoIcon = require("../../assets/images/no_word.png");

// ---- Easy knobs to tune ----
const LOGO_SIZE = 120; // the round icon
const NAME_SIZE = 20; // the "SignConnect" text under it

// First screen of SignConnect: just the logo and name on a plain background,
// then it moves on to the landing page by itself.
export default function SplashScreen() {
  // Starts see-through and slightly small, then grows in (the "enter" animation).
  const [fade] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(0.96));

  useEffect(() => {
    let cancelled = false;

    // Skip the animation for people who turned on "reduce motion" on their phone.
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        fade.setValue(1);
        scale.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const timer = setTimeout(() => {
      router.replace("/landing");
    }, SPLASH_DURATION_MS);

    // Clean up if the screen is closed early, so it never navigates afterwards.
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fade, scale]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3f327f" />

      <Animated.View
        style={[styles.logo, { opacity: fade, transform: [{ scale }] }]}
        accessible
        accessibilityRole="image"
        accessibilityLabel="SignConnect"
      >
        <Image
          source={logoIcon}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          resizeMode="contain"
        />
        <Text style={styles.name}>SignConnect</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#3f327f",
  },
  logo: {
    alignItems: "center",
    gap: 16,
  },
  name: {
    color: "#FFFFFF",
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontWeight: "700",
    fontSize: NAME_SIZE,
    letterSpacing: 0.5,
  },
});
