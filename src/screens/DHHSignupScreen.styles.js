import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },

  background: {
    flex: 1,
    width: "100%",
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(30, 20, 60, 0.35)",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 18,
  },

  container: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  logo: {
    width: 90,
    height: 55,
    marginBottom: 8,
  },

  backButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingRight: 12,
    marginBottom: 16,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  formCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  progressContainer: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  completedStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3B2978",
    alignItems: "center",
    justifyContent: "center",
  },

  progressLine: {
    width: 35,
    height: 2,
    backgroundColor: "#BDB5DE",
    marginHorizontal: 5,
  },

  currentStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3B2978",
    alignItems: "center",
    justifyContent: "center",
  },

  currentStepNumber: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  stepTextContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  stepCompletedText: {
    color: "#77718C",
    fontSize: 12,
    marginBottom: 5,
  },

  stepCurrentText: {
    color: "#30245F",
    fontSize: 14,
    fontWeight: "700",
  },

  heading: {
    color: "#292044",
    fontSize: 27,
    fontWeight: "700",
    lineHeight: 34,
    marginBottom: 7,
  },

  subtitle: {
    color: "#716B83",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },

  helpBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFECFA",
    borderColor: "#DED8F4",
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 13,
    marginBottom: 24,
    minHeight: 76,
  },

  helpIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  helpTextContainer: {
    flex: 1,
  },

  helpTitle: {
    color: "#30245F",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  helpDescription: {
    color: "#68617F",
    fontSize: 12,
    lineHeight: 17,
  },

  fieldGroup: {
    marginBottom: 19,
  },

  label: {
    color: "#302A43",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  optionalText: {
    color: "#817B92",
    fontSize: 13,
    fontWeight: "400",
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#DCD8E7",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#292044",
  },

  inputError: {
    borderColor: "#B42318",
    borderWidth: 1.5,
  },

  fieldHint: {
    color: "#77718A",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  errorText: {
    color: "#B42318",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  passwordContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCD8E7",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },

  passwordInput: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#292044",
  },

  eyeButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    marginTop: 2,
  },

  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 1.5,
    borderColor: "#8B83A7",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginRight: 11,
  },

  checkboxChecked: {
    backgroundColor: "#3B2978",
    borderColor: "#3B2978",
  },

  termsText: {
    flex: 1,
    color: "#514B63",
    fontSize: 13,
    lineHeight: 20,
  },

  termsLink: {
    color: "#3B2978",
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  infoMessage: {
    color: "#3B2978",
    fontSize: 13,
    lineHeight: 19,
    backgroundColor: "#EFECFA",
    borderRadius: 9,
    padding: 12,
    marginTop: 12,
  },

  createButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B2978",
    borderRadius: 12,
    marginTop: 23,
    paddingHorizontal: 18,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
  },

  signInRow: {
    minHeight: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 13,
  },

  signInText: {
    color: "#716B83",
    fontSize: 14,
  },

  signInLink: {
    color: "#3B2978",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(26, 19, 48, 0.55)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    maxHeight: "90%",
  },

  modalHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  modalTitle: {
    flex: 1,
    color: "#292044",
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 26,
  },

  modalClose: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  videoPlaceholder: {
    backgroundColor: "#EFECFA",
    borderRadius: 13,
    padding: 22,
    alignItems: "center",
    marginBottom: 20,
  },

  videoPlaceholderTitle: {
    color: "#30245F",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
  },

  videoPlaceholderText: {
    color: "#68617F",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  helpInstructionsHeading: {
    color: "#30245F",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  helpInstructions: {
    color: "#514B63",
    fontSize: 14,
    lineHeight: 22,
  },

  modalDoneButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B2978",
    borderRadius: 10,
    marginTop: 22,
  },

  modalDoneText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
