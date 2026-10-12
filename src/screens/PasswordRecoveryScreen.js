// import React, { useState } from "react";
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import { styles } from "./PasswordRecoveryScreen.styles";

// const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// export default function PasswordRecoveryScreen({
//   mode,
//   email,
//   onEmailChange,
//   onSendResetLink,
//   onResetComplete,
// }) {
//   const isReset = mode === "reset";
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const handleSendResetLink = () => {
//     setEmailError("");
//     if (!validEmail(email)) {
//       setEmailError("Enter a valid email address.");
//       return;
//     }
//     // Frontend-only transition: connect a reset-link API when backend work begins.
//     onSendResetLink?.();
//   };

//   const handleResetPassword = () => {
//     setEmailError("");
//     setPasswordError("");
//     if (!validEmail(email)) {
//       setEmailError("Enter a valid email address.");
//       return;
//     }
//     if (password.length < 8) {
//       setPasswordError("Use at least 8 characters.");
//       return;
//     }
//     // No password is changed until this action is connected to a secure backend endpoint.
//     Alert.alert(
//       "Ready for integration",
//       "Your entries passed frontend validation. Connect the password-reset API to complete the change.",
//       [{ text: "OK", onPress: () => onResetComplete?.() }],
//     );
//   };

//   return (
//     <View style={styles.screen}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F5F4FB" />
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           style={styles.flex}
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.card}>
//             <Text style={[styles.heading, isReset && styles.resetHeading]}>
//               {isReset ? "Select a new password" : "Forgot Password?"}
//             </Text>
//             <Text style={styles.subtitle}>
//               {isReset
//                 ? "Choose a strong password you haven't used\nbefore"
//                 : "Enter your email and we'll send reset\ninstructions"}
//             </Text>

//             <View style={[styles.fieldGroup, isReset && styles.resetFieldGroup]}>
//               <Text style={styles.label}>Email address</Text>
//               <TextInput
//                 accessibilityLabel="Email address"
//                 value={email}
//                 onChangeText={(value) => {
//                   onEmailChange(value);
//                   setEmailError("");
//                 }}
//                 style={[styles.input, emailError ? styles.inputError : null]}
//                 placeholder="name@example.com"
//                 placeholderTextColor="#696783"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 textContentType="emailAddress"
//                 returnKeyType={isReset ? "next" : "done"}
//               />
//               {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
//             </View>

//             {isReset ? (
//               <View style={styles.fieldGroup}>
//                 <Text style={styles.label}>Password</Text>
//                 <TextInput
//                   accessibilityLabel="New password"
//                   value={password}
//                   onChangeText={(value) => {
//                     setPassword(value);
//                     setPasswordError("");
//                   }}
//                   style={[styles.input, passwordError ? styles.inputError : null]}
//                   placeholder="Enter your password"
//                   placeholderTextColor="#696783"
//                   secureTextEntry
//                   textContentType="newPassword"
//                   autoCapitalize="none"
//                   returnKeyType="done"
//                 />
//                 {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
//               </View>
//             ) : null}

//             <TouchableOpacity
//               accessibilityRole="button"
//               style={styles.primaryButton}
//               onPress={isReset ? handleResetPassword : handleSendResetLink}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.buttonText}>
//                 {isReset ? "Reset password" : "Send reset link"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityLabel="Add new item"
//           style={styles.fab}
//           onPress={() =>
//             Alert.alert(
//               "Add new item",
//               "Connect this action to the existing create-item flow when integrating the backend.",
//             )
//           }
//           activeOpacity={0.85}
//         >
//           <Feather name="plus" size={28} color="#FFFFFF" />
//         </TouchableOpacity>

//         <View style={styles.tabBar}>
//           <TabItem icon="home" label="Dashboard" />
//           <TabItem icon="users" label="Users" />
//           <TabItem icon="user-check" label="Verify" selected />
//           <TabItem icon="video" label="Sessions" />
//           <TabItem icon="settings" label="Settings" />
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// function TabItem({ icon, label, selected = false }) {
//   return (
//     <View style={styles.tabItem}>
//       <View style={[styles.tabIconBox, selected && styles.tabIconBoxSelected]}>
//         <Feather
//           name={icon}
//           size={21}
//           color={selected ? "#214D3B" : "#FFFFFF"}
//           strokeWidth={selected ? 2.2 : 1.8}
//         />
//       </View>
//       <Text style={styles.tabLabel}>{label}</Text>
//     </View>
//   );
// }





