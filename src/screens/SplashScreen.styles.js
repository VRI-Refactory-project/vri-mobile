import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B2978",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  logo: {
    width: 230,
    height: 140,
    marginBottom: 32,
  },
  tagline: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#D9D2F5",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  continueButton: {
    width: 200,
    height: 48,
    backgroundColor: "#F4F1FF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B2978",
    marginRight: 24,
  },
  footer: {
    paddingBottom: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#D9D2F5",
  },
  loginLink: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
