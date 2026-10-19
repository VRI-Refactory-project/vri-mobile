import React from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./LandingScreen.styles";

export default function LandingScreen() {
  // These only print a message for now. We'll connect them to screens later.
const handleLogin = () => {
  router.push("/login");
};

const handleSignUp = () => {
  router.push("/signup");
};

const handleGetStarted = () => {
  router.push("/signup");
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ScrollView lets the screen scroll on small phones */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top bar: logo on the left, Login and Sign Up on the right */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Small white badge */}
        <View style={styles.badge}>
          <Feather name="shield" size={12} color="#3B2978" />
          <Text style={styles.badgeText}>Secure video interpreting</Text>
        </View>

        {/* Title and description */}
        <Text style={styles.title}>SignConnect</Text>
        <Text style={styles.description}>
          Connect instantly with certified sign-language interpreters, or
          schedule ahead.
        </Text>

        {/* Get Started button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Feather name="arrow-right" size={16} color="#3B2978" />
        </TouchableOpacity>

        {/* Three features, each with an icon */}
        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <Feather name="check" size={13} color="#FFFFFF" />
            <Text style={styles.featureText}>Verified interpreters</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="video" size={13} color="#FFFFFF" />
            <Text style={styles.featureText}>HD video</Text>
          </View>
          <View style={styles.feature}>
            <Feather name="lock" size={13} color="#FFFFFF" />
            <Text style={styles.featureText}>Secure sessions</Text>
          </View>
        </View>

        {/* Photo card: big photo, small photo and label stacked in one box */}
        <View style={styles.mediaCard}>
          <Image
            source={require("../../assets/images/interpreter.png")}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <Image
            source={require("../../assets/images/interpreter-small.png")}
            style={styles.smallImage}
            resizeMode="cover"
          />
          <View style={styles.availableBadge}>
            <View style={styles.ring} />
            <Text style={styles.availableText}>Interpreter available now</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