import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./PasswordRecoveryScreen.styles";

const BACKGROUND_IMAGE = require("../../assets/images/password-recovery-bg.png");
const LOGO_IMAGE = require("../../assets/images/logo.png");

const validEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
};

export default function PasswordRecoveryScreen({
  mode,
  email,
  onEmailChange,
  onBack,
  onGoToLogin,
  onSendResetLink,
  onResetComplete,
}) {
  const isReset = mode === "reset";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    }
  };

  const handleGoToLogin = () => {
    if (typeof onGoToLogin === "function") {
      onGoToLogin();
    }
  };

  const handleSendResetLink = () => {
    setEmailError("");

    const value = email.trim();
    const validContact = validEmail(value) || validPhone(value);

    if (!validContact) {
      setEmailError("Enter a valid email address or phone number.");
      return;
    }

    if (typeof onSendResetLink === "function") {
      onSendResetLink();
    } else {
      Alert.alert(
        "Password recovery",
        "The contact information is valid. Connect the recovery API to send the verification code."
      );
    }
  };

  const handleResetPassword = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!validEmail(email.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    Alert.alert(
      "Ready for backend integration",
      "Your entries passed validation. Connect the secure password-reset API to save the new password.",
      [
        {
          text: "OK",
          onPress: () => {
            if (typeof onResetComplete === "function") {
              onResetComplete();
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.screen}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View pointerEvents="none" style={styles.overlay} />

      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.topBar}>
        {/* Logo: top-left */}
        <Image
          source={LOGO_IMAGE}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="SignConnect logo"
        />

        {/* Back button: top-right */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Back to previous screen"
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={16} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.heading}>
              {isReset ? "Select a new password" : "Forgot Password?"}
            </Text>

            <Text style={styles.subtitle}>
              {isReset
                ? "Choose a strong password you haven't used before"
                : "Enter your email or phone number and we'll email you a 6-digit code"}
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {isReset ? "Email address" : "Email or phone number"}
              </Text>

              <TextInput
                accessibilityLabel="Email or phone number"
                value={email}
                onChangeText={(value) => {
                  onEmailChange(value);
                  setEmailError("");
                }}
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder={
                  isReset
                    ? "name@example.com"
                    : "name@example.com or +256 772 123 456"
                }
                placeholderTextColor="#85859A"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={isReset ? "next" : "done"}
              />

              {emailError ? (
                <Text style={styles.error}>{emailError}</Text>
              ) : null}
            </View>

            {isReset ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>New password</Text>

                  <TextInput
                    accessibilityLabel="New password"
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setPasswordError("");
                    }}
                    style={[
                      styles.input,
                      passwordError ? styles.inputError : null,
                    ]}
                    placeholder="Enter your new password"
                    placeholderTextColor="#85859A"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />

                  {passwordError ? (
                    <Text style={styles.error}>{passwordError}</Text>
                  ) : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm new password</Text>

                  <TextInput
                    accessibilityLabel="Confirm new password"
                    value={confirmPassword}
                    onChangeText={(value) => {
                      setConfirmPassword(value);
                      setConfirmPasswordError("");
                    }}
                    style={[
                      styles.input,
                      confirmPasswordError ? styles.inputError : null,
                    ]}
                    placeholder="Re-enter your new password"
                    placeholderTextColor="#85859A"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />

                  {confirmPasswordError ? (
                    <Text style={styles.error}>
                      {confirmPasswordError}
                    </Text>
                  ) : null}
                </View>
              </>
            ) : null}

            <TouchableOpacity
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={
                isReset ? handleResetPassword : handleSendResetLink
              }
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {isReset ? "Reset password" : "Send code"}
              </Text>

              <Feather
                name="chevron-right"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              style={styles.loginLink}
              onPress={handleGoToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginLinkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
