import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../types';
import { colors } from '../constants/theme';
import { AuthScreen } from '../screens/AuthScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ListingDetailScreen } from '../screens/ListingDetailScreen';
import { RestoreScreen } from '../screens/RestoreScreen';
import { CobblerMapScreen } from '../screens/CobblerMapScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { SellerDashboardScreen } from '../screens/SellerDashboardScreen';
import { SustainabilityScreen } from '../screens/SustainabilityScreen';
import { AppStoreScreenshotsScreen } from '../screens/AppStoreScreenshotsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {});

export function AppNavigator() {
  const { session, loading } = useAuth();

  const onRootLayout = useCallback(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '700', color: colors.text }}>
          Kick&apos;n Kicks
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onRootLayout}>
      <NavigationContainer>
        <Stack.Navigator
          key={session ? 'signed-in' : 'signed-out'}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          {!session ? (
            <Stack.Screen name="AuthFlow" component={AuthScreen} />
          ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
            <Stack.Screen name="Restore" component={RestoreScreen} />
            <Stack.Screen name="CobblerMap" component={CobblerMapScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} />
            <Stack.Screen name="Sustainability" component={SustainabilityScreen} />
            <Stack.Screen name="AppStoreScreenshots" component={AppStoreScreenshotsScreen} />
          </>
        )}
      </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
