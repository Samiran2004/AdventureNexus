import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, ActivityIndicator, Alert, ImageBackground,
    RefreshControl
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { theme } from '../styles/theme';
import { likedPlansService, communityService } from '../services/planService';
import BentoCard from '../components/common/BentoCard';
import { MapPin, Star, Globe, LogOut, User, Clock, Grid, List, Edit2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen({ navigation }: any) {
    const { user, isLoaded } = useUser();
    const { signOut, getToken } = useAuth();

    const [likedPlans, setLikedPlans] = useState<any[]>([]);
    const [savedPlans, setSavedPlans] = useState<any[]>([]);
    const [profileStats, setProfileStats] = useState<any>(null); // Added profileStats state
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState<'liked' | 'saved'>('liked');

    const fetchProfileAndPlans = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoadingPlans(true);
            const token = await getToken();
            if (token && user) {
                // Fetch real stats and saved plans from profile
                const profileRes = await communityService.getUserProfile(token, user.id);
                if (profileRes.success) {
                    setProfileStats(profileRes.data.profile);
                    setSavedPlans(profileRes.data.activity?.savedPlans || []);
                }

                // Fetch liked plans
                const plansRes = await likedPlansService.getLikedPlans(token);
                // The backend returns { success: true, likedPlans: [...] }
                setLikedPlans(plansRes.likedPlans || []);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoadingPlans(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProfileAndPlans(true);
    }, [user, isLoaded]);

    useEffect(() => {
        if (isLoaded && user) {
            fetchProfileAndPlans();
        }
    }, [isLoaded, user]);

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log Out", onPress: () => signOut(), style: "destructive" }
        ]);
    };

    if (!isLoaded || !user) return null;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {/* ─── 1. HEADER MASK (CURVED) ─────────────────────────────────── */}
                <View style={styles.headerContainer}>
                    <ImageBackground
                        source={{ uri: profileStats?.coverImage || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80' }}
                        style={styles.coverImage}
                        imageStyle={styles.coverImageStyle}
                        resizeMode="cover"
                    >
                        <View style={styles.headerOverlay} />
                        <View style={styles.navRow}>
                            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
                                <User size={20} color="#FFF" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    style={styles.headerBtn}
                                    onPress={() => navigation.navigate('EditProfile', { profile: profileStats })}
                                >
                                    <Edit2 size={18} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.headerBtn} onPress={handleSignOut}>
                                    <LogOut size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                {/* ─── 2. SQUIRCLE AVATAR (borderRadius: 40) ────────────────────── */}
                <View style={styles.avatarRow}>
                    <View style={styles.avatarWrapper}>
                        {user.imageUrl ? (
                            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <User size={40} color="#FFF" />
                            </View>
                        )}
                        <View style={styles.verifiedBadge}>
                            <Text style={{ fontSize: 9, color: '#FFF' }}>✓</Text>
                        </View>
                    </View>
                </View>

                {/* ─── 3. USER INFO ──────────────────────────────────────────────── */}
                <View style={styles.infoSection}>
                    <Text style={styles.name}>{user.fullName || user.username}</Text>
                    <View style={styles.locationRow}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.locationText}>{profileStats?.country || 'Traveler • Explorer'}</Text>
                    </View>
                    <Text style={styles.bioText}>{profileStats?.bio || 'Adventuring through the world one plan at a time. Nature lover & story seeker.'}</Text>
                </View>

                {/* ─── 4. USER STATS (Dividers & Space-Evenly) ──────────────────── */}
                <View style={styles.statsRow}>
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>{likedPlans.length}</Text>
                        <Text style={styles.statLab}>Plans</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>{profileStats?.followingCount || 0}</Text>
                        <Text style={styles.statLab}>Friends</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>{profileStats?.followersCount || 0}</Text>
                        <Text style={styles.statLab}>Followers</Text>
                    </View>
                </View>

                {/* ─── 5. GRID GALLERY (Activity Cards) ─────────────────────────── */}
                <View style={styles.gridSection}>
                    <View style={styles.gridHeader}>
                        <View style={styles.tabsWrapper}>
                            <TouchableOpacity
                                onPress={() => setActiveTab('liked')}
                                style={[styles.tabItem, activeTab === 'liked' && styles.activeTabItem]}
                            >
                                <Text style={[styles.gridTitle, activeTab === 'liked' ? styles.activeTabTitle : styles.inactiveTabTitle]}>Liked</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActiveTab('saved')}
                                style={[styles.tabItem, activeTab === 'saved' && styles.activeTabItem]}
                            >
                                <Text style={[styles.gridTitle, activeTab === 'saved' ? styles.activeTabTitle : styles.inactiveTabTitle]}>Saved</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewToggle}>
                            <TouchableOpacity onPress={() => setViewMode('list')}>
                                <List size={20} color={viewMode === 'list' ? '#1A3C34' : '#D1D5DB'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setViewMode('grid')}>
                                <Grid size={20} color={viewMode === 'grid' ? '#1A3C34' : '#D1D5DB'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loadingPlans ? (
                        <ActivityIndicator color="#1A3C34" />
                    ) : (activeTab === 'liked' ? likedPlans : savedPlans).length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No {activeTab} plans yet.</Text>
                        </View>
                    ) : (
                        <View style={viewMode === 'grid' ? styles.plansGrid : styles.plansList}>
                            {(activeTab === 'liked' ? likedPlans : savedPlans).map((plan: any, idx: number) => (
                                <TouchableOpacity
                                    key={plan._id || idx}
                                    style={viewMode === 'grid' ? styles.planCard : styles.planListItem}
                                    onPress={() => navigation.navigate('Details', { planId: plan._id, plan })}
                                >
                                    <Image
                                        source={{ uri: plan.image_url || plan.destinationImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' }}
                                        style={viewMode === 'grid' ? styles.planThumb : styles.listThumb}
                                    />
                                    {viewMode === 'grid' ? (
                                        <View style={styles.planCardOverlay}>
                                            <Text style={styles.planName} numberOfLines={1}>{plan.to || plan.name}</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.listContent}>
                                            <Text style={styles.listName}>{plan.to || plan.name}</Text>
                                            <View style={styles.listMeta}>
                                                <Clock size={12} color="#6B7280" />
                                                <Text style={styles.listMetaText}>Saved on {new Date(plan.createdAt || Date.now()).toLocaleDateString()}</Text>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7F0' },
    scroll: { flexGrow: 1 },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7F0' },

    // Header Mask
    headerContainer: {
        height: 240,
        borderBottomLeftRadius: 100,
        overflow: 'hidden',
        backgroundColor: '#1A3C34'
    },
    coverImage: { width: '100%', height: '100%' },
    coverImageStyle: { opacity: 0.9 },
    headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50 },
    headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

    // Avatar
    avatarRow: { alignItems: 'center', marginTop: -60, zIndex: 10 },
    avatarWrapper: {
        width: 120, height: 120,
        borderRadius: 40, // Modern Squircle
        backgroundColor: '#FFFFFF',
        padding: 5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
    },
    avatar: { width: '100%', height: '100%', borderRadius: 36 },
    avatarFallback: { flex: 1, backgroundColor: '#1A3C34', borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
    verifiedBadge: {
        position: 'absolute', bottom: -2, right: -2, width: 22, height: 22,
        borderRadius: 11, backgroundColor: theme.colors.success, borderWidth: 3, borderColor: '#FFF',
        justifyContent: 'center', alignItems: 'center',
    },

    // Info
    infoSection: { alignItems: 'center', marginTop: 15, paddingHorizontal: 40 },
    name: { fontSize: 24, fontWeight: '700', color: '#1A2421', letterSpacing: -0.5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    locationText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    bioText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 15, lineHeight: 20 },

    // Stats
    statsRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
        marginTop: 30, paddingVertical: 15,
    },
    statCol: { alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: '700', color: '#1A2421' },
    statLab: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 2 },
    divider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },

    // Grid Gallery
    gridSection: { marginTop: 20, paddingHorizontal: 20 },
    gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    tabsWrapper: { flexDirection: 'row', gap: 20, alignItems: 'center' },
    tabItem: { paddingBottom: 4 },
    activeTabItem: { borderBottomWidth: 2, borderBottomColor: '#1A3C34' },
    gridTitle: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    activeTabTitle: { color: '#1A2421' },
    inactiveTabTitle: { color: '#D1D5DB' },
    viewToggle: { flexDirection: 'row', gap: 12 },

    plansGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    plansList: { gap: 12 },
    planCard: {
        width: '48%',
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F2EB',
        marginBottom: 12
    },
    planThumb: { width: '100%', height: '100%', backgroundColor: '#F3F4F6' },
    planCardOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 12, backgroundColor: 'rgba(255,255,255,0.85)'
    },
    planName: { fontSize: 12, fontWeight: '700', color: '#1A2421', textAlign: 'center' },

    // List Styles
    planListItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F2EB',
    },
    listThumb: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F3F4F6' },
    listContent: { flex: 1, marginLeft: 15 },
    listName: { fontSize: 16, fontWeight: '700', color: '#1A2421' },
    listMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    listMetaText: { fontSize: 12, color: '#6B7280' },

    emptyContainer: { paddingVertical: 40, alignItems: 'center' },
    emptyText: { color: '#6B7280', fontSize: 14 },
});
