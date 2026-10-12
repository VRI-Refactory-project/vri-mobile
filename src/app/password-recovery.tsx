import { useState } from "react";
import { Alert } from "react-native";
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
    />
  );
}
