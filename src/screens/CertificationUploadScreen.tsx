// V2-003 step 2: the interpreter uploads a certification document before an admin reviews the account.
import React, { useState } from "react";
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
import * as DocumentPicker from "expo-document-picker";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../services/api";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
  uploadCertification,
  type PickedFile,
} from "../services/interpreter";
import { getCurrentUser } from "../services/session";

type Errors = { document?: string; certificate_type?: string; issuing_organisation?: string };

function formatSize(bytes?: number) {
  if (bytes === undefined) return "";
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function validate(file: PickedFile | null, type: string, organisation: string): Errors {
  const errors: Errors = {};
  if (!file) {
    errors.document = "Choose your certificate (PDF, JPG or PNG).";
  } else {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const typeOk = !file.mimeType || ALLOWED_MIME_TYPES.includes(file.mimeType);
    if (!ALLOWED_EXTENSIONS.includes(extension) || !typeOk) {
      errors.document = "Only PDF, JPG or PNG files are accepted.";
    } else if (file.size !== undefined && file.size > MAX_FILE_BYTES) {
      errors.document = `That file is ${formatSize(file.size)}. The limit is ${formatSize(MAX_FILE_BYTES)}.`;
    }
  }
  if (!type.trim()) errors.certificate_type = "Enter the type of certificate, e.g. Sign Language Interpreter.";
  if (!organisation.trim()) errors.issuing_organisation = "Enter the organisation that issued it.";
  return errors;
}

export default function CertificationUploadScreen() {
  const [file, setFile] = useState<PickedFile | null>(null);
  const [certificateType, setCertificateType] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const user = getCurrentUser();
  if (!user) return <Redirect href="/login" />;
  if (user.role !== "interpreter") return <Redirect href="/home" />;

  const announce = (message: string) => {
    setFormError(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ALLOWED_MIME_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType, size: asset.size, file: asset.file });
    setErrors((current) => ({ ...current, document: undefined }));
    setFormError("");
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const nextErrors = validate(file, certificateType, organisation);
    setErrors(nextErrors);
    setFormError("");
    const firstError = nextErrors.document ?? nextErrors.certificate_type ?? nextErrors.issuing_organisation;
    if (firstError || !file) {
      AccessibilityInfo.announceForAccessibility(firstError ?? "");
      return;
    }

    setSubmitting(true);
    try {
      await uploadCertification(file, certificateType, organisation);
      router.replace("/pending");
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ApiError) {
        if (error.status === 401) {
          router.replace("/login");
          return;
        }
        const { document, certificate_type, issuing_organisation } = error.fieldErrors;
        if (document || certificate_type || issuing_organisation) {
          setErrors({ document, certificate_type, issuing_organisation });
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
      <Text style={styles.fieldError} accessibilityLiveRegion="polite">
        {message}
      </Text>
    ) : null;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.step}>Step 2 of 3</Text>
          <Text style={styles.title} accessibilityRole="header">
            Upload your certification
          </Text>
          <Text style={styles.subtitle}>
            An administrator reviews your certificate before your account is activated. You will not receive requests
            until it is approved.
          </Text>

          <Text style={styles.label}>Certificate file</Text>
          <Pressable
            style={[styles.picker, errors.document ? styles.inputError : null]}
            onPress={handlePick}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel={file ? "Change selected certificate file" : "Choose certificate file"}
          >
            <Feather name={file ? "file-text" : "upload"} size={22} color={colors.primary} />
            <View style={styles.pickerText}>
              <Text style={styles.pickerTitle} numberOfLines={1}>
                {file ? file.name : "Choose a PDF, JPG or PNG"}
              </Text>
              <Text style={styles.pickerHint}>
                {file ? [formatSize(file.size), "tap to change"].filter(Boolean).join(" · ") : "Up to 10 MB"}
              </Text>
            </View>
          </Pressable>
          {fieldError(errors.document)}

          <Text style={styles.label}>Type of certificate</Text>
          <TextInput
            style={[styles.input, errors.certificate_type ? styles.inputError : null]}
            value={certificateType}
            onChangeText={setCertificateType}
            placeholder="e.g. Sign Language Interpreter"
            placeholderTextColor={colors.placeholder}
            editable={!submitting}
            maxLength={100}
            accessibilityLabel="Type of certificate"
          />
          {fieldError(errors.certificate_type)}

          <Text style={styles.label}>Issuing organisation</Text>
          <TextInput
            style={[styles.input, errors.issuing_organisation ? styles.inputError : null]}
            value={organisation}
            onChangeText={setOrganisation}
            placeholder="e.g. UNAD"
            placeholderTextColor={colors.placeholder}
            editable={!submitting}
            maxLength={255}
            accessibilityLabel="Issuing organisation"
          />
          {fieldError(errors.issuing_organisation)}

          {formError ? (
            <Text style={styles.formError} accessibilityRole="alert">
              {formError}
            </Text>
          ) : null}

          <Pressable
            style={[styles.button, submitting ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityState={{ busy: submitting, disabled: submitting }}
          >
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Submit for review</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const colors = {
  primary: "#4A3A9A",
  heading: "#1B1530",
  muted: "#6B6785",
  placeholder: "#9A96B0",
  border: "#E9E7F2",
  error: "#B52D43",
  errorBackground: "#FDECEF",
  white: "#FFFFFF",
  background: "#F5F4FB",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  step: { color: colors.primary, fontSize: 13, fontWeight: "600", marginBottom: 6 },
  title: { color: colors.heading, fontSize: 24, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 12 },
  label: { color: colors.heading, fontSize: 14, fontWeight: "600", marginTop: 16, marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.heading,
    fontSize: 15,
  },
  inputError: { borderColor: colors.error, backgroundColor: colors.errorBackground },
  picker: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
  },
  pickerText: { flex: 1, marginLeft: 12 },
  pickerTitle: { color: colors.heading, fontSize: 15, fontWeight: "500" },
  pickerHint: { color: colors.muted, fontSize: 12, marginTop: 2 },
  fieldError: { color: colors.error, fontSize: 12, marginTop: 6 },
  formError: { color: colors.error, fontSize: 14, marginTop: 16 },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
