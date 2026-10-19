// Interpreter registration, step 2: create the account (same fields and rules as the web sign-up).
// Next come the certificates, then email verification, then the admin review.
import React, { useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PhoneField } from "../components/PhoneField";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from "../lib/validation";
import { ApiError } from "../services/api";
import {
  registerInterpreter,
  type Specialisation,
} from "../services/interpreter";
import { form, ui } from "../theme/ui";

type FieldName =
  "firstname" | "lastname" | "phone" | "email" | "password" | "terms";
type Errors = Partial<Record<FieldName, string>>;
type InputName = "firstname" | "lastname" | "email" | "password";

const SPECIALISATIONS: { value: Specialisation; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "MEDICAL", label: "Medical" },
  { value: "LEGAL", label: "Legal" },
];

const FIELD_ORDER: FieldName[] = [
  "firstname",
  "lastname",
  "phone",
  "email",
  "password",
  "terms",
];

type IconInputProps = React.ComponentPropsWithRef<typeof TextInput> & {
  icon: React.ComponentProps<typeof Feather>["name"];
  hasError: boolean;
  right?: React.ReactNode;
};

// A text input with an icon on the left (and an optional control on the right), like the web form.
function IconInput({ icon, hasError, right, ...inputProps }: IconInputProps) {
  return (
    <View>
      <Feather name={icon} size={16} color={ui.muted} style={styles.icon} />
      <TextInput
        style={[
          form.input,
          styles.withIcon,
          right ? styles.withRight : null,
          hasError ? form.inputError : null,
        ]}
        placeholderTextColor={ui.placeholder}
        {...inputProps}
      />
      {right}
    </View>
  );
}

