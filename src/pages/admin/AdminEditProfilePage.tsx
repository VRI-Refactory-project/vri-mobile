import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { loadAdminProfile, saveAdminProfile } from "../../services/adminProfile";

const PURPLE = "#3f327f";

export default function AdminEditProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Fill the form with the current details when the screen opens.
  useEffect(() => {
    let active = true;
    loadAdminProfile().then((data) => {
      if (!active) return;
      setFullName(data.full_name);
      setEmail(data.email);
    });
    return () => {
      active = false;
    };
  }, []);

  // Go back if there is a screen behind this one, otherwise to the settings screen.
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/admin-settings" as never);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Missing name", "Please enter your full name.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (newPassword && !currentPassword) {
      Alert.alert(
        "Current password needed",
        "Enter your current password to set a new one.",
      );
      return;
    }

    try {
      setSaving(true);
      await saveAdminProfile({
        full_name: fullName.trim(),
        email: email.trim(),
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
      });
      goBack();
    } catch {
      Alert.alert("Could not save", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <Text style={styles.title} accessibilityRole="header">
                Edit profile
              </Text>
              <Text style={styles.subtitle}>
                Update your name, contact email, and account password.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={goBack}
              style={styles.backButton}
            >
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal information</Text>

            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              accessibilityLabel="Full name"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              accessibilityLabel="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Change password</Text>
            <Text style={styles.hint}>
              Leave blank to keep your current password.
            </Text>

            <Text style={styles.label}>CURRENT PASSWORD</Text>
            <TextInput
              accessibilityLabel="Current password"
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.label}>NEW PASSWORD</Text>
            <TextInput
              accessibilityLabel="New password"
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              onPress={goBack}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save changes"
              onPress={handleSave}
              disabled={saving}
              style={[styles.saveButton, saving && styles.disabled]}
            >
              <Text style={styles.saveText}>
                {saving ? "Saving..." : "Save changes"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { flex: 1, backgroundColor: "#F4F2FB" },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  title: { fontSize: 28, fontWeight: "700", color: "#1b1740" },
  subtitle: { fontSize: 14, color: "#6b6890", marginTop: 4 },
  backButton: {
    borderWidth: 1,
    borderColor: "#D9D5EE",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: "#1b1740", fontWeight: "600" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E5F5",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1b1740",
    marginBottom: 8,
  },
  hint: { fontSize: 13, color: "#8a87a8", marginBottom: 8 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#6b6890",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F1EFFA",
    borderWidth: 1,
    borderColor: "#E1DDF2",
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1b1740",
  },

  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelButton: {
    backgroundColor: "#ECE8FB",
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { color: PURPLE, fontWeight: "600" },
  saveButton: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { color: "#FFFFFF", fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
