import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, ActivityIndicator, Alert, ImageBackground
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { theme } from '../styles/theme';
import { communityService } from '../services/planService';
import BentoCard from '../components/common/BentoCard';
import { MapPin, Star, Globe, ChevronLeft, UserPlus, UserMinus, MessageSquare, Grid, List } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function UserProfileScreen({ route, navigation }: any) {
    const { clerkUserId } = route.params;
    const { getToken } = useAuth();

    const [profile, setProfile] = useState<any>(null);
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [togglingFollow, setTogglingFollow] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchProfile = async () => {
        try {
            const token = await getToken();
            if (token) {
                const res = await communityService.getUserProfile(token, clerkUserId);
                if (res.success) {
                    setProfile(res.data.profile);
                    setActivity(res.data.activity);
                }
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            Alert.alert("Error", "Could not load user profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [clerkUserId]);

    const handleToggleFollow = async () => {
        try {
            setTogglingFollow(true);
            const token = await getToken();
            if (token) {
                const res = await communityService.toggleFollow(token, clerkUserId);
                if (res.success) {
                    setProfile((prev: any) => ({
                        ...prev,
                        isFollowing: res.data.isFollowing,
                        followersCount: res.data.isFollowing
                            ? prev.followersCount + 1
                            : prev.followersCount - 1
                    }));
                } else {
                    Alert.alert("Error", res.message || "Failed to update follow status.");
                }
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update follow status.";
            Alert.alert("Error", errorMsg);
        } finally {
            setTogglingFollow(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#1A3C34" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorBox}>
                <Text style={styles.errorText}>User not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* ─── 1. HEADER MASK (CURVED) ─────────────────────────────────── */}
                <View style={styles.headerContainer}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80' }}
                        style={styles.coverImage}
                        imageStyle={styles.coverImageStyle}
                        resizeMode="cover"
                    >
                        <View style={styles.headerOverlay} />
                        <View style={styles.navRow}>
                            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
                                <ChevronLeft size={24} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerBtn}>
                                <Star size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                {/* ─── 2. SQUIRCLE AVATAR (borderRadius: 40) ────────────────────── */}
                <View style={styles.avatarRow}>
                    <View style={styles.avatarWrapper}>
                        {profile.profilepicture ? (
                            <Image source={{ uri: profile.profilepicture }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitial}>
                                    {(profile.fullname || profile.username || 'T')[0].toUpperCase()}
                                </Text>
                            </View>
                        )}
                        {profile.isVerified && (
                            <View style={styles.verifiedBadge}>
                                <Text style={{ fontSize: 9, color: '#FFF' }}>✓</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* ─── 3. USER INFO ──────────────────────────────────────────────── */}
                <View style={styles.infoSection}>
                    <Text style={styles.name}>{profile.fullname || 'Traveler'}</Text>
                    <View style={styles.locationRow}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.locationText}>{profile.location || 'Explorer'}</Text>
                    </View>
                    <Text style={styles.bioText}>{profile.bio || 'Adventures are calling...'}</Text>

                    {/* Follow / Message Row */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[
                                styles.followBtn,
                                profile.isFollowing && styles.unfollowBtn
                            ]}
                            onPress={handleToggleFollow}
                            disabled={togglingFollow}
                        >
                            {togglingFollow ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <>
                                    {profile.isFollowing ? (
                                        <><UserMinus size={18} color="#FFF" /><Text style={styles.followBtnText}>Unfollow</Text></>
                                    ) : (
                                        <><UserPlus size={18} color="#FFF" /><Text style={styles.followBtnText}>Follow</Text></>
                                    )}
                                </>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.messageBtn}>
                            <MessageSquare size={18} color="#1A3C34" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── 4. USER STATS (Dividers & Space-Evenly) ──────────────────── */}
                <View style={styles.statsRow}>
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>{profile.followersCount}</Text>
                        <Text style={styles.statLab}>Followers</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>{profile.followingCount}</Text>
                        <Text style={styles.statLab}>Friends</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>{activity?.savedPlans?.length || 0}</Text>
                        <Text style={styles.statLab}>Trips</Text>
                    </View>
                </View>

                {/* ─── 5. ACTIVITY SECTION (Bento Gallery Style) ────────────────── */}
                <View style={styles.gridSection}>
                    <View style={styles.gridHeader}>
                        <Text style={styles.gridTitle}>Saved Plans</Text>
                        <View style={styles.viewToggle}>
                            <TouchableOpacity onPress={() => setViewMode('list')}>
                                <List size={20} color={viewMode === 'list' ? '#1A3C34' : '#D1D5DB'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setViewMode('grid')}>
                                <Grid size={20} color={viewMode === 'grid' ? '#1A3C34' : '#D1D5DB'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!activity?.savedPlans || activity.savedPlans.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No saved plans yet.</Text>
                        </View>
                    ) : (
                        <View style={styles.activityList}>
                            {activity.savedPlans.map((plan: any, idx: number) => (
                                <BentoCard
                                    key={plan._id || idx}
                                    style={styles.activityCard}
                                    onPress={() => navigation.navigate('Details', { plan })}
                                >
                                    <View style={styles.activityHead}>
                                        <View style={styles.iconBox}>
                                            <Globe size={14} color="#1A3C34" />
                                        </View>
                                        <Text style={styles.activityType}>{plan.name}</Text>
                                        <Text style={styles.activityDate}>{new Date(plan.createdAt).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={styles.activityText} numberOfLines={3}>{plan.destination_overview}</Text>
                                </BentoCard>
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
    errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { fontSize: 18, color: '#6B7280', marginBottom: 20 },
    backBtn: { backgroundColor: '#1A3C34', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
    backBtnText: { color: '#FFF', fontWeight: '700' },

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
    avatarInitial: { color: '#FFF', fontSize: 36, fontWeight: '900' },
    verifiedBadge: {
        position: 'absolute', bottom: -2, right: -2, width: 22, height: 22,
        borderRadius: 11, backgroundColor: '#4ADE80', borderWidth: 3, borderColor: '#FFF',
        justifyContent: 'center', alignItems: 'center',
    },

    // Info
    infoSection: { alignItems: 'center', marginTop: 15, paddingHorizontal: 40 },
    name: { fontSize: 24, fontWeight: '700', color: '#1A2421', letterSpacing: -0.5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    locationText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    bioText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 15, lineHeight: 20 },

    // Actions
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
    followBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#1A3C34', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16,
        shadowColor: '#1A3C34', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    unfollowBtn: { backgroundColor: '#FF4E6A', shadowColor: '#FF4E6A' },
    followBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
    messageBtn: {
        width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(26,60,52,0.1)',
        justifyContent: 'center', alignItems: 'center'
    },

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
    gridTitle: { fontSize: 13, fontWeight: '800', color: '#1A2421', textTransform: 'uppercase', letterSpacing: 1 },
    viewToggle: { flexDirection: 'row', gap: 12 },

    activityList: { gap: 12 },
    activityCard: { padding: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F0F2EB' },
    activityHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    iconBox: { width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(26,60,52,0.08)', justifyContent: 'center', alignItems: 'center' },
    activityType: { fontSize: 12, fontWeight: '800', color: '#1A2421', flex: 1 },
    activityDate: { fontSize: 10, color: '#6B7280' },
    activityText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },

    emptyContainer: { paddingVertical: 40, alignItems: 'center' },
    emptyText: { color: '#6B7280', fontSize: 14 },
});
