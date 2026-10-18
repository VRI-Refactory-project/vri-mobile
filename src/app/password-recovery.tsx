import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import PasswordRecoveryScreen from "../screens/PasswordRecoveryScreen";

export default function PasswordRecoveryRoute() {
  const [email, setEmail] = useState("");

  return (
    <PasswordRecoveryScreen
      mode="forgot"
      email={email}
      onEmailChange={setEmail}
      onSendResetLink={() => Alert.alert("Sending reset link to " + email)}
      onResetComplete={() => Alert.alert("Reset complete")}
      // Opened directly (e.g. a web URL) there is no screen to go back to, so fall back to login.
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/login"))}
      onGoToLogin={() => router.dismissTo("/login")}
    />
  );
}
