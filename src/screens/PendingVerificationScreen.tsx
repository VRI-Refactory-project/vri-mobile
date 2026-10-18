// V2-003 step 3: shows where the interpreter's certification review stands.
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../services/api";
import { getInterpreterProfile, type InterpreterProfile } from "../services/interpreter";
import { needsEmailVerification } from "../services/auth";
import { endSession, getCurrentUser } from "../services/session";

export default function PendingVerificationScreen() {
  const [profile, setProfile] = useState<InterpreterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getCurrentUser();

  // Bumped by "Check status" / "Try again" to load the profile again.
  const [reloadKey, setReloadKey] = useState(0);

  const role = user?.role;
  useEffect(() => {
    if (role !== "interpreter") return;
    let active = true;
    getInterpreterProfile()
      .then((result) => {
        if (!active) return;
        setProfile(result);
        setError("");
      })
      .catch(async (e: unknown) => {
        if (!active) return;
        if (e instanceof ApiError && e.status === 401) {
          await endSession();
          router.replace("/login");
          return;
        }
        setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [role, reloadKey]);

  const load = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  if (!user) return <Redirect href="/login" />;
  if (user.role !== "interpreter") return <Redirect href="/home" />;
  if (needsEmailVerification(user)) return <Redirect href="/verify-email" />;

  const handleSignOut = async () => {
    await endSession();
    router.replace("/login");
  };

  const status = profile?.verification_status;
  const certifications = profile?.certifications ?? [];
  const latestReason = certifications.find((c) => c.rejection_reason)?.rejection_reason ?? "";

  let icon: React.ComponentProps<typeof Feather>["name"] = "clock";
  let heading = "Your certification is under review";
  let body =
    "An administrator is checking your documents. Your account stays inactive and you won't receive requests until a decision is made.";
  if (status === "APPROVED") {
    icon = "check-circle";
    heading = "You're approved";
    body = "Your certification was approved and your account is active.";
  } else if (status === "REJECTED") {
    icon = "alert-circle";
    heading = "Your certification was not approved";
    body = latestReason ? `Reason: ${latestReason}` : "Please upload a clear copy of a valid certificate.";
  } else if (status === "INACTIVE" && certifications.length === 0) {
    icon = "upload";
    heading = "Upload your certification";
    body = "Your account is inactive until you submit a certificate for review.";
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading && !profile ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : error && !profile ? (
          <View style={styles.card}>
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
            <Pressable style={styles.button} onPress={load} accessibilityRole="button">
              <Text style={styles.buttonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Feather name={icon} size={40} color={colors.primary} />
              <Text style={styles.title} accessibilityRole="header">
                {heading}
              </Text>
              <Text style={styles.body}>{body}</Text>
            </View>

            {certifications.length > 0 ? (
              <View style={styles.list}>
                <Text style={styles.listTitle}>Submitted documents</Text>
                {certifications.map((c) => (
                  <View key={c.id} style={styles.row}>
                    <Feather name="file-text" size={18} color={colors.muted} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowName} numberOfLines={1}>
                        {c.certificate_type || c.document_name}
                      </Text>
                      <Text style={styles.rowMeta} numberOfLines={1}>
                        {c.issuing_organisation} · {new Date(c.uploaded_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            {status === "APPROVED" ? (
              <Pressable style={styles.button} onPress={() => router.replace("/interpreter-dashboard")} accessibilityRole="button">
                <Text style={styles.buttonText}>Go to dashboard</Text>
              </Pressable>
            ) : (
              <>
                {status === "REJECTED" || certifications.length === 0 ? (
                  <Pressable style={styles.button} onPress={() => router.push("/certifications")} accessibilityRole="button">
                    <Text style={styles.buttonText}>Upload a certificate</Text>
                  </Pressable>
                ) : null}
                <Pressable style={styles.secondary} onPress={load} disabled={loading} accessibilityRole="button">
                  <Text style={styles.secondaryText}>{loading ? "Checking…" : "Check status"}</Text>
                </Pressable>
              </>
            )}
          </>
        )}

        <Pressable style={styles.signOut} onPress={handleSignOut} accessibilityRole="button">
          <Text style={styles.secondaryText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = {
  primary: "#4A3A9A",
  heading: "#1B1530",
  muted: "#6B6785",
  border: "#E9E7F2",
  error: "#B52D43",
  white: "#FFFFFF",
  background: "#F5F4FB",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 40 },
  step: { color: colors.primary, fontSize: 13, fontWeight: "600", marginBottom: 16 },
  loader: { marginTop: 48 },
  card: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
  },
  title: { color: colors.heading, fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 14 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 8 },
  error: { color: colors.error, fontSize: 14, textAlign: "center", marginBottom: 16 },
  list: { marginTop: 24 },
  listTitle: { color: colors.heading, fontSize: 14, fontWeight: "600", marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  rowText: { flex: 1, marginLeft: 10 },
  rowName: { color: colors.heading, fontSize: 14, fontWeight: "500" },
  rowMeta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    alignSelf: "stretch",
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  secondary: { height: 44, alignItems: "center", justifyContent: "center", marginTop: 8 },
  secondaryText: { color: colors.primary, fontSize: 15, fontWeight: "600" },
  signOut: { height: 44, alignItems: "center", justifyContent: "center", marginTop: 24 },
});
