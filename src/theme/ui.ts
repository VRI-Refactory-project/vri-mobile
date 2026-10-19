// Shared look for the interpreter screens (same purple palette as the certification screens).
import { StyleSheet } from "react-native";

export const ui = {
  primary: "#4A3A9A",
  heading: "#1B1530",
  muted: "#6B6785",
  placeholder: "#9A96B0",
  border: "#E9E7F2",
  error: "#B52D43",
  errorBackground: "#FDECEF",
  success: "#1E7B4F",
  white: "#FFFFFF",
  background: "#F5F4FB",
};

export const form = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ui.background },
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  step: { color: ui.primary, fontSize: 13, fontWeight: "600", marginBottom: 6 },
  title: { color: ui.heading, fontSize: 24, fontWeight: "700" },
  subtitle: {
    color: ui.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  label: {
    color: ui.heading,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ui.border,
    backgroundColor: ui.white,
    paddingHorizontal: 14,
    color: ui.heading,
    fontSize: 15,
  },
  inputError: { borderColor: ui.error, backgroundColor: ui.errorBackground },
  fieldError: { color: ui.error, fontSize: 12, marginTop: 6 },
  formError: { color: ui.error, fontSize: 14, marginTop: 16 },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: ui.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: ui.white, fontSize: 16, fontWeight: "600" },
  link: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  linkText: { color: ui.primary, fontSize: 15, fontWeight: "600" },
});
