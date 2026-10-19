import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ApiError, getJson } from "../../services/api";

type VerificationStatus = "INACTIVE" | "APPROVED" | "REJECTED" | "DEACTIVATED";

interface InterpreterProfile {
  id: number;
  full_name: string;
  email: string;
  verification_status: VerificationStatus;
  is_available: boolean;
  specialisation: string;
  specialisation_other: string;
  sign_languages: string[];
  working_hours_schedule: Record<string, unknown>;
}

type NotificationPreferences = {
  sessionNotifications: boolean;
  staffNotifications: boolean;
  systemNotifications: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationPreferences = {
  sessionNotifications: true,
  staffNotifications: true,
  systemNotifications: false,
};

const PURPLE = "#49369B";
const DARK_PURPLE = "#38277F";
const BACKGROUND = "#F6F4FC";
const BORDER = "#E8E3F4";
const TEXT = "#24213A";
const MUTED = "#89849F";

const LANGUAGES = [
  "English (United Kingdom)",
  "English (United States)",
  "Ugandan Sign Language",
];

const TIME_ZONES = ["East Africa Time (GMT+3)", "UTC"];

function getStatusLabel(status?: VerificationStatus) {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "DEACTIVATED":
      return "Deactivated";
    case "INACTIVE":
      return "Pending review";
    default:
      return "Unavailable";
  }
}

function getStatusColor(status?: VerificationStatus) {
  if (status === "APPROVED") {
    return { backgroundColor: "#DDF6E8", color: "#208653" };
  }

  if (status === "REJECTED" || status === "DEACTIVATED") {
    return { backgroundColor: "#FCE7EB", color: "#B42345" };
  }

  return { backgroundColor: "#FFF2D7", color: "#946200" };
}

function getProfileErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Unable to load your profile. Please try again.";
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function SettingCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function ActionButton({
  label,
  onPress,
  danger = false,
  outlined = false,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  outlined?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.actionButton,
        outlined && styles.outlinedButton,
        danger && !outlined && styles.dangerButton,
        danger && outlined && styles.outlinedDangerButton,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          outlined && styles.outlinedButtonText,
          danger && styles.dangerButtonText,
          danger && outlined && styles.outlinedDangerButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function NotificationRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.notificationRow}>
      <View style={styles.notificationText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#D9D5E6", true: PURPLE }}
        thumbColor="#FFFFFF"
        accessibilityLabel={title}
      />
    </View>
  );
}

