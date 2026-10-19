import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    width: "100%",
    maxWidth: 420, // keeps it phone-shaped in the browser
    alignSelf: "center",
  },

  // Top bar
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  logo: {
    width: 130,
    height: 70,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.white,
    marginRight: 16,
  },
  signUpButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.purpleText,
  },

  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 11,
    color: colors.purpleText,
    marginLeft: 6,
  },

  // Title and description
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.white,
    lineHeight: 22,
    marginBottom: 24,
  },

  // Get Started button
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.purpleText,
    marginRight: 8,
  },

  // Features
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap", // drops to a second line on narrow phones
    marginBottom: 32,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: colors.white,
    marginLeft: 5,
  },

  // Photo card
  mediaCard: {
    width: "100%",
    height: 340,
    borderRadius: 24,
    overflow: "hidden", // clips the photo to the rounded corners
    backgroundColor: "#F4F4F4",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  smallImage: {
    position: "absolute", // floats on top of the big photo
    top: 12,
    right: 12,
    width: 84,
    height: 84,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.white,
  },
  availableBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  ring: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.purpleText,
    marginRight: 8,
  },
  availableText: {
    fontSize: 11,
    color: colors.dark,
  },
});
