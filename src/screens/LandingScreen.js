import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
// import { requestSession, joinSessionByCode, ApiError } from "../services/api";
const logoIcon = require("../../assets/images/no_word.png");
const heroPhoto = require("../../assets/images/interpreter5.jpg");
const pipPhoto = require("../../assets/images/interpreter2.png");

const LOGO_ICON_SIZE = 130;

// Public entry point. Get Started and Sign Up lead to role selection.
export default function LandingScreen() {
  const [bounce] = useState(() => new Animated.Value(0));

  // Animate the Get Started button unless reduced motion is enabled.
  useEffect(() => {
    let cancelled = false;
    let loop;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled || reduceMotion) return;

      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -12,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );

      loop.start();
    });

    return () => {
      cancelled = true;
      if (loop) loop.stop();
    };
  }, [bounce]);

  const goToRoles = () => router.push("/roles");
  const goToLogin = () => router.push("/login");

  return (
    <View style={styles.page}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Purple background */}
      <LinearGradient
        colors={["#2d1060", "#3b1a85", "#4c27a6", "#6a3fd8"]}
        locations={[0, 0.38, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft glow rising from the bottom */}
      <LinearGradient
        colors={[
          "rgba(226,214,255,0)",
          "rgba(226,214,255,0.4)",
          "rgba(255,255,255,0.7)",
        ]}
        style={styles.glow}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header: logo, Login and Sign Up */}
          <View style={styles.header}>
            <View
              style={styles.logo}
              accessible
              accessibilityRole="image"
              accessibilityLabel="SignConnect"
            >
              <Image
                source={logoIcon}
                style={{
                  width: LOGO_ICON_SIZE,
                  height: LOGO_ICON_SIZE,
                }}
                resizeMode="contain"
              />

              {/* FIX: Use text instead of the undefined logoWord image */}
            </View>

            <View style={styles.nav}>
              <Pressable
                accessibilityRole="link"
                onPress={goToLogin}
                hitSlop={8}
              >
                <Text style={styles.loginText}>Login</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={goToRoles}
                style={styles.signUpButton}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          {/* Security badge */}
          <View style={styles.badge}>
            <Feather name="shield" size={14} color="#4a21c4" />
            <Text style={styles.badgeText}>Secure Video Interpreting</Text>
          </View>

          {/* Main heading */}
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Inclusive Communication. Anytime, Anywhere"
          >
            {"Inclusive Communication.\nAnytime, Anywhere"}
          </Text>

          <Text style={styles.subtitle}>
            Connect instantly with certified sign language interpreters, or
            schedule ahead. SignConnect ensures everyone is heard.
          </Text>

          {/* Animated Get Started button */}
          <Animated.View style={{ transform: [{ translateY: bounce }] }}>
            <Pressable
              accessibilityRole="button"
              onPress={goToRoles}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>Get Started</Text>
              <Feather name="arrow-right" size={20} color="#4a21c4" />
            </Pressable>
          </Animated.View>

          {/* Main interpreter photo */}
          <View style={styles.photoWrap}>
            <View style={styles.halo} />

            <View style={styles.frame}>
              <View style={styles.photo}>
                <Image
                  source={heroPhoto}
                  style={styles.heroImage}
                  resizeMode="cover"
                  accessibilityLabel="Sign language interpreter"
                />

                {/* Small video preview */}
                <View style={styles.pip}>
                  <Image
                    source={pipPhoto}
                    style={styles.pipImage}
                    resizeMode="cover"
                    accessibilityLabel="Remote user preview"
                  />
                </View>

                {/* Availability indicator */}
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>
                    Interpreter available now
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Feature list */}
          <View style={styles.features}>
            {[
              ["user", "Verified Interpreters"],
              ["video", "HD Video"],
              ["lock", "Secure Sessions"],
            ].map(([icon, label]) => (
              <View key={label} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Feather name={icon} size={15} color="#FFFFFF" />
                </View>

                <Text style={styles.featureText}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const SERIF = Platform.select({
  ios: "Georgia",
  default: "serif",
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#3b1a85",
  },

  safe: {
    flex: 1,
  },

  glow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },

  logoWord: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  loginText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  signUpButton: {
    backgroundColor: "#fff",
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  signUpText: {
    color: "#4a21c4",
    fontSize: 15,
    fontWeight: "700",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#fff",
  },

  badgeText: {
    color: "#4a21c4",
    fontSize: 13,
    fontWeight: "600",
  },

  title: {
    color: "#fff",
    fontFamily: SERIF,
    fontWeight: "700",
    fontSize: 32,
    lineHeight: 36,
  },

  subtitle: {
    color: "#f1edff",
    fontSize: 16,
    lineHeight: 23,
  },

  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#140538",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  ctaText: {
    color: "#4a21c4",
    fontSize: 18,
    fontWeight: "700",
  },

  features: {
    gap: 10,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },

  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(150,115,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  photoWrap: {
    marginTop: 8,
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
  },

  halo: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  frame: {
    padding: 14,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.45)",
    shadowColor: "#fff",
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
  },

  photo: {
    borderRadius: 28,
    overflow: "hidden",
    aspectRatio: 495 / 540,
    backgroundColor: "#ddd",
  },

  heroImage: {
    position: "absolute",
    left: 0,
    top: "-15%",
    width: "100%",
    height: "125%",
  },

  pip: {
    position: "absolute",
    top: 14,
    right: 14,
    width: "24%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#ddd",
  },

  pipImage: {
    width: "100%",
    height: "100%",
  },

  statusPill: {
    position: "absolute",
    left: 16,
    bottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#fff",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6a3fd8",
  },

  statusText: {
    color: "#1b1533",
    fontSize: 13,
    fontWeight: "600",
  },
});