function PreferenceRow({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const currentIndex = options.indexOf(value);

  function cycleOption() {
    const nextIndex =
      currentIndex < 0 ? 0 : (currentIndex + 1) % options.length;

    onChange(options[nextIndex]);
  }

  return (
    <View style={styles.preferenceField}>
      <Text style={styles.fieldLabel}>{title}</Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${value}. Tap to change.`}
        onPress={cycleOption}
        style={styles.selectButton}
      >
        <Text style={styles.selectText}>{value}</Text>
        <Feather name="chevron-down" size={17} color={MUTED} />
      </TouchableOpacity>
    </View>
  );
}

export default function InterpreterSettingsScreen() {
  const [profile, setProfile] = useState<InterpreterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    INITIAL_NOTIFICATIONS,
  );

  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [timeZone, setTimeZone] = useState(TIME_ZONES[0]);

  useEffect(() => {
    let isActive = true;

    getJson<InterpreterProfile>("/interpreters/me/")
      .then((data) => {
        if (isActive) {
          setProfile(data);
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          Alert.alert(
            "Could not load settings",
            getProfileErrorMessage(error),
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function loadProfile(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const data = await getJson<InterpreterProfile>("/interpreters/me/");
      setProfile(data);
    } catch (error: unknown) {
      Alert.alert(
        "Could not load settings",
        getProfileErrorMessage(error),
      );
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }

  function updateNotification(
    key: keyof NotificationPreferences,
    value: boolean,
  ) {
    setNotifications((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleSaveChanges() {
    Alert.alert(
      "Preferences not saved",
      "The notification and language preferences are currently held on this screen only. Backend support must be added before they can be saved to your account.",
    );
  }

  function handleChangePassword() {
    Alert.alert(
      "Change password",
      "Connect this action to your existing password-change screen or authentication endpoint.",
    );
  }

  function handleReviewSessions() {
    Alert.alert(
      "Active sessions",
      "Session management is not connected yet. This can be implemented separately from Sprint 3 video-call sessions.",
    );
  }

  function handleAccountAction(action: "deactivate" | "delete") {
    const isDelete = action === "delete";

    Alert.alert(
      isDelete ? "Delete account" : "Deactivate account",
      isDelete
        ? "Permanent account deletion is not connected yet. No account data has been deleted."
        : "Account deactivation is not connected yet. Your account has not been changed.",
      [{ text: "OK" }],
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />
        <ActivityIndicator size="large" color={PURPLE} />
        <Text style={styles.loadingText}>Loading your settings...</Text>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(profile?.verification_status);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Settings</Text>
            <Text style={styles.pageSubtitle}>
              Manage your account and preferences.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Refresh settings"
            onPress={() => void loadProfile(true)}
            disabled={refreshing}
            style={styles.refreshButton}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={PURPLE} />
            ) : (
              <Feather name="refresh-cw" size={18} color={PURPLE} />
            )}
          </TouchableOpacity>
        </View>

        <SectionHeading
          title="Account"
          subtitle="Your SignConnect interpreter account"
        />

        <SettingCard>
          <Text style={styles.fieldLabel}>Email address</Text>
          <Text style={styles.emailText}>
            {profile?.email || "Email unavailable"}
          </Text>

          <View style={styles.accountAction}>
            <ActionButton
              label="Change password"
              onPress={handleChangePassword}
              outlined
            />
          </View>

          <Divider />

          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.fieldLabel}>Account role</Text>
              <Text style={styles.rowTitle}>Interpreter</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.fieldLabel}>Verification status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyle.backgroundColor },
              ]}
            >
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {getStatusLabel(profile?.verification_status)}
              </Text>
            </View>
          </View>
        </SettingCard>

        <SectionHeading
          title="Notifications"
          subtitle="Choose which notifications you want to receive"
        />

        <SettingCard>
          <NotificationRow
            title="Session notifications"
            description="Updates about important interpreting sessions."
            value={notifications.sessionNotifications}
            onChange={(value) =>
              updateNotification("sessionNotifications", value)
            }
          />

          <Divider />

          <NotificationRow
            title="Staff account notifications"
            description="Updates about account or verification changes."
            value={notifications.staffNotifications}
            onChange={(value) =>
              updateNotification("staffNotifications", value)
            }
          />

          <Divider />

          <NotificationRow
            title="System notifications"
            description="Important SignConnect system updates."
            value={notifications.systemNotifications}
            onChange={(value) =>
              updateNotification("systemNotifications", value)
            }
          />
        </SettingCard>

        <SectionHeading
          title="Security"
          subtitle="Keep your interpreter account secure"
        />

        <SettingCard>
          <View style={styles.securityRow}>
            <View style={styles.securityIcon}>
              <Feather name="lock" size={19} color={PURPLE} />
            </View>

            <View style={styles.securityText}>
              <Text style={styles.rowTitle}>Password</Text>
              <Text style={styles.rowDescription}>
                Manage your account password.
              </Text>
            </View>

            <ActionButton
              label="Change"
              onPress={handleChangePassword}
              outlined
            />
          </View>

          <Divider />

          <View style={styles.securityRow}>
            <View style={styles.securityIcon}>
              <Feather name="monitor" size={19} color={PURPLE} />
            </View>

            <View style={styles.securityText}>
              <Text style={styles.rowTitle}>Active sessions</Text>
              <Text style={styles.rowDescription}>
                Review signed-in devices.
              </Text>
            </View>

            <ActionButton
              label="Review"
              onPress={handleReviewSessions}
              outlined
            />
          </View>
        </SettingCard>

        <SectionHeading
          title="Preferences"
          subtitle="Personalise your account"
        />

        <SettingCard>
          <PreferenceRow
            title="Language"
            value={language}
            options={LANGUAGES}
            onChange={setLanguage}
          />

          <PreferenceRow
            title="Time zone"
            value={timeZone}
            options={TIME_ZONES}
            onChange={setTimeZone}
          />
        </SettingCard>

        <View style={styles.saveNotice}>
          <Feather name="info" size={17} color={PURPLE} />
          <Text style={styles.saveNoticeText}>
            Save your changes when preference storage is connected.
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSaveChanges}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>

        <View style={styles.dangerHeading}>
          <Text style={styles.dangerTitle}>Danger zone</Text>
          <Text style={styles.sectionSubtitle}>
            These account actions require confirmation.
          </Text>
        </View>

        <View style={styles.dangerCard}>
          <Text style={styles.dangerActionTitle}>
            Deactivate interpreter account
          </Text>
          <Text style={styles.dangerDescription}>
            Temporarily stop using your account. This action is not connected
            yet.
          </Text>

          <ActionButton
            label="Deactivate account"
            danger
            outlined
            onPress={() => handleAccountAction("deactivate")}
          />

          <Divider />

          <Text style={styles.dangerActionTitle}>Delete account</Text>
          <Text style={styles.dangerDescription}>
            Permanently deleting an account needs a dedicated backend workflow.
            Nothing will be deleted by this screen.
          </Text>

          <ActionButton
            label="Delete account"
            danger
            onPress={() => handleAccountAction("delete")}
          />
        </View>

        <Text style={styles.footerText}>SignConnect</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: MUTED,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pageTitle: {
    color: TEXT,
    fontSize: 27,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },
  refreshButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  sectionHeading: {
    gap: 3,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },
  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: MUTED,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  fieldLabel: {
    fontSize: 11,
    color: MUTED,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT,
  },
  accountAction: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0EDF7",
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoBlock: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
  },
  statusRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  notificationRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notificationText: {
    flex: 1,
    gap: 3,
  },
  rowDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: MUTED,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 52,
  },
  securityIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F0ECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  securityText: {
    flex: 1,
    gap: 3,
  },
  actionButton: {
    minHeight: 34,
    paddingHorizontal: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PURPLE,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    backgroundColor: "#FFFFFF",
  },
  outlinedButtonText: {
    color: PURPLE,
  },
  preferenceField: {
    gap: 6,
    marginBottom: 12,
  },
  selectButton: {
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 12,
    color: TEXT,
  },
  saveNotice: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#EDE8FC",
    borderRadius: 12,
    padding: 12,
  },
  saveNoticeText: {
    flex: 1,
    color: PURPLE,
    fontSize: 11,
    lineHeight: 16,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DARK_PURPLE,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  dangerHeading: {
    marginTop: 8,
    gap: 3,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#C62E4B",
  },
  dangerCard: {
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#F2D1D9",
    backgroundColor: "#FFF7F8",
    gap: 9,
  },
  dangerActionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: TEXT,
  },
  dangerDescription: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
  },
  dangerButton: {
    backgroundColor: "#AD2446",
  },
  dangerButtonText: {
    color: "#FFFFFF",
  },
  outlinedDangerButton: {
    borderColor: "#D84A62",
    backgroundColor: "#FFFFFF",
  },
  outlinedDangerButtonText: {
    color: "#C62E4B",
  },
  footerText: {
    textAlign: "center",
    color: MUTED,
    fontSize: 11,
    marginTop: 12,
  },
});
