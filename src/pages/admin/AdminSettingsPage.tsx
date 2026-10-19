import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { AdminProfile, loadAdminProfile } from "../../services/adminProfile";

const PURPLE = "#3f327f";

export default function AdminSettingsScreen() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [oneStep, setOneStep] = useState(true);

  // Reload every time this screen comes back into view (e.g. after saving an edit).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAdminProfile().then((data) => {
        if (active) setProfile(data);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  if (!profile) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={PURPLE} />
      </SafeAreaView>
    );
  }

  const initial = profile.full_name.trim().charAt(0).toUpperCase() || "A";

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Settings
        </Text>
        <Text style={styles.subtitle}>
          Manage your administrator profile, notifications and secure access
        </Text>

        {/* Administrator profile */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Administrator profile</Text>
          <Text style={styles.cardHint}>Your account information</Text>

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile.full_name.toUpperCase()}</Text>
              <Text style={styles.role}>Platform administrator</Text>
            </View>
          </View>

          <Text style={styles.email}>{profile.email}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            style={styles.primaryButton}
            onPress={() => router.push("/admin-edit-profile" as never)}
          >
            <Text style={styles.primaryButtonText}>Edit profile</Text>
          </Pressable>
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardHint}>
            Choose which operational updates you receive
          </Text>

          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.switchTitle}>Session alerts</Text>
              <Text style={styles.switchHint}>
                Connection failures and sessions needing attention
              </Text>
            </View>
            <Switch
              accessibilityLabel="Session alerts"
              value={sessionAlerts}
              onValueChange={setSessionAlerts}
              trackColor={{ true: PURPLE }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.switchTitle}>Verification alerts</Text>
              <Text style={styles.switchHint}>
                New interpreter and institution applications
              </Text>
            </View>
            <Switch
              accessibilityLabel="Verification alerts"
              value={verificationAlerts}
              onValueChange={setVerificationAlerts}
              trackColor={{ true: PURPLE }}
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <Text style={styles.cardHint}>Protect your administrator access</Text>

          <Text style={styles.switchTitle}>Password</Text>
          <Text style={styles.switchHint}>
            {profile.password_changed_days_ago === 0
              ? "Changed today"
              : `Last changed ${profile.password_changed_days_ago} days ago`}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change password"
            style={[styles.primaryButton, styles.gapTop]}
            onPress={() => router.push("/admin-edit-profile" as never)}
          >
            <Text style={styles.primaryButtonText}>Change password</Text>
          </Pressable>

          <View style={[styles.switchRow, styles.gapTop]}>
            <View style={styles.switchText}>
              <Text style={styles.switchTitle}>One-step verification</Text>
              <Text style={styles.switchHint}>Enabled for this account</Text>
            </View>
            <Switch
              accessibilityLabel="One-step verification"
              value={oneStep}
              onValueChange={setOneStep}
              trackColor={{ true: PURPLE }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F2FB" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  title: { fontSize: 28, fontWeight: "700", color: "#1b1740" },
  subtitle: { fontSize: 14, color: "#6b6890", marginBottom: 4 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E5F5",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#1b1740" },
  cardHint: { fontSize: 13, color: "#6b6890", marginTop: 2, marginBottom: 12 },

  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E4DEFA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 30, fontWeight: "700", color: PURPLE },
  profileInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: "800", color: "#1b1740" },
  role: { fontSize: 14, color: "#6b6890", marginTop: 4 },
  email: { fontSize: 14, color: "#4a4770", marginTop: 14, marginBottom: 14 },

  primaryButton: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  gapTop: { marginTop: 14 },

  switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchText: { flex: 1 },
  switchTitle: { fontSize: 15, fontWeight: "600", color: "#1b1740" },
  switchHint: { fontSize: 13, color: "#6b6890", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#ECE9F7", marginVertical: 12 },
});
