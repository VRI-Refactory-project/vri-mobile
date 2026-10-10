
import type { ComponentType } from "react";

export type PasswordRecoveryScreenProps = {
  mode: "forgot" | "reset";
  email: string;
  onEmailChange: (email: string) => void;
  onSendResetLink?: () => void;
  onResetComplete?: () => void;
};

declare const PasswordRecoveryScreen: ComponentType<PasswordRecoveryScreenProps>;

export default PasswordRecoveryScreen;
// 