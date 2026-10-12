import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./DHHSignupScreen.styles";

export default function DHHSignupScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const nextErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else if (!/^\+[1-9]\d{7,14}$/.test(phone.trim())) {
      nextErrors.phone =
        "Use international format, e.g. +256772123456.";
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please create a password.";
    } else if (password.length < 8) {
      nextErrors.password =
        "Your password must contain at least 8 characters.";
    }

    if (!acceptedTerms) {
      nextErrors.terms =
        "Please accept the Terms and Privacy Policy to continue.";
    }

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    return true;
  };

  const handleCreateAccount = () => {
    if (!validateForm()) {
      setMessage("Please review the highlighted fields.");
      return;
    }

    setMessage(
      "Your details are ready. Account creation will be enabled when the backend is connected."
    );
  };

  const renderError = (field) => {
    if (!errors[field]) return null;

    return (
      <Text
        style={styles.errorText}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        {errors[field]}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F6FC" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={22} color="#3B2978" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={styles.completedStep}>
                <Feather name="check" size={17} color="#FFFFFF" />
              </View>

              <View style={styles.progressLine} />

              <View style={styles.currentStep}>
                <Text style={styles.currentStepNumber}>2</Text>
              </View>

              <View style={styles.stepTextContainer}>
                <Text style={styles.stepCompletedText}>
                  Choose your role
                </Text>
                <Text style={styles.stepCurrentText}>
                  Create your account
                </Text>
              </View>
            </View>

            <Text style={styles.heading}>Create your account</Text>

            <Text style={styles.subtitle}>
              Enter your details to get started.
            </Text>

            <TouchableOpacity
              style={styles.helpBanner}
              onPress={() => setShowHelp(true)}
              accessibilityRole="button"
              accessibilityLabel="Open sign-language signup help"
            >
              <View style={styles.helpIcon}>
                <Feather name="video" size={21} color="#3B2978" />
              </View>

              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>
                  Need help signing up?
                </Text>
                <Text style={styles.helpDescription}>
                  Get guidance in sign language
                </Text>
              </View>

              <Feather name="chevron-right" size={22} color="#3B2978" />
            </TouchableOpacity>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.fullName && styles.inputError,
                ]}
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);
                  setErrors((previous) => ({
                    ...previous,
                    fullName: undefined,
                  }));
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#88839B"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Full name"
                accessibilityHint="Enter your first and last name"
              />
              {renderError("fullName")}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.phone && styles.inputError,
                ]}
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  setErrors((previous) => ({
                    ...previous,
                    phone: undefined,
                  }));
                }}
                placeholder="+256 772 123456"
                placeholderTextColor="#88839B"
                keyboardType="phone-pad"
                autoCapitalize="none"
                returnKeyType="next"
                accessibilityLabel="Phone number"
                accessibilityHint="Enter your phone number with the country code, starting with plus"
              />
              <Text style={styles.fieldHint}>
                Include your country code, starting with +.
              </Text>
              {renderError("phone")}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Email address{" "}
                <Text style={styles.optionalText}>(optional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError,
                ]}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setErrors((previous) => ({
                    ...previous,
                    email: undefined,
                  }));
                }}
                placeholder="Enter your email address"
                placeholderTextColor="#88839B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Email address, optional"
              />

              <Text style={styles.fieldHint}>
                An email lets you reset your password yourself. Without
                one, you will need our help.
              </Text>
              {renderError("email")}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>

              <View
                style={[
                  styles.passwordContainer,
                  errors.password && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setErrors((previous) => ({
                      ...previous,
                      password: undefined,
                    }));
                  }}
                  placeholder="Create a password"
                  placeholderTextColor="#88839B"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  accessibilityLabel="Password"
                  accessibilityHint="Create a password with at least 8 characters"
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((previous) => !previous)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={21}
                    color="#625B7B"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldHint}>
                Use at least 8 characters.
              </Text>
              {renderError("password")}
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAcceptedTerms((previous) => !previous);
                setErrors((previous) => ({
                  ...previous,
                  terms: undefined,
                }));
              }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptedTerms }}
              accessibilityLabel="Accept Terms and Privacy Policy"
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && (
                  <Feather name="check" size={16} color="#FFFFFF" />
                )}
              </View>

              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text style={styles.termsLink}>Terms</Text>
                {" "}and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            {renderError("terms")}

            {message ? (
              <Text
                style={
                  Object.keys(errors).length > 0
                    ? styles.errorText
                    : styles.infoMessage
                }
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateAccount}
              accessibilityRole="button"
              accessibilityLabel="Create account"
            >
              <Text style={styles.createButtonText}>Create account</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.signInRow}>
              <Text style={styles.signInText}>
                Have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/login")}
                accessibilityRole="button"
                accessibilityLabel="Go to sign in"
              >
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={styles.modalCard}
            accessibilityViewIsModal
          >
            <View style={styles.modalHeadingRow}>
              <Text style={styles.modalTitle}>
                Sign-language signup help
              </Text>

              <TouchableOpacity
                onPress={() => setShowHelp(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel="Close help"
              >
                <Feather name="x" size={23} color="#3B2978" />
              </TouchableOpacity>
            </View>

            <View style={styles.videoPlaceholder}>
              <Feather name="video" size={38} color="#3B2978" />
              <Text style={styles.videoPlaceholderTitle}>
                Sign-language video
              </Text>
              <Text style={styles.videoPlaceholderText}>
                A signup guide video can be added here when the video
                asset or link is available.
              </Text>
            </View>

            <Text style={styles.helpInstructionsHeading}>
              Written guidance
            </Text>

            <Text style={styles.helpInstructions}>
              1. Enter your full name.
              {"\n\n"}2. Enter your phone number with the country code,
              such as +256 for Uganda.
              {"\n\n"}3. Email is optional, but it helps you reset your
              password.
              {"\n\n"}4. Create a password and accept the Terms and
              Privacy Policy.
            </Text>

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowHelp(false)}
              accessibilityRole="button"
            >
              <Text style={styles.modalDoneText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
