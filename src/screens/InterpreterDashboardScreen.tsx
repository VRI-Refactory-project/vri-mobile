// Interpreter dashboard: status, requests, schedule and sessions.
// Only an approved interpreter with a verified email gets here; everyone else is sent to the right earlier step.
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../services/api";
import { needsEmailVerification } from "../services/auth";
import { getInterpreterProfile, type InterpreterProfile } from "../services/interpreter";
import { endSession, getCurrentUser } from "../services/session";
import { ui } from "../theme/ui";

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

type SectionProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  empty: string;
};

// The API has no requests, schedule or sessions endpoints yet, so each section shows an honest empty state.
// When they exist, replace `empty` with the list for that section.
function Section({ icon, title, empty }: SectionProps) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${title}. ${empty}`}>
      <View style={styles.cardHeader}>
        <Feather name={icon} size={18} color={ui.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardEmpty}>{empty}</Text>
    </View>
  );
}

export default function InterpreterDashboardScreen() {
  const [profile, setProfile] = useState<InterpreterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const user = getCurrentUser();
  const role = user?.role;
  const verified = user ? !needsEmailVerification(user) : false;

  // Bumped by "Try again" and pull-to-refresh to load the profile again.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (role !== "interpreter" || !verified) return;
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
        if (!active) return;
        setLoading(false);
        setRefreshing(false);
      });
    return () => {
      active = false;
    };
  }, [role, verified, reloadKey]);

  const reload = () => {
    setError("");
    setReloadKey((key) => key + 1);
  };

  if (!user) return <Redirect href="/login" />;
  if (user.role !== "interpreter") return <Redirect href="/home" />;
  if (!verified) return <Redirect href="/verify-email" />;
  // Not approved (waiting, rejected or deactivated): the dashboard stays closed.
  if (profile && profile.verification_status !== "APPROVED") return <Redirect href="/pending" />;

  const handleSignOut = async () => {
    await endSession();
    router.replace("/login");
  };

  const firstName = user.full_name.trim().split(/\s+/)[0] ?? "";
  const initial = user.full_name.trim().charAt(0).toUpperCase() || "?";

  if (!profile) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          {loading ? (
            <ActivityIndicator color={ui.primary} accessibilityLabel="Checking your account" />
          ) : (
            <>
              <Text style={styles.error} accessibilityRole="alert">
                {error}
              </Text>
              <Pressable
                style={styles.button}
                onPress={() => {
                  setLoading(true);
                  reload();
                }}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Try again</Text>
              </Pressable>
              <Pressable style={styles.link} onPress={handleSignOut} accessibilityRole="button">
                <Text style={styles.linkText}>Sign out</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              reload();
            }}
            tintColor={ui.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title} accessibilityRole="header">
              {[greeting(), firstName].filter(Boolean).join(" ")}
            </Text>
            <Text style={styles.subtitle}>Here&apos;s what&apos;s happening today!</Text>
          </View>
          <View style={styles.badge} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Text style={styles.badgeText}>{initial}</Text>
          </View>
        </View>

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        {/* Status. The availability on/off switch (V2-021) belongs in this card; for now it only shows the state. */}
        <View style={styles.card} accessible accessibilityRole="summary">
          <View style={styles.statusRow}>
            <View style={[styles.dot, profile.is_available ? styles.dotOn : null]} />
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, profile.is_available ? styles.statusTitleOn : null]}>
                {profile.is_available ? "Available" : "Unavailable"}
              </Text>
              <Text style={styles.cardEmpty}>
                {profile.is_available
                  ? "You are available to receive interpreting requests"
                  : "You will not receive interpreting requests"}
              </Text>
            </View>
          </View>
          <View style={styles.approved}>
            <Feather name="check-circle" size={16} color={ui.success} />
            <Text style={styles.approvedText}>Account approved</Text>
          </View>
        </View>

        <Section icon="inbox" title="Requests" empty="No requests waiting for an interpreter." />
        <Section icon="calendar" title="Schedule" empty="Nothing scheduled yet." />
        <Section icon="video" title="Sessions" empty="No sessions yet." />

        <Pressable style={styles.link} onPress={handleSignOut} accessibilityRole="button">
          <Text style={styles.linkText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ui.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { flex: 1 },
  title: { color: ui.heading, fontSize: 22, fontWeight: "700" },
  subtitle: { color: ui.muted, fontSize: 14, marginTop: 4 },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ui.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: ui.white, fontSize: 18, fontWeight: "700" },
  card: {
    backgroundColor: ui.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ui.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  cardTitle: { color: ui.heading, fontSize: 16, fontWeight: "600" },
  cardEmpty: { color: ui.muted, fontSize: 14, lineHeight: 20 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: ui.placeholder, marginRight: 12 },
  dotOn: { backgroundColor: ui.success },
  statusText: { flex: 1 },
  statusTitle: { color: ui.heading, fontSize: 18, fontWeight: "700", marginBottom: 2 },
  statusTitleOn: { color: ui.success },
  approved: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  approvedText: { color: ui.success, fontSize: 13, fontWeight: "600" },
  error: { color: ui.error, fontSize: 14, textAlign: "center", marginBottom: 12 },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: ui.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 12,
  },
  buttonText: { color: ui.white, fontSize: 16, fontWeight: "600" },
  link: { height: 44, alignItems: "center", justifyContent: "center", marginTop: 12 },
  linkText: { color: ui.primary, fontSize: 15, fontWeight: "600" },
});
