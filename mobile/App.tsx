import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import { theme } from './src/styles/theme';

// ─── Clerk publishable key ────────────────────────────────────────────────────
const CLERK_PUBLISHABLE_KEY = 'pk_test_c3VubnktaGFsaWJ1dC03OC5jbGVyay5hY2NvdW50cy5kZXYk';

// ─── SecureStore token cache for Clerk ────────────────────────────────────────
const tokenCache = {
    async getToken(key: string) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch { }
    },
    async clearToken(key: string) {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch { }
    },
};

// ─── Navigators ───────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom bottom tab bar
function CustomTabBar({ state, navigation }: any) {
    const insets = useSafeAreaInsets();
    const tabs: { name: string; icon: string }[] = [
        { name: 'Home', icon: '🏠' },
        { name: 'Search', icon: '🔍' },
        { name: 'Reviews', icon: '⭐' },
        { name: 'Profile', icon: '👤' },
    ];

    return (
        <View style={styles.tabBarContainer}>
            <BlurView
                intensity={80}
                tint="dark"
                style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom - 10, 0) }]}
            >
                {tabs.map((tab, index) => {
                    const isFocused = state.index === index;
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tabItem}
                            onPress={() => navigation.navigate(tab.name)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                                {tab.icon}
                            </Text>
                            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                                {tab.name}
                            </Text>
                            {isFocused && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
}

// ─── Main app tabs (when signed in) ──────────────────────────────────────────
function HomeTabs() {
    return (
        <Tab.Navigator
            id={undefined}
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Reviews" component={ReviewsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

// ─── Auth navigator (when signed out) ────────────────────────────────────────
function AuthNavigator() {
    return (
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

import AnimeLoader from './src/components/AnimeLoader';

// ─── Root navigator — switches based on auth status ──────────────────────────
function RootNavigator() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <AnimeLoader />
        );
    }

    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
                {isSignedIn ? (
                    <>
                        <Stack.Screen name="Main" component={HomeTabs} />
                        <Stack.Screen name="Details" component={DetailsScreen} />
                        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
        >
            <SafeAreaProvider>
                <RootNavigator />
            </SafeAreaProvider>
        </ClerkProvider>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingEmoji: { fontSize: 64 },
    loadingBrand: { fontSize: 28, fontWeight: '900', color: theme.colors.primary, marginTop: 16 },

    tabBarContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 24 : 16,
        left: 20,
        right: 20,
        backgroundColor: 'transparent',
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabBar: {
        flexDirection: 'row',
        height: 64,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    tabItem: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingVertical: 8, position: 'relative',
    },
    tabIcon: { fontSize: 22, opacity: 0.45, marginBottom: 2 },
    tabIconActive: { opacity: 1 },
    tabLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
    tabLabelActive: { color: '#FFF', fontWeight: '800' },
    tabIndicator: {
        position: 'absolute', top: 2, width: 4, height: 4,
        borderRadius: 2, backgroundColor: '#FFF',
    },
});
