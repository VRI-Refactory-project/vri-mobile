import { Tabs } from "expo-router";
import {
  Home,
  Calendar,
  MessageSquare,
  User,
  Settings,
} from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#2E1E5B", // Deep purple background
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 90 : 70, // Taller on iOS for the home indicator
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8B7BB8", // Faded purple for inactive icons
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="deaf-user-dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