export default function InterpreterSignupScreen() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [specialisation, setSpecialisation] =
    useState<Specialisation>("GENERAL");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  // Errors from the server for one field; cleared when that field is edited.
  const [serverErrors, setServerErrors] = useState<Errors>({});
  // An error shows once the person has left the field, or tried to submit.
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  // Each text input registers itself here, so a field can be focused from an event handler.
  const inputs = useRef<Partial<Record<InputName, TextInput | null>>>({});
  const focusField = (name: InputName) => inputs.current[name]?.focus();

  const set = (name: keyof typeof values) => (text: string) => {
    setValues((current) => ({ ...current, [name]: text }));
    setServerErrors((current) => ({ ...current, [name]: undefined }));
  };
  const touch = (name: FieldName) => () =>
    setTouched((current) => ({ ...current, [name]: true }));

  // Worked out from the form on every render, so a submit never reads out-of-date results.
  const errors: Errors = {
    firstname: validateName(values.firstname, "your first name"),
    lastname: validateName(values.lastname, "your last name"),
    phone: validatePhoneNumber(values.phone),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    terms: agreed
      ? undefined
      : "Accept the Terms and Privacy Policy to continue.",
  };
  const shown = (name: FieldName) =>
    serverErrors[name] ??
    (touched[name] || submitted ? errors[name] : undefined);

  const announce = (message: string) => {
    setFormError(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitted(true);
    setFormError("");
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      AccessibilityInfo.announceForAccessibility(errors[firstInvalid] ?? "");
      if (firstInvalid !== "phone" && firstInvalid !== "terms")
        focusField(firstInvalid);
      return;
    }

    setSubmitting(true);
    try {
      await registerInterpreter({
        full_name: `${values.firstname.trim()} ${values.lastname.trim()}`,
        phone_number: values.phone,
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
          setServerErrors({
            firstname: full_name,
            phone: phone_number,
            email,
            password,
          });
        } else {
          announce(error.message);
        }
      } else {
        announce("Something went wrong. Please try again.");
      }
    }
  };

  const message = (name: FieldName) =>
    shown(name) ? (
      <Text style={form.fieldError} accessibilityLiveRegion="polite">
        {shown(name)}
      </Text>
    ) : null;

  return (
    <SafeAreaView style={form.screen}>
      <KeyboardAvoidingView
        style={form.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={form.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={form.step}>Step 2 of 3</Text>
          <Text style={form.title} accessibilityRole="header">
            Create your account
          </Text>
          <Text style={form.subtitle}>
            Next you will upload your certificates, then confirm your email. An
            administrator reviews your account before you can receive requests.
          </Text>

          <Text style={form.label}>First name</Text>
          <IconInput
            ref={(node) => {
              inputs.current.firstname = node;
            }}
            icon="user"
            hasError={Boolean(shown("firstname"))}
            value={values.firstname}
            onChangeText={set("firstname")}
            onBlur={touch("firstname")}
            editable={!submitting}
            placeholder="Your first name"
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="next"
            onSubmitEditing={() => focusField("lastname")}
            maxLength={75}
            accessibilityLabel="First name"
          />
          {message("firstname")}

          <Text style={form.label}>Last name</Text>
          <IconInput
            ref={(node) => {
              inputs.current.lastname = node;
            }}
            icon="user"
            hasError={Boolean(shown("lastname"))}
            value={values.lastname}
            onChangeText={set("lastname")}
            onBlur={touch("lastname")}
            editable={!submitting}
            placeholder="Your last name"
            autoComplete="family-name"
            textContentType="familyName"
            returnKeyType="next"
            maxLength={75}
            accessibilityLabel="Last name"
          />
          {message("lastname")}

          <Text style={form.label}>Phone number</Text>
          <PhoneField
            onChange={(phone) => {
              setValues((current) => ({ ...current, phone }));
              setServerErrors((current) => ({ ...current, phone: undefined }));
            }}
            onBlur={touch("phone")}
            invalid={Boolean(shown("phone"))}
            disabled={submitting}
          />
          {message("phone")}

          <Text style={form.label}>Email address</Text>
          <IconInput
            ref={(node) => {
              inputs.current.email = node;
            }}
            icon="mail"
            hasError={Boolean(shown("email"))}
            value={values.email}
            onChangeText={set("email")}
            onBlur={touch("email")}
            editable={!submitting}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => focusField("password")}
            accessibilityLabel="Email address"
          />
          {message("email")}

          <Text style={form.label}>Specialisation</Text>
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
                  <Text
                    style={[
                      styles.chipText,
                      selected ? styles.chipTextSelected : null,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={form.label}>Password</Text>
          <IconInput
            ref={(node) => {
              inputs.current.password = node;
            }}
            icon="lock"
            hasError={Boolean(shown("password"))}
            value={values.password}
            onChangeText={set("password")}
            onBlur={touch("password")}
            editable={!submitting}
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            accessibilityLabel="Password"
            right={
              <Pressable
                style={styles.eye}
                onPress={() => setShowPassword((visible) => !visible)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                hitSlop={8}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={ui.muted}
                />
              </Pressable>
            }
          />
          {message("password")}

          <Pressable
            style={styles.terms}
            onPress={() => {
              setAgreed((value) => !value);
              setTouched((current) => ({ ...current, terms: true }));
            }}
            disabled={submitting}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
          >
            <Feather
              name={agreed ? "check-square" : "square"}
              size={22}
              color={shown("terms") ? ui.error : ui.primary}
            />
            <Text style={styles.termsText}>
              I agree to the Terms and Privacy Policy
            </Text>
          </Pressable>
          {message("terms")}

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
            {submitting ? (
              <ActivityIndicator color={ui.white} />
            ) : (
              <Text style={form.buttonText}>Continue</Text>
            )}
          </Pressable>

          <Pressable
            style={form.link}
            onPress={() => router.replace("/login")}
            accessibilityRole="button"
          >
            <Text style={form.linkText}>I already have an account</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: { position: "absolute", left: 14, top: 16, zIndex: 1 },
  withIcon: { paddingLeft: 38 },
  withRight: { paddingRight: 48 },
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
  terms: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20 },
  termsText: { flex: 1, color: ui.heading, fontSize: 14 },
});
