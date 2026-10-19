import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import SplashScreen from "./src/screens/SplashScreen";
import LandingScreen from "./src/screens/LandingScreen";
import RoleSelectionPage from "./src/screens/RoleSelectionPage";
import { InterpreterSettingsPage } from "./src/screens/InterpreterSettingsPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionPage} />
        <Stack.Screen
          name="InterpreterSettings"
          component={InterpreterSettingsPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
