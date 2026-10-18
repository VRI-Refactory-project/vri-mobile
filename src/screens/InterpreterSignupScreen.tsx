// Interpreter registration, step 2: create the account. Next come the certificates, then email verification.
import React, { useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../services/api";
import { registerInterpreter, type Specialisation } from "../services/interpreter";
import { form, ui } from "../theme/ui";

type Field = "full_name" | "phone_number" | "email" | "password";
type Errors = Partial<Record<Field, string>>;

const SPECIALISATIONS: { value: Specialisation; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "MEDICAL", label: "Medical" },
  { value: "LEGAL", label: "Legal" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (values.full_name.trim().split(/\s+/).filter(Boolean).length < 2) {
    errors.full_name = "Enter your first and last name.";
  }
  const digits = values.phone_number.replace(/\D/g, "");
  if (!values.phone_number.trim()) errors.phone_number = "Enter your phone number.";
  else if (digits.length < 9 || digits.length > 15) errors.phone_number = "Enter a valid phone number, e.g. 0772 123 456.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter a password.";
  else if (values.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

export default function InterpreterSignupScreen() {
  const [values, setValues] = useState<Record<Field, string>>({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [specialisation, setSpecialisation] = useState<Specialisation>("GENERAL");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const set = (field: Field) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const announce = (message: string) => {
    setFormError(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError("");
    const firstError = nextErrors.full_name ?? nextErrors.phone_number ?? nextErrors.email ?? nextErrors.password;
    if (firstError) {
      AccessibilityInfo.announceForAccessibility(firstError);
      return;
    }

    setSubmitting(true);
    try {
      await registerInterpreter({
        full_name: values.full_name.trim(),
        phone_number: values.phone_number.trim(),
        email: values.email.trim(),
        password: values.password,
        specialisation,
      });
      router.replace("/certifications");
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ApiError) {
        const { full_name, phone_number, email, password } = error.fieldErrors;
        if (full_name || phone_number || email || password) {
          setErrors({ full_name, phone_number, email, password });
        } else {
          announce(error.message);
        }
      } else {
        announce("Something went wrong. Please try again.");
      }
    }
  };

  const fieldError = (message?: string) =>
    message ? (
      <Text style={form.fieldError} accessibilityLiveRegion="polite">
        {message}
      </Text>
    ) : null;

  return (
    <SafeAreaView style={form.screen}>
      <KeyboardAvoidingView style={form.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={form.content} keyboardShouldPersistTaps="handled">
          <Text style={form.step}>Step 2 of 3</Text>
          <Text style={form.title} accessibilityRole="header">
            Create your account
          </Text>
          <Text style={form.subtitle}>
            Next you will upload your certificates, then confirm your email. An administrator reviews your account
            before you can receive requests.
          </Text>

          <Text style={form.label}>Full name</Text>
          <TextInput
            style={[form.input, errors.full_name ? form.inputError : null]}
            value={values.full_name}
            onChangeText={set("full_name")}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            editable={!submitting}
            maxLength={150}
            accessibilityLabel="Full name"
          />
          {fieldError(errors.full_name)}

          <Text style={form.label}>Phone number</Text>
          <TextInput
            ref={phoneRef}
            style={[form.input, errors.phone_number ? form.inputError : null]}
            value={values.phone_number}
            onChangeText={set("phone_number")}
            placeholder="0772 123 456 or +256 772 123 456"
            placeholderTextColor={ui.placeholder}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            editable={!submitting}
            maxLength={20}
            accessibilityLabel="Phone number"
          />
          {fieldError(errors.phone_number)}

          <Text style={form.label}>Email</Text>
          <TextInput
            ref={emailRef}
            style={[form.input, errors.email ? form.inputError : null]}
            value={values.email}
            onChangeText={set("email")}
            placeholder="name@example.com"
            placeholderTextColor={ui.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!submitting}
            accessibilityLabel="Email"
          />
          {fieldError(errors.email)}

          <Text style={form.label}>Password</Text>
          <View>
            <TextInput
              ref={passwordRef}
              style={[form.input, styles.passwordInput, errors.password ? form.inputError : null]}
              value={values.password}
              onChangeText={set("password")}
              placeholder="At least 8 characters"
              placeholderTextColor={ui.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!submitting}
              accessibilityLabel="Password"
            />
            <Pressable
              style={styles.eye}
              onPress={() => setShowPassword((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              hitSlop={8}
            >
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={ui.muted} />
            </Pressable>
          </View>
          {fieldError(errors.password)}

          <Text style={form.label}>Area of interpreting</Text>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {SPECIALISATIONS.map((option) => {
              const selected = option.value === specialisation;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.chip, selected ? styles.chipSelected : null]}
                  onPress={() => setSpecialisation(option.value)}
                  disabled={submitting}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {formError ? (
            <Text style={form.formError} accessibilityRole="alert">
              {formError}
            </Text>
          ) : null}

          <Pressable
            style={[form.button, submitting ? form.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityState={{ busy: submitting, disabled: submitting }}
          >
            {submitting ? <ActivityIndicator color={ui.white} /> : <Text style={form.buttonText}>Continue</Text>}
          </Pressable>

          <Pressable style={form.link} onPress={() => router.replace("/login")} accessibilityRole="button">
            <Text style={form.linkText}>I already have an account</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passwordInput: { paddingRight: 48 },
  eye: { position: "absolute", right: 14, top: 14 },
  chips: { flexDirection: "row", gap: 8 },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ui.border,
    backgroundColor: ui.white,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: { borderColor: ui.primary, backgroundColor: ui.primary },
  chipText: { color: ui.heading, fontSize: 14, fontWeight: "600" },
  chipTextSelected: { color: ui.white },
});
