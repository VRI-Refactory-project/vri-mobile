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
  Image,
  ImageBackground,
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
    if (!errors[field]) {
      return null;
    }

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
      <StatusBar
        barStyle="light-content"
        backgroundColor="#3B2978"
      />

      <ImageBackground
        source={require("../../assets/images/interpreter4.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.backgroundOverlay}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={
              Platform.OS === "ios" ? "padding" : undefined
            }
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                {/* Logo */}
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel="SignConnect logo"
                />

                {/* Back button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Feather
                    name="arrow-left"
                    size={22}
                    color="#FFFFFF"
                  />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                {/* Signup form card */}
                <View style={styles.formCard}>
                  {/* Progress */}
                  <View style={styles.progressContainer}>
                    <View style={styles.completedStep}>
                      <Feather
                        name="check"
                        size={17}
                        color="#FFFFFF"
                      />
                    </View>

                    <View style={styles.progressLine} />

                    <View style={styles.currentStep}>
                      <Text style={styles.currentStepNumber}>
                        2
                      </Text>
                    </View>

                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepCompletedText}>
                        Step 1 completed
                      </Text>

                      <Text style={styles.stepCurrentText}>
                        Create your account
                      </Text>
                    </View>
                  </View>

                  {/* Heading */}
                  <Text style={styles.heading}>
                    Create your account
                  </Text>

                  <Text style={styles.subtitle}>
                    Enter your details to get started.
                  </Text>

                  {/* Help banner */}
                  <TouchableOpacity
                    style={styles.helpBanner}
                    onPress={() => setShowHelp(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Get help with creating your account"
                  >
                    <View style={styles.helpIcon}>
                      <Feather
                        name="help-circle"
                        size={23}
                        color="#3B2978"
                      />
                    </View>

                    <View style={styles.helpTextContainer}>
                      <Text style={styles.helpTitle}>
                        Need help signing up?
                      </Text>

                      <Text style={styles.helpDescription}>
                        Watch the guide or read the instructions
                        to learn how to create your account.
                      </Text>
                    </View>

                    <Feather
                      name="chevron-right"
                      size={20}
                      color="#3B2978"
                    />
                  </TouchableOpacity>

                  {/* Full name */}
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
                        setErrors((current) => ({
                          ...current,
                          fullName: undefined,
                        }));
                      }}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9A95A8"
                      autoCapitalize="words"
                      autoCorrect={false}
                      accessibilityLabel="Full name"
                    />

                    {renderError("fullName")}
                  </View>

                  {/* Phone */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>
                      Phone number
                    </Text>

                    <TextInput
                      style={[
                        styles.input,
                        errors.phone && styles.inputError,
                      ]}
                      value={phone}
                      onChangeText={(value) => {
                        setPhone(value);
                        setErrors((current) => ({
                          ...current,
                          phone: undefined,
                        }));
                      }}
                      placeholder="+256772123456"
                      placeholderTextColor="#9A95A8"
                      keyboardType="phone-pad"
                      autoCorrect={false}
                      accessibilityLabel="Phone number"
                    />

                    <Text style={styles.fieldHint}>
                      Use international format starting with +,
                      for example +256772123456.
                    </Text>

                    {renderError("phone")}
                  </View>

                  {/* Email */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>
                      Email{" "}
                      <Text style={styles.optionalText}>
                        (optional)
                      </Text>
                    </Text>

                    <TextInput
                      style={[
                        styles.input,
                        errors.email && styles.inputError,
                      ]}
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }));
                      }}
                      placeholder="Enter your email address"
                      placeholderTextColor="#9A95A8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      accessibilityLabel="Email address"
                    />

                    {renderError("email")}
                  </View>

                  {/* Password */}
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
                          setErrors((current) => ({
                            ...current,
                            password: undefined,
                          }));
                        }}
                        placeholder="Create a password"
                        placeholderTextColor="#9A95A8"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        accessibilityLabel="Password"
                      />

                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() =>
                          setShowPassword((current) => !current)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <Feather
                          name={
                            showPassword ? "eye-off" : "eye"
                          }
                          size={20}
                          color="#716B83"
                        />
                      </TouchableOpacity>
                    </View>

                    {renderError("password")}
                  </View>

                  {/* Terms */}
                  <TouchableOpacity
                    style={styles.termsRow}
                    onPress={() =>
                      setAcceptedTerms((current) => !current)
                    }
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked: acceptedTerms,
                    }}
                    accessibilityLabel="Accept Terms and Privacy Policy"
                  >
                    <View
                      style={[
                        styles.checkbox,
                        acceptedTerms &&
                          styles.checkboxChecked,
                      ]}
                    >
                      {acceptedTerms && (
                        <Feather
                          name="check"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </View>

                    <Text style={styles.termsText}>
                      I agree to the{" "}
                      <Text style={styles.termsLink}>
                        Terms
                      </Text>{" "}
                      and{" "}
                      <Text style={styles.termsLink}>
                        Privacy Policy
                      </Text>
                      .
                    </Text>
                  </TouchableOpacity>

                  {renderError("terms")}

                  {/* Message */}
                  {message ? (
                    <Text style={styles.infoMessage}>
                      {message}
                    </Text>
                  ) : null}

                  {/* Create account */}
                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateAccount}
                    accessibilityRole="button"
                    accessibilityLabel="Create account"
                  >
                    <Text style={styles.createButtonText}>
                      Create account
                    </Text>

                    <Feather
                      name="arrow-right"
                      size={20}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>

                  {/* Sign in */}
                  <View style={styles.signInRow}>
                    <Text style={styles.signInText}>
                      Already have an account?{" "}
                    </Text>

                    <TouchableOpacity
                      onPress={() => router.replace("/login")}
                      accessibilityRole="button"
                      accessibilityLabel="Sign in"
                    >
                      <Text style={styles.signInLink}>
                        Sign in
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>

      {/* Help modal */}
      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeadingRow}>
              <Text style={styles.modalTitle}>
                How to create your account
              </Text>

              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowHelp(false)}
                accessibilityRole="button"
                accessibilityLabel="Close help"
              >
                <Feather
                  name="x"
                  size={24}
                  color="#30245F"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.videoPlaceholder}>
              <Feather
                name="play-circle"
                size={42}
                color="#3B2978"
              />

              <Text style={styles.videoPlaceholderTitle}>
                Signup guide
              </Text>

              <Text style={styles.videoPlaceholderText}>
                A signup video guide will be available here.
              </Text>
            </View>

            <Text style={styles.helpInstructionsHeading}>
              Follow these steps
            </Text>

            <Text style={styles.helpInstructions}>
              1. Enter your full name.{"\n"}
              2. Enter your phone number using international
              format.{"\n"}
              3. Add your email address if you have one.{"\n"}
              4. Create a password with at least 8 characters.
              {"\n"}
              5. Accept the Terms and Privacy Policy.{"\n"}
              6. Select Create account to continue.
            </Text>

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowHelp(false)}
              accessibilityRole="button"
              accessibilityLabel="Close help"
            >
              <Text style={styles.modalDoneText}>
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}