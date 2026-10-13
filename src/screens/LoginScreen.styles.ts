import { StyleSheet } from "react-native";

// Values measured from the login design (375pt frame).

export const colors = {
  primary: "#4A3A9A",
  heading: "#1B1530",
  muted: "#6B6785",
  placeholder: "#9A96B0",
  border: "#E9E7F2",
  error: "#B52D43",
  errorBorder: "#C83E52",
  errorBackground: "#FDECEF",
  white: "#FFFFFF",
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#231C59",
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  // Purple tint over the photo so the white logo and card stand out.
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(35, 28, 89, 0.55)",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 80,
  },
  backButton: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  backText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 21,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    color: colors.heading,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 28,
  },
  formError: {
    color: colors.error,
    backgroundColor: colors.errorBackground,
    fontSize: 13,
    lineHeight: 18,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: -16,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  lastFieldGroup: {
    marginBottom: 8,
  },
  label: {
    color: colors.heading,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: colors.heading,
    fontSize: 14,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.errorBorder,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
  loginButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  loginButtonBusy: {
    opacity: 0.8,
  },
  loginText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  forgotButton: {
    alignSelf: "center",
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: 8,
    marginTop: 2,
  },
  forgotText: {
    color: colors.muted,
    fontSize: 13,
  },
});
