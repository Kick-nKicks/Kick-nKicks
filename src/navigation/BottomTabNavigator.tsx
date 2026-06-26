import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TabParamList } from '../types';
import { colors, tabBarShadow } from '../constants/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SellScreen } from '../screens/SellScreen';
import { VideoFeedScreen } from '../screens/VideoFeedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: '#ADB5BD',
        tabBarStyle: {
          backgroundColor: colors.surfaceGlass,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
          ...tabBarShadow,
        },
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
            HomeTab: 'home',
            SearchTab: 'search',
            SellTab: 'add-circle',
            VideosTab: 'play-circle',
            ProfileTab: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="SellTab" component={SellScreen} options={{ title: 'Sell+' }} />
      <Tab.Screen name="VideosTab" component={VideoFeedScreen} options={{ title: 'Feed' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
