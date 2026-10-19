// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import SplashScreen from "./src/screens/SplashScreen";
// import LandingScreen from "./src/screens/LandingScreen";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Splash"
//         screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="Splash" component={SplashScreen} />
//         <Stack.Screen name="Landing" component={LandingScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/screens/SplashScreen";
import LandingScreen from "./src/screens/LandingScreen";
import RoleSelectionPage from "./src/screens/RoleSelectionPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}












