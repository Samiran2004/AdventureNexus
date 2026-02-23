import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Image,
} from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { theme } from '../styles/theme';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';

// Required for OAuth redirects in Expo Go
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }: any) {
    const { signIn, setActive, isLoaded } = useSignIn();
    const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // ─── Email + Password Sign In ─────────────────────────────────────────────
    const handleSignIn = async () => {
        if (!isLoaded) return;
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Info', 'Please enter both email and password.');
            return;
        }
        try {
            setLoading(true);
            const result = await signIn.create({
                identifier: email.trim(),
                password,
            });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
            } else {
                Alert.alert('Sign In Failed', 'Could not complete sign in. Please try again.');
            }
        } catch (err: any) {
            Alert.alert(
                'Sign In Error',
                err?.errors?.[0]?.longMessage || err?.message || 'Something went wrong.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ─── Google OAuth ─────────────────────────────────────────────────────────
    const handleGoogleSignIn = useCallback(async () => {
        try {
            setGoogleLoading(true);
            const { createdSessionId, setActive: setOAuthActive } = await startGoogleOAuth({
                redirectUrl: Linking.createURL('/oauth-callback', { scheme: 'myapp' }),
            });
            if (createdSessionId && setOAuthActive) {
                await setOAuthActive({ session: createdSessionId });
            }
        } catch (err: any) {
            Alert.alert(
                'Google Sign In Failed',
                err?.errors?.[0]?.longMessage || err?.message || 'Could not sign in with Google.'
            );
        } finally {
            setGoogleLoading(false);
        }
    }, [startGoogleOAuth]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />
                        <View style={styles.logoBox}>
                            <Text style={styles.logoEmoji}>🧭</Text>
                            <Text style={styles.logoText}>AdventureNexus</Text>
                            <Text style={styles.logoTagline}>AI-Powered Travel Planning</Text>
                        </View>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.title}>Welcome Back 👋</Text>
                        <Text style={styles.subtitle}>Sign in to continue your adventure</Text>

                        {/* ── Google Sign In ── */}
                        <TouchableOpacity
                            style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
                            onPress={handleGoogleSignIn}
                            disabled={googleLoading}
                            activeOpacity={0.85}
                        >
                            {googleLoading ? (
                                <ActivityIndicator color={theme.colors.text.primary} />
                            ) : (
                                <View style={styles.googleBtnContent}>
                                    {/* Google "G" logo using text */}
                                    <Text style={styles.googleLogo}>G</Text>
                                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or sign in with email</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputRow}>
                                <Mail size={16} color={theme.colors.text.secondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor={theme.colors.text.secondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputRow}>
                                <Lock size={16} color={theme.colors.text.secondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your password"
                                    placeholderTextColor={theme.colors.text.secondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                                    {showPassword
                                        ? <EyeOff size={16} color={theme.colors.text.secondary} />
                                        : <Eye size={16} color={theme.colors.text.secondary} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.signInBtn, loading && styles.btnDisabled]}
                            onPress={handleSignIn}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <View style={styles.btnContent}>
                                    <Text style={styles.signInBtnText}>Sign In</Text>
                                    <ArrowRight size={18} color="#FFF" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Go to Sign Up */}
                        <TouchableOpacity
                            style={styles.signUpLink}
                            onPress={() => navigation.navigate('SignUp')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signUpLinkText}>
                                Don't have an account? <Text style={styles.signUpLinkAccent}>Sign Up →</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Trust */}
                    <View style={styles.trustRow}>
                        <Text style={styles.trustText}>🔒 Secured by Clerk</Text>
                        <Text style={styles.trustText}>🌍 195+ Destinations</Text>
                        <Text style={styles.trustText}>✨ AI Powered</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const C = theme.colors;
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    container: { flexGrow: 1 },

    imageWrapper: { height: 280, width: '100%' },
    heroImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26,60,52,0.65)' },
    logoBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoEmoji: { fontSize: 48, marginBottom: 8 },
    logoText: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
    logoTagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

    card: {
        backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -32,
        borderRadius: 32, padding: 28,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12, shadowRadius: 20, elevation: 8,
    },
    title: { fontSize: 26, fontWeight: '900', color: C.text.primary, marginBottom: 6 },
    subtitle: { fontSize: 14, color: C.text.secondary, marginBottom: 20 },

    // Google button
    googleBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFF', borderRadius: 40, paddingVertical: 14,
        borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)',
        marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    googleBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    googleLogo: {
        fontSize: 20, fontWeight: '900', color: '#4285F4',
        fontStyle: 'italic', width: 24, textAlign: 'center',
    },
    googleBtnText: { fontSize: 15, fontWeight: '700', color: C.text.primary },

    divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
    dividerText: { fontSize: 11, color: C.text.secondary, fontWeight: '600' },

    inputGroup: { marginBottom: 18 },
    label: { fontSize: 12, fontWeight: '700', color: C.text.primary, marginBottom: 8 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: C.background, borderRadius: 16,
        paddingHorizontal: 16, paddingVertical: 14,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    },
    input: { flex: 1, fontSize: 14, color: C.text.primary },

    signInBtn: {
        backgroundColor: C.primary, paddingVertical: 16, borderRadius: 40,
        alignItems: 'center', marginTop: 4, marginBottom: 16,
    },
    btnDisabled: { opacity: 0.65 },
    btnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    signInBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

    signUpLink: { paddingVertical: 4, alignItems: 'center' },
    signUpLinkText: { fontSize: 14, color: C.text.secondary },
    signUpLinkAccent: { color: C.primary, fontWeight: '800' },

    trustRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 24, flexWrap: 'wrap' },
    trustText: { fontSize: 11, color: C.text.secondary, fontWeight: '600' },
});
