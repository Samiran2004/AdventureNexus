import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Image,
} from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { theme } from '../styles/theme';
import { Mail, Lock, Eye, EyeOff, User, CheckCircle } from 'lucide-react-native';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen({ navigation }: any) {
    const { signUp, setActive, isLoaded } = useSignUp();
    const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // OTP verification step
    const [pendingVerification, setPendingVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        try {
            const redirectUrl = Linking.createURL('/oauth-native-callback');
            const { createdSessionId, signIn, signUp, setActive } = await startGoogleOAuth({ redirectUrl });

            if (createdSessionId) {
                setActive({ session: createdSessionId });
            } else {
                // Handle cases where the OAuth flow completes but no session is created
                // This might happen if the user cancels or there's an issue
                Alert.alert('Sign Up Failed', 'Google sign-up did not complete. Please try again.');
            }
        } catch (err: any) {
            console.error('OAuth error', err);
            Alert.alert(
                'Sign Up Error',
                err?.message || 'Something went wrong with Google sign-up. Please try again.'
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!isLoaded) return;
        if (!email.trim() || !password.trim() || !firstName.trim()) {
            Alert.alert('Missing Info', 'Please fill in first name, email and password.');
            return;
        }
        try {
            setLoading(true);
            await signUp.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                emailAddress: email.trim(),
                password,
            });
            // Send email verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            Alert.alert(
                'Sign Up Error',
                err?.errors?.[0]?.longMessage || err?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!isLoaded) return;
        if (!otp.trim()) {
            Alert.alert('Enter Code', 'Please enter the verification code sent to your email.');
            return;
        }
        try {
            setOtpLoading(true);
            const result = await signUp.attemptEmailAddressVerification({ code: otp.trim() });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
            } else {
                Alert.alert('Verification Failed', 'Could not verify your email. Please try again.');
            }
        } catch (err: any) {
            Alert.alert(
                'Verification Error',
                err?.errors?.[0]?.longMessage || err?.message || 'Invalid code. Please try again.'
            );
        } finally {
            setOtpLoading(false);
        }
    };

    // ─── OTP Verification Screen ────────────────────────────────────────────────
    if (pendingVerification) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.otpContainer}>
                    <Text style={styles.otpEmoji}>📩</Text>
                    <Text style={styles.otpTitle}>Check Your Email</Text>
                    <Text style={styles.otpSubtitle}>
                        We sent a 6-digit verification code to{'\n'}
                        <Text style={{ fontWeight: '800', color: theme.colors.primary }}>{email}</Text>
                    </Text>

                    <View style={styles.otpInputWrapper}>
                        <TextInput
                            style={styles.otpInput}
                            placeholder="Enter 6-digit code"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                            textAlign="center"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.signInBtn, otpLoading && styles.btnDisabled]}
                        onPress={handleVerifyOTP}
                        disabled={otpLoading}
                        activeOpacity={0.85}
                    >
                        {otpLoading
                            ? <ActivityIndicator color="#FFF" />
                            : <Text style={styles.signInBtnText}>Verify Email ✨</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resendBtn}
                        onPress={() => signUp.prepareEmailAddressVerification({ strategy: 'email_code' })}
                    >
                        <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => setPendingVerification(false)}
                    >
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Sign Up Form ────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800' }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />
                        <View style={styles.logoBox}>
                            <Text style={styles.logoEmoji}>🌍</Text>
                            <Text style={styles.logoText}>Join AdventureNexus</Text>
                            <Text style={styles.logoTagline}>Start your journey today — it's free</Text>
                        </View>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.title}>Create Account ✨</Text>
                        <Text style={styles.subtitle}>Sign up to start planning AI-powered trips</Text>

                        {/* Google button */}
                        <TouchableOpacity
                            style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
                            onPress={handleGoogleSignUp}
                            disabled={googleLoading}
                            activeOpacity={0.85}
                        >
                            {googleLoading ? (
                                <ActivityIndicator color={theme.colors.text.primary} />
                            ) : (
                                <View style={styles.googleBtnContent}>
                                    <Text style={styles.googleLogo}>G</Text>
                                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* divider */}
                        <View style={styles.signDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or sign up with email</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Name row */}
                        <View style={styles.nameRow}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>First Name *</Text>
                                <View style={styles.inputRowInner}>
                                    <User size={14} color={theme.colors.text.secondary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="John"
                                        placeholderTextColor={theme.colors.text.secondary}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Last Name</Text>
                                <View style={styles.inputRowInner}>
                                    <User size={14} color={theme.colors.text.secondary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Doe"
                                        placeholderTextColor={theme.colors.text.secondary}
                                        value={lastName}
                                        onChangeText={setLastName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email *</Text>
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
                            <Text style={styles.label}>Password *</Text>
                            <View style={styles.inputRow}>
                                <Lock size={16} color={theme.colors.text.secondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min. 8 characters"
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

                        {/* Benefits */}
                        <View style={styles.benefits}>
                            {['Free to start — no credit card', 'AI-powered trip plans', 'Unlimited plan saving'].map(b => (
                                <View key={b} style={styles.benefitRow}>
                                    <CheckCircle size={14} color="#22C55E" />
                                    <Text style={styles.benefitText}>{b}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signInBtn, loading && styles.btnDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color="#FFF" />
                                : <Text style={styles.signInBtnText}>Create Account →</Text>
                            }
                        </TouchableOpacity>

                        {/* Go to Sign In */}
                        <TouchableOpacity
                            style={styles.signUpBtn}
                            onPress={() => navigation.navigate('SignIn')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signUpBtnText}>
                                Already have an account? <Text style={styles.signUpBtnAccent}>Sign In →</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const C = theme.colors;
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    container: { flexGrow: 1 },

    imageWrapper: { height: 240, width: '100%' },
    heroImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(26,60,52,0.65)' },
    logoBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    logoEmoji: { fontSize: 44, marginBottom: 8 },
    logoText: { fontSize: 24, fontWeight: '900', color: '#FFF', textAlign: 'center' },
    logoTagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 6, textAlign: 'center' },

    card: {
        backgroundColor: theme.colors.card.background, marginHorizontal: 20, marginTop: -32,
        borderRadius: 32, padding: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12, shadowRadius: 20, elevation: 8,
    },
    title: { fontSize: 24, fontWeight: '900', color: C.text.primary, marginBottom: 4 },
    subtitle: { fontSize: 13, color: C.text.secondary, marginBottom: 20 },

    // Google OAuth
    googleBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFF', borderRadius: 40, paddingVertical: 14,
        borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)', marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    googleBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    googleLogo: { fontSize: 20, fontWeight: '900', color: '#4285F4', fontStyle: 'italic', width: 24, textAlign: 'center' },
    googleBtnText: { fontSize: 15, fontWeight: '700', color: C.text.primary },
    signDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
    dividerText: { fontSize: 11, color: C.text.secondary, fontWeight: '600' },

    nameRow: { flexDirection: 'row', gap: 12 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 11, fontWeight: '700', color: C.text.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: C.background, borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 13,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    },
    inputRowInner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: C.background, borderRadius: 14,
        paddingHorizontal: 12, paddingVertical: 12,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    },
    input: { flex: 1, fontSize: 13, color: C.text.primary },

    benefits: { gap: 8, marginBottom: 20 },
    benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    benefitText: { fontSize: 12, color: C.text.secondary },

    signInBtn: {
        backgroundColor: C.primary, paddingVertical: 16, borderRadius: 40,
        alignItems: 'center', marginBottom: 16,
    },
    btnDisabled: { opacity: 0.7 },
    signInBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

    signUpBtn: { paddingVertical: 4, alignItems: 'center' },
    signUpBtnText: { fontSize: 14, color: C.text.secondary },
    signUpBtnAccent: { color: C.primary, fontWeight: '800' },

    // OTP screen
    otpContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        paddingHorizontal: 32, gap: 16,
    },
    otpEmoji: { fontSize: 64 },
    otpTitle: { fontSize: 26, fontWeight: '900', color: C.text.primary, textAlign: 'center' },
    otpSubtitle: { fontSize: 14, color: C.text.secondary, textAlign: 'center', lineHeight: 22 },
    otpInputWrapper: { width: '100%', marginTop: 8 },
    otpInput: {
        backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 18,
        fontSize: 28, fontWeight: '900', color: C.primary, letterSpacing: 12,
        borderWidth: 2, borderColor: C.primary,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    resendBtn: { paddingVertical: 4 },
    resendText: { fontSize: 14, color: C.primary, fontWeight: '700' },
    backBtn: { paddingVertical: 4 },
    backText: { fontSize: 14, color: C.text.secondary },
});
