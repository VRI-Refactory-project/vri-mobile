import SplashScreen from "../screens/SplashScreen";

export default function Index() {
  return <SplashScreen />;
}

// import RoleSelectionPage from "../screens/RoleSelectionPage";

// export default function Index() {
//   return <RoleSelectionPage />;
// }

// import { Link } from 'expo-router';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// export default function Index() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>SignConnect Mobile</Text>

//       <Link href="/deaf-user-dashboard" asChild>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Go to Deaf Dashboard</Text>
//         </TouchableOpacity>
//       </Link>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FE',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#4C3C9B', // Purple to match your theme
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
