import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";

// How long the splash stays up before moving to the landing page.
export const SPLASH_DURATION_MS = 2200;

// Round SignConnect logo.
const logoIcon = require("../../assets/images/no_word.png");

const LOGO_SIZE = 230;

export default function SplashScreen() {
  const [fade] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(0.96));

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduceMotion) => {
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
      })
      .catch(() => {
        // Keep the splash usable if the accessibility check fails.
        fade.setValue(1);
        scale.setValue(1);
      });

    const timer = setTimeout(() => {
      router.replace("/landing");
    }, SPLASH_DURATION_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fade, scale]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3f327f" />

      <Animated.View
        style={[
          styles.logo,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
        accessible
        accessibilityRole="image"
        accessibilityLabel="SignConnect"
      >
        <Image
          source={logoIcon}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3f327f",
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
