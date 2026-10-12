

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)", 
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 22,
    minHeight: 120,
  },
  logo: {
    width: 190,
    height: 72,
  },

  backButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 999,                         // pill shape
  backgroundColor: "rgba(255,255,255,0.15)", // light translucent fill
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.35)",     // thin white ring
  gap: 6,
},
backText: {
  fontSize: 15,
  color: "#FFFFFF",
  fontWeight: "500",
  marginLeft: 2,
},
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 36,
    marginBottom: 12,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 300,
  },
  card: {
    height: 460,
    width: "92%",
    alignSelf: "center",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
    justifyContent: "flex-start",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#000000",     // was "#0000" which is transparent — you probably want readable text
    lineHeight: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2C2C2C",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 14,
    paddingBottom: 24,
  },
  toolButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  toolText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

