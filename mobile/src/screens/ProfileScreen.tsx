import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, SafeAreaView, ScrollView,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { theme } from '../styles/theme';
import { likedPlansService } from '../services/planService';
import BentoCard from '../components/common/BentoCard';
import { MapPin, Heart, Star, Globe, LogOut, User, Edit3 } from 'lucide-react-native';

export default function ProfileScreen({ navigation }: any) {
    const { user, isLoaded: userLoaded } = useUser();
    const { getToken, signOut } = useAuth();
    const [likedPlans, setLikedPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'stats' | 'liked'>('stats');
    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        if (!userLoaded || !user) { setLoading(false); return; }

        const load = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const likedData = await likedPlansService.getLikedPlans(token);
                    setLikedPlans(likedData?.likedPlans || likedData?.data || []);
                }
            } catch { /* silently fail — user data from Clerk is enough */ }
            setLoading(false);
        };
        load();
    }, [userLoaded, user]);

    const handleSignOut = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out', style: 'destructive',
                onPress: async () => {
                    setSigningOut(true);
                    await signOut();
                    setSigningOut(false);
                },
            },
        ]);
    };

    if (!userLoaded || loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Adventure Seeker';
    const username = user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'traveler';
    const email = user?.primaryEmailAddress?.emailAddress || '';
    const avatarUrl = user?.imageUrl;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Sign Out button */}
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} disabled={signingOut}>
                    {signingOut
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <><LogOut size={14} color="#FFF" /><Text style={styles.signOutText}>Sign Out</Text></>
                    }
                </TouchableOpacity>

                {/* Profile Hero */}
                <View style={styles.hero}>
                    <View style={styles.avatarWrapper}>
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <User size={40} color="#FFF" />
                            </View>
                        )}
                        {/* Verified badge */}
                        {user?.primaryEmailAddress?.verification?.status === 'verified' && (
                            <View style={styles.verifiedBadge}>
                                <Text style={{ fontSize: 12 }}>✓</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>{fullName}</Text>
                    <Text style={styles.username}>@{username}</Text>
                    <Text style={styles.email}>{email}</Text>
                    {user?.createdAt && (
                        <View style={styles.joinedRow}>
                            <Star size={12} color={theme.colors.primary} />
                            <Text style={styles.joinedText}>
                                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
                        onPress={() => setActiveTab('stats')}
                    >
                        <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>Overview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
                        onPress={() => setActiveTab('liked')}
                    >
                        <Heart size={14} color={activeTab === 'liked' ? '#FFF' : theme.colors.text.primary} />
                        <Text style={[styles.tabText, activeTab === 'liked' && styles.tabTextActive]}>
                            Liked ({likedPlans.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'stats' ? (
                    <View style={styles.bentoGrid}>
                        <BentoCard style={styles.statCard}>
                            <Heart size={28} color="#FF4E6A" fill="#FF4E6A" />
                            <Text style={styles.statNumber}>{likedPlans.length}</Text>
                            <Text style={styles.statLabel}>Liked Trips</Text>
                        </BentoCard>
                        <BentoCard style={styles.statCard}>
                            <Star size={28} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.statNumber}>4.9</Text>
                            <Text style={styles.statLabel}>Avg Rating</Text>
                        </BentoCard>
                        <BentoCard style={styles.statCard}>
                            <Globe size={28} color={theme.colors.primary} />
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>Destinations</Text>
                        </BentoCard>
                        <BentoCard style={styles.statCard}>
                            <MapPin size={28} color={theme.colors.primary} />
                            <Text style={styles.statNumber}>5</Text>
                            <Text style={styles.statLabel}>Trips Planned</Text>
                        </BentoCard>
                    </View>
                ) : (
                    <View style={styles.likedList}>
                        {likedPlans.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Heart size={48} color={theme.colors.text.secondary} />
                                <Text style={styles.emptyText}>No liked trips yet.</Text>
                                <Text style={styles.emptySubText}>Search and heart plans to save them here.</Text>
                                <TouchableOpacity
                                    style={styles.searchNowBtn}
                                    onPress={() => navigation.navigate('Search')}
                                >
                                    <Text style={styles.searchNowText}>Search Destinations →</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            likedPlans.map((plan: any, idx: number) => (
                                <BentoCard
                                    key={plan._id || idx}
                                    style={styles.likedCard}
                                    onPress={() => navigation.navigate('Details', { plan })}
                                >
                                    {plan.image_url ? (
                                        <Image
                                            source={{ uri: plan.image_url }}
                                            style={styles.likedImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={[styles.likedImage, styles.imagePlaceholder]}>
                                            <Text style={{ fontSize: 32 }}>🌍</Text>
                                        </View>
                                    )}
                                    <View style={styles.likedOverlay} />
                                    <View style={styles.likedContent}>
                                        <Text style={styles.likedTitle} numberOfLines={2}>{plan.name}</Text>
                                        <Text style={styles.likedMeta}>📅 {plan.days} days</Text>
                                    </View>
                                </BentoCard>
                            ))
                        )}
                    </View>
                )}

                {/* Auth info card */}
                <BentoCard style={styles.authCard}>
                    <View style={styles.authCardHeader}>
                        <Text style={styles.authCardTitle}>🔒 Authentication</Text>
                        <View style={styles.authBadge}>
                            <Text style={styles.authBadgeText}>Clerk</Text>
                        </View>
                    </View>
                    <Text style={styles.authCardDesc}>
                        Your account is secured with Clerk. Tokens are stored securely on device.
                    </Text>
                    <View style={styles.authCardRow}>
                        <Text style={styles.authCardLabel}>Status</Text>
                        <View style={styles.authStatus}>
                            <View style={styles.authDot} />
                            <Text style={styles.authStatusText}>Verified & Active</Text>
                        </View>
                    </View>
                </BentoCard>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const C = theme.colors;
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    scroll: { paddingHorizontal: 20, paddingTop: 20 },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    signOutBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end',
        backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 40,
        marginBottom: 16,
    },
    signOutText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

    hero: { alignItems: 'center', marginBottom: 24 },
    avatarWrapper: { marginBottom: 14 },
    avatar: { width: 90, height: 90, borderRadius: 45 },
    avatarFallback: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute', bottom: 0, right: 0,
        width: 24, height: 24, borderRadius: 12, backgroundColor: '#22C55E',
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF',
    },
    name: { fontSize: 26, fontWeight: '900', color: C.text.primary },
    username: { fontSize: 14, color: C.text.secondary, marginTop: 2 },
    email: { fontSize: 12, color: C.text.secondary, marginTop: 4 },
    joinedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
    joinedText: { fontSize: 12, color: C.primary, fontWeight: '600' },

    tabs: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    tab: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
        paddingVertical: 12, borderRadius: 40, backgroundColor: '#FFF',
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    },
    tabActive: { backgroundColor: C.primary },
    tabText: { fontSize: 13, fontWeight: '700', color: C.text.primary },
    tabTextActive: { color: '#FFF' },

    bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    statCard: {
        width: '47%', aspectRatio: 1.1, justifyContent: 'center', alignItems: 'center',
    },
    statNumber: { fontSize: 30, fontWeight: '900', color: C.text.primary, marginTop: 8 },
    statLabel: { fontSize: 12, color: C.text.secondary, marginTop: 4, fontWeight: '600' },

    likedList: {},
    emptyBox: { alignItems: 'center', paddingVertical: 50 },
    emptyText: { fontSize: 18, fontWeight: '800', color: C.text.primary, marginTop: 16 },
    emptySubText: { fontSize: 13, color: C.text.secondary, marginTop: 6, textAlign: 'center' },
    searchNowBtn: {
        backgroundColor: C.primary, paddingVertical: 12, paddingHorizontal: 28,
        borderRadius: 40, marginTop: 16,
    },
    searchNowText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

    likedCard: { height: 200, padding: 0, marginBottom: 14, borderRadius: 28 },
    likedImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 28 },
    imagePlaceholder: { backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center' },
    likedOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.38)',
    },
    likedContent: { flex: 1, justifyContent: 'flex-end', padding: 18 },
    likedTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 4 },
    likedMeta: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

    authCard: { padding: 20, marginTop: 4, marginBottom: 10 },
    authCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    authCardTitle: { fontSize: 14, fontWeight: '800', color: C.text.primary },
    authBadge: {
        backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20,
    },
    authBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    authCardDesc: { fontSize: 12, color: C.text.secondary, lineHeight: 18, marginBottom: 12 },
    authCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    authCardLabel: { fontSize: 12, color: C.text.secondary },
    authStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    authDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
    authStatusText: { fontSize: 12, color: '#22C55E', fontWeight: '700' },
});
