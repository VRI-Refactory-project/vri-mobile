// import { StyleSheet } from "react-native";

// export const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#F5F4FB",
//   },
//   flex: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 112,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 520,
//     alignSelf: "center",
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#DCD9F2",
//     borderRadius: 18,
//     paddingHorizontal: 21,
//     paddingTop: 35,
//     paddingBottom: 31,
//   },
//   heading: {
//     color: "#211F35",
//     fontSize: 27,
//     lineHeight: 34,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   resetHeading: {
//     fontWeight: "400",
//   },
//   subtitle: {
//     color: "#696783",
//     fontSize: 15,
//     lineHeight: 22,
//     textAlign: "center",
//     marginBottom: 28,
//   },
//   fieldGroup: {
//     marginBottom: 26,
//   },
//   resetFieldGroup: {
//     marginBottom: 26,
//   },
//   label: {
//     color: "#5E5B7C",
//     fontSize: 12,
//     fontWeight: "600",
//     marginBottom: 7,
//   },
//   input: {
//     height: 46,
//     borderWidth: 1,
//     borderColor: "#DCD9F2",
//     borderRadius: 11,
//     paddingHorizontal: 12,
//     color: "#211F35",
//     fontSize: 13,
//     backgroundColor: "#FFFFFF",
//   },
//   inputError: {
//     borderColor: "#C83E52",
//   },
//   error: {
//     color: "#B52D43",
//     fontSize: 12,
//     marginTop: 5,
//   },
//   primaryButton: {
//     height: 45,
//     backgroundColor: "#3D2B80",
//     borderRadius: 11,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   fab: {
//     position: "absolute",
//     right: 7,
//     bottom: 62,
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#3D2B80",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 5,
//     shadowColor: "#000000",
//     shadowOpacity: 0.18,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   tabBar: {
//     height: 63,
//     backgroundColor: "#3D2B80",
//     borderTopWidth: 1,
//     borderTopColor: "#2A1B66",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     paddingHorizontal: 6,
//   },
//   tabItem: {
//     flex: 1,
//     height: 60,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tabIconBox: {
//     width: 46,
//     height: 34,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tabIconBoxSelected: {
//     backgroundColor: "#F5F4FB",
//   },
//   tabLabel: {
//     color: "#FFFFFF",
//     fontSize: 9,
//     lineHeight: 12,
//     marginTop: 0,
//   },
// });




import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#292544",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 27, 61, 0.48)",
  },

  flex: {
    flex: 1,
  },

  topBar: {
    width: "100%",
    minHeight: 78,
    paddingTop: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },

  logo: {
    width: 100,
    height: 54,
    alignSelf: "flex-start",
  },

  backButton: {
    minHeight: 42,
    paddingHorizontal: 17,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(255,255,255,0.17)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  card: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E3EF",
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 28,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  heading: {
    color: "#22243A",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#707B96",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 29,
  },

  fieldGroup: {
    marginBottom: 22,
  },

  label: {
    color: "#25283D",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 9,
  },

  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#C9D2E4",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#25283D",
    fontSize: 13,
    backgroundColor: "#FFFFFF",
  },

  inputError: {
    borderColor: "#E5484D",
  },

  error: {
    color: "#E5484D",
    fontSize: 12,
    marginTop: 8,
  },

  primaryButton: {
    minHeight: 49,
    width: "100%",
    backgroundColor: "#3D2B80",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  loginLink: {
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },

  loginLinkText: {
    color: "#3D2B80",
    fontSize: 13,
    fontWeight: "600",
  },
});




