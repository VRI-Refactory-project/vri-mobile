// Splash Screen
import SplashScreen from "../screens/SplashScreen";

export default function Index() {
  return <SplashScreen />;
}


// Roles Selection Page
// import RoleSelectionPage from "../screens/RoleSelectionPage";

// export default function Index() {
//   return <RoleSelectionPage />;
// }


// Password Recovery Screen
// import { useState } from "react";
// import { View } from "react-native";
// import PasswordRecoveryScreen from "../screens/PasswordRecoveryScreen";

// export default function App() {
//   const [mode, setMode] = useState<"forgot" | "reset">("forgot");
//   const [email, setEmail] = useState("test@vri.com");

//   const goToForgotPassword = () => {
//     setMode("forgot");
//   };

//   const goToLogin = () => {
//     // Connect this callback to the actual Login screen navigation
//     // when the Login feature branch is merged.
//     console.log("Navigate to the existing Login screen");
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <PasswordRecoveryScreen
//         mode={mode}
//         email={email}
//         onEmailChange={setEmail}
//         onBack={goToForgotPassword}
//         onGoToLogin={goToLogin}
//         onSendResetLink={() => {
//           console.log("Send recovery code to:", email);
//           setMode("reset");
//         }}
//         onResetComplete={() => {
//           console.log("Password reset flow completed");
//           setMode("forgot");
//         }}
//       />
//     </View>
//   );
// }
