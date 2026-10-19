import React from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./RoleSelectionPage.styles";

export default function RoleSelectionPage() {
  const handleBack = () => {
    console.log("Back clicked");
  };

  const handleSelectRole = (role: string) => {
    console.log(`Selected role: ${role}`);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/interpreter2.png")}
      style={styles.backgroundImage}
      resizeMode="contain"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={20} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Who&apos;s joining{"\n"}SignConnect?</Text>
          <Text style={styles.subtitle}>
            Pick the one that fits you best. You can add another one later.
          </Text>

          {/* Card 1 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleSelectRole("Deaf or Hard of Hearing")}
          >
            <Image
              source={require("../../assets/images/deaf_user.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>Deaf or Hard of Hearing</Text>
              <Text style={styles.cardSubtitle}>
                Get an interpreter on video whenever you need one.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleSelectRole("Interpreter")}
          >
            <Image
              source={require("../../assets/images/interpreter.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>Interpreter</Text>
              <Text style={styles.cardSubtitle}>
                Provide professional sign-language interpretation and connect
                with people who need you.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Toolbar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.toolButton}>
            <Feather name="maximize" size={22} color="#FFF" />
            <Feather name="chevron-down" size={14} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Feather name="thumbs-up" size={22} color="#FFF" />
            <Feather name="chevron-down" size={14} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>T</Text>
            <Feather name="chevron-down" size={14} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Feather name="volume-2" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
