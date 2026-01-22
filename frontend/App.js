import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuickActionScreen from './src/screens/QuickActionScreen';
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import SymptomCheckerScreen from './src/screens/SymptomCheckerScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Dashboard" : "Splash"}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8FAFC' }
        }}
      >
        {user ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="QuickAction" component={QuickActionScreen} />
            <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
            <Stack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
          </>
        ) : (
          // Unauthenticated screens
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}