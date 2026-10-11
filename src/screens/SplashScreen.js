import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./SplashScreen.styles";

export default function SplashScreen() {
  const handleContinue = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>
          Inclusive{"\n"}Communication.{"\n"}Anytime. Anywhere.
        </Text>

        <Text style={styles.description}>
          Connect instantly with certified sign-language interpreters
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to create an account"
        >
          <Text style={styles.continueText}>Continue</Text>
          <Feather name="chevron-right" size={20} color="#3B2978" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{"  "}
          <Text style={styles.loginLink} onPress={handleLogin}>
            Log in
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
