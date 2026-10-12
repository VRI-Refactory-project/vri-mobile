import React, { useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiError } from "../services/api";
import { login } from "../services/auth";
import { endSession } from "../services/session";
import { STEPS_BLOCK_HEIGHT, colors, styles } from "./LoginScreen.styles";
import { validateLogin, type LoginErrors } from "./LoginScreen.validation";

// Landscape photo (1671x941). It fills the screen height and is anchored left, so the signer stays in view.
const background = require("../../assets/images/interpreter4.png");
const backgroundAspectRatio = 1671 / 941;

const TOTAL_STEPS = 3;
const CURRENT_STEP = 3;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const passwordRef = useRef<TextInput>(null);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const showFormError = (message: string) => {
    setFormError(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot password", "Password recovery is not available in the app yet.");
  };

  const handleLogin = async () => {
    if (submitting) return;

    const nextErrors = validateLogin(identifier, password);
    setErrors(nextErrors);
    setFormError("");
    if (nextErrors.identifier || nextErrors.password) {
      AccessibilityInfo.announceForAccessibility(
        nextErrors.identifier ?? nextErrors.password ?? "",
      );
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(identifier, password);
      if (user.must_change_password) {
        // The API blocks everything except changing the password, and that screen does not exist yet.
        await endSession();
        setSubmitting(false);
        showFormError(
          "Your password was reset by an administrator. Please contact support to finish setting a new one.",
        );
        return;
      }
      // Interpreters see their certification status first; it also tells them if an upload is still needed.
      router.replace(user.role === "interpreter" ? "/pending" : "/home");
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ApiError) {
        const { identifier: identifierError, password: passwordError } = error.fieldErrors;
        if (identifierError || passwordError) {
          setErrors({ identifier: identifierError, password: passwordError });
        } else {
          showFormError(error.message);
        }
      } else {
        showFormError("Something went wrong. Please try again.");
      }
    }
  };

  const renderFieldError = (message?: string) =>
    message ? (
      <Text style={styles.fieldError} accessibilityLiveRegion="polite">
        {message}
      </Text>
    ) : null;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <Image
        source={background}
        style={[
          styles.background,
          { height: windowHeight, width: windowHeight * backgroundAspectRatio },
        ]}
        blurRadius={2}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.scrim} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            // Extra top padding the height of the step indicator keeps the card itself centred on screen.
            {
              paddingTop: insets.top + 16 + STEPS_BLOCK_HEIGHT,
              paddingBottom: insets.bottom + 16,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title} accessibilityRole="header">
              Welcome Back
            </Text>
            <Text style={styles.subtitle}>Sign in to continue to SignConnect.</Text>

            {formError ? (
              <Text style={styles.formError} accessibilityLiveRegion="polite">
                {formError}
              </Text>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Email address
              </Text>
              <TextInput
                style={[styles.input, errors.identifier && styles.inputError]}
                value={identifier}
                onChangeText={(value) => {
                  setIdentifier(value);
                  setErrors((previous) => ({ ...previous, identifier: undefined }));
                }}
                placeholder="name@example.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => passwordRef.current?.focus()}
                editable={!submitting}
                accessibilityLabel="Email address"
                accessibilityHint="You can also sign in with your phone number"
              />
              {renderFieldError(errors.identifier)}
            </View>

            <View style={[styles.fieldGroup, styles.lastFieldGroup]}>
              <Text style={styles.label}>
                Password
              </Text>
              <TextInput
                ref={passwordRef}
                style={[styles.input, errors.password && styles.inputError]}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setErrors((previous) => ({ ...previous, password: undefined }));
                }}
                placeholder="Enter your password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                editable={!submitting}
                accessibilityLabel="Password"
              />
              {renderFieldError(errors.password)}
            </View>

            <Pressable
              style={[styles.loginButton, submitting && styles.loginButtonBusy]}
              onPress={handleLogin}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="Login"
              accessibilityState={{ disabled: submitting, busy: submitting }}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.forgotButton}
              onPress={handleForgotPassword}
              accessibilityRole="button"
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>
          </View>

          <View
            style={styles.steps}
            accessible
            accessibilityLabel={`Step ${CURRENT_STEP} of ${TOTAL_STEPS}`}
          >
            <View style={styles.stepBars}>
              {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                <View
                  key={index}
                  style={[styles.stepBar, index === CURRENT_STEP - 1 && styles.stepBarActive]}
                />
              ))}
            </View>
            <Text style={styles.stepText}>
              Step {CURRENT_STEP} of {TOTAL_STEPS}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Pressable
        style={[styles.backButton, { top: insets.top + 22 }]}
        onPress={handleBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="chevron-left" size={18} color={colors.heading} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}
