import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const logoIcon = require("../../assets/images/no_word.png");
const backgroundImage = require("../../assets/images/interpreter2.png");

// ---- Easy knobs to tune ----
const LOGO_ICON_SIZE = 110; // same size as on the landing page
const BACKGROUND_ZOOM = 1; // 1 = no zoom; bigger = the background photo is zoomed in more

// Where each role goes after it is picked.
// The interpreter registration screen is not built yet, so it is "null" for now.
// When it exists, put its route here, for example "/interpreter-signup".
const ROLE_ROUTES: Record<"deaf" | "interpreter", string | null> = {
  deaf: "/signup",
  interpreter: "/interpreter-signup", 
};

const ROLES = [
  {
    key: "deaf" as const,
    title: "Deaf or Hard of Hearing",
    subtitle: "Get an interpreter on video whenever you need one.",
    image: require("../../assets/images/deaf_user.png"),
    // Tune the photo position for this card (see the knobs above).
    zoomX: 1.15, // >1 crops the grey strip off the right edge
    zoomY: 1.4, // >1 gives room to move the photo up
    shiftUp: 0.2, // fraction of the card height; bigger = face moves higher
  },
  {
    key: "interpreter" as const,
    title: "Interpreter",
    subtitle:
      "Provide professional sign-language interpretation and connect with people who need you.",
    image: require("../../assets/images/interpreter3.png"),
    zoomX: 1, // smaller number = the photo is zoomed out
    zoomY: 1.15,
    shiftUp: 0, // 0 keeps the top of the photo (the head) in view
  },
];

export default function RoleSelectionPage() {
  const { height } = useWindowDimensions();
  // Cards scale with the phone so both fit on the screen.
  const cardHeight = Math.max(200, Math.min(300, height * 0.28));

  // Go back if there is a screen to go back to, otherwise go to the landing page.
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/landing");
    }
  };

  const handleSelectRole = (role: "deaf" | "interpreter") => {
    const route = ROLE_ROUTES[role];
    if (route) {
      router.push(route as never);
    } else {
      Alert.alert(
        "Coming soon",
        "Interpreter registration is still being built. Please check back soon.",
      );
    }
  };

  return (
    <View style={styles.page}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Photo background with a purple tint so the text stays readable */}
      <ImageBackground
        source={backgroundImage}
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ scale: BACKGROUND_ZOOM }], opacity: 0.6 },
        ]}
        resizeMode="cover"
      />
      {/* <LinearGradient
        colors={[
          "rgba(45,16,96,0.88)",
          "rgba(59,26,133,0.78)",
          "rgba(76,39,166,0.7)",
          "rgba(106,63,216,0.62)",
        ]}
        locations={[0, 0.38, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      /> */}

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header: small logo on the left, Back on the right */}
          <View style={styles.header}>
            <Image
              source={logoIcon}
              style={{ width: LOGO_ICON_SIZE, height: LOGO_ICON_SIZE }}
              resizeMode="contain"
              accessible
              accessibilityRole="image"
              accessibilityLabel="SignConnect"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={8}
            >
              <Feather name="chevron-left" size={18} color="#FFFFFF" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          <Text style={styles.title} accessibilityRole="header">
            {"Who's joining\nSignConnect?"}
          </Text>
          <Text style={styles.subtitle}>
            Pick the one that fits you best. You can add another one later.
          </Text>

          {ROLES.map((role) => (
            <Pressable
              key={role.key}
              accessibilityRole="button"
              onPress={() => handleSelectRole(role.key)}
              style={({ pressed }) => [
                styles.card,
                { height: cardHeight },
                pressed && styles.cardPressed,
              ]}
            >
              <Image
                source={role.image}
                style={{
                  position: "absolute",
                  left: 0,
                  top: -cardHeight * role.shiftUp,
                  width: `${role.zoomX * 100}%`,
                  height: cardHeight * role.zoomY,
                }}
                resizeMode="cover"
              />
              {/* Dark fade at the bottom so the text is easy to read */}
              <LinearGradient
                colors={["rgba(20,5,60,0)", "rgba(20,5,60,0.9)"]}
                locations={[0.35, 1]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.cardText}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <View style={styles.cardArrow}>
                    <Feather name="arrow-right" size={18} color="#4a21c4" />
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const SERIF = Platform.select({ ios: "Georgia", default: "serif" });

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#3b1a85" },
  safe: { flex: 1 },
  glow: { position: "absolute", left: 0, right: 0, bottom: 0, height: 260 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40, gap: 18 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 40,
    paddingLeft: 10,
    paddingRight: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  backText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  title: {
    color: "#fff",
    fontFamily: SERIF,
    fontWeight: "700",
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: { color: "#f1edff", fontSize: 16, lineHeight: 23 },

  card: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.45)",
    justifyContent: "flex-end",
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  cardText: { padding: 18, gap: 6 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: { flex: 1, color: "#fff", fontSize: 22, fontWeight: "700" },
  cardArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardSubtitle: { color: "#f1edff", fontSize: 14, lineHeight: 20 },
});
