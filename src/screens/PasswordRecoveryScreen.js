import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./PasswordRecoveryScreen.styles";

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function PasswordRecoveryScreen({
  mode,
  email,
  onEmailChange,
  onSendResetLink,
  onResetComplete,
}) {
  const isReset = mode === "reset";
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSendResetLink = () => {
    setEmailError("");
    if (!validEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    // Frontend-only transition: connect a reset-link API when backend work begins.
    onSendResetLink?.();
  };

  const handleResetPassword = () => {
    setEmailError("");
    setPasswordError("");
    if (!validEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Use at least 8 characters.");
      return;
    }
    // No password is changed until this action is connected to a secure backend endpoint.
    Alert.alert(
      "Ready for integration",
      "Your entries passed frontend validation. Connect the password-reset API to complete the change.",
      [{ text: "OK", onPress: () => onResetComplete?.() }],
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F4FB" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={[styles.heading, isReset && styles.resetHeading]}>
              {isReset ? "Select a new password" : "Forgot Password?"}
            </Text>
            <Text style={styles.subtitle}>
              {isReset
                ? "Choose a strong password you haven't used\nbefore"
                : "Enter your email and we'll send reset\ninstructions"}
            </Text>

            <View style={[styles.fieldGroup, isReset && styles.resetFieldGroup]}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                accessibilityLabel="Email address"
                value={email}
                onChangeText={(value) => {
                  onEmailChange(value);
                  setEmailError("");
                }}
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="name@example.com"
                placeholderTextColor="#696783"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType={isReset ? "next" : "done"}
              />
              {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
            </View>

            {isReset ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  accessibilityLabel="New password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setPasswordError("");
                  }}
                  style={[styles.input, passwordError ? styles.inputError : null]}
                  placeholder="Enter your password"
                  placeholderTextColor="#696783"
                  secureTextEntry
                  textContentType="newPassword"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
              </View>
            ) : null}

            <TouchableOpacity
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={isReset ? handleResetPassword : handleSendResetLink}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {isReset ? "Reset password" : "Send reset link"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Add new item"
          style={styles.fab}
          onPress={() =>
            Alert.alert(
              "Add new item",
              "Connect this action to the existing create-item flow when integrating the backend.",
            )
          }
          activeOpacity={0.85}
        >
          <Feather name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.tabBar}>
          <TabItem icon="home" label="Dashboard" />
          <TabItem icon="users" label="Users" />
          <TabItem icon="user-check" label="Verify" selected />
          <TabItem icon="video" label="Sessions" />
          <TabItem icon="settings" label="Settings" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function TabItem({ icon, label, selected = false }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabIconBox, selected && styles.tabIconBoxSelected]}>
        <Feather
          name={icon}
          size={21}
          color={selected ? "#214D3B" : "#FFFFFF"}
          strokeWidth={selected ? 2.2 : 1.8}
        />
      </View>
      <Text style={styles.tabLabel}>{label}</Text>
    </View>
  );
}
