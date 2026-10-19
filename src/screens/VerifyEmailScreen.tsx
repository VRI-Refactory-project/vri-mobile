// Interpreter registration, after the certificates: confirm the 6-digit code sent to the email address.
import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../services/api";
import { confirmEmailCode, needsEmailVerification, resendEmailCode } from "../services/auth";
import { endSession, getCurrentUser } from "../services/session";
import { form, ui } from "../theme/ui";

const RESEND_SECONDS = 30;

export default function VerifyEmailScreen() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const user = getCurrentUser();
  if (!user) return <Redirect href="/login" />;
  if (!needsEmailVerification(user)) {
    return <Redirect href={user.role === "interpreter" ? "/interpreter-dashboard" : "/home"} />;
  }

  const announce = (message: string) => {
    setError(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handleConfirm = async () => {
    if (submitting) return;
    if (!/^\d{6}$/.test(code.trim())) {
      announce("Enter the 6-digit code from the email.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await confirmEmailCode(code);
      // Interpreters now wait for the admin review (or go straight in if already approved).
      router.replace(user.role === "interpreter" ? "/interpreter-dashboard" : "/home");
    } catch (e) {
      setSubmitting(false);
      if (e instanceof ApiError && e.status === 401) {
        await endSession();
        router.replace("/login");
        return;
      }
      announce(e instanceof ApiError ? (e.fieldErrors.code ?? e.message) : "Something went wrong. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      await resendEmailCode();
      setNotice("We sent a new code. Check your inbox and spam folder.");
      setCooldown(RESEND_SECONDS);
    } catch (e) {
      announce(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await endSession();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={form.screen}>
      <KeyboardAvoidingView style={form.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={form.content} keyboardShouldPersistTaps="handled">
          <Text style={form.title} accessibilityRole="header">
            Confirm your email
          </Text>
          <Text style={form.subtitle}>
            We sent a 6-digit code to {user.email}. Enter it below to continue.
          </Text>

          <Text style={form.label}>Verification code</Text>
          <TextInput
            style={[form.input, { letterSpacing: 6, fontSize: 20, textAlign: "center" }, error ? form.inputError : null]}
            value={code}
            onChangeText={(text) => {
              setCode(text.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            editable={!submitting}
            placeholder="000000"
            placeholderTextColor={ui.placeholder}
            accessibilityLabel="Verification code"
          />

          {error ? (
            <Text style={form.formError} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}
          {notice ? <Text style={{ color: ui.success, fontSize: 14, marginTop: 16 }}>{notice}</Text> : null}

          <Pressable
            style={[form.button, submitting ? form.buttonDisabled : null]}
            onPress={handleConfirm}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityState={{ busy: submitting, disabled: submitting }}
          >
            {submitting ? <ActivityIndicator color={ui.white} /> : <Text style={form.buttonText}>Confirm email</Text>}
          </Pressable>

          <Pressable
            style={[form.link, cooldown > 0 || resending ? form.buttonDisabled : null]}
            onPress={handleResend}
            disabled={cooldown > 0 || resending}
            accessibilityRole="button"
          >
            <Text style={form.linkText}>{cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}</Text>
          </Pressable>

          <Pressable style={form.link} onPress={handleSignOut} accessibilityRole="button">
            <Text style={form.linkText}>Sign out</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
