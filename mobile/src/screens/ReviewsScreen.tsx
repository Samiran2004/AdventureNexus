import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    SafeAreaView, ActivityIndicator, TextInput, Alert, RefreshControl,
} from 'react-native';
import { theme } from '../styles/theme';
import { Star, ThumbsUp, Search, MapPin, Users, Clock, CheckCircle2, SlidersHorizontal, Image as ImageIcon, Plus } from 'lucide-react-native';
import { reviewService } from '../services/planService';
import BentoCard from '../components/common/BentoCard';
import { Image, ScrollView } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';

const TRIP_TYPES = ['All', 'Solo', 'Family', 'Couple', 'Adventure', 'Cultural', 'Business', 'Nature'];
const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Highest', value: 'highest' },
    { label: 'Helpful', value: 'helpful' },
];

function StarRating({ count }: { count: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star
                    key={n}
                    size={12}
                    color={n <= count ? theme.colors.star : '#D0D0D0'}
                    fill={n <= count ? theme.colors.star : 'transparent'}
                />
            ))}
        </View>
    );
}

export default function ReviewsScreen({ navigation }: any) {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [newLocation, setNewLocation] = useState('');
    const [newType, setNewType] = useState('Solo');
    const [refreshing, setRefreshing] = useState(false);

    const fetchReviews = async (reset = false, isRefreshing = false) => {
        try {
            if (isRefreshing) setRefreshing(true);
            else if (reset) setLoading(true);
            const params: any = {
                page: reset ? 1 : page,
                limit: 8,
                sortBy,
            };
            if (activeType !== 'All') params.category = activeType;
            if (search.trim()) params.search = search.trim();

            const data = await reviewService.getReviews(params);
            const list = data?.data || data?.reviews || [];

            if (reset) {
                setReviews(list);
                setPage(2);
            } else {
                setReviews(prev => [...prev, ...list]);
                setPage(p => p + 1);
            }
            setHasMore(list.length === 8);
        } catch {
            // silent
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => fetchReviews(true, true);

    useEffect(() => {
        fetchReviews(true);
    }, [activeType, sortBy]);

    const handleLike = async (id: string) => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Sign In', 'Please sign in to like reviews.');
                return;
            }
            await reviewService.likeReview(token, id);
            setReviews(prev =>
                prev.map(r => r._id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r)
            );
        } catch (error) {
            console.error("Like error:", error);
        }
    };

    const handleSubmitReview = async () => {
        if (!newComment.trim()) {
            Alert.alert('Missing Field', 'Please share your experience in the comment field.');
            return;
        }
        if (!newLocation.trim()) {
            Alert.alert('Missing Field', 'Please specify a location.');
            return;
        }

        try {
            setLoading(true); // Re-use loading or add a specific submitting state? Let's use loading for now to show global indicator or just a local one.
            const token = await getToken();
            if (!token || !user) {
                Alert.alert('Sign In', 'Please sign in to share a review.');
                setLoading(false);
                return;
            }

            const res = await reviewService.createReview(token, {
                rating: newRating,
                comment: newComment.trim(),
                location: newLocation.trim(),
                tripType: newType.toLowerCase() as any,
                userName: user.fullName || user.username || 'Traveler',
                userAvatar: user.imageUrl || '',
                userId: user.id || '',
                clerkUserId: user.id || '',
                tripDuration: '3 Days',
                travelers: '1',
            });

            if (res.success) {
                Alert.alert('Success ✨', 'Your journey has been shared!');
                setShowForm(false);
                setNewComment('');
                setNewLocation('');
                fetchReviews(true);
            } else {
                Alert.alert('Error', res.message || 'Failed to submit review.');
            }
        } catch (error: any) {
            console.error("Submit error:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit review.';
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderReview = ({ item, index }: any) => (
        <BentoCard style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={() => {
                        const cid = item.clerkUserId || item.userId;
                        if (cid) navigation.navigate('UserProfile', { clerkUserId: cid });
                    }}
                    activeOpacity={0.7}
                >
                    {item.userAvatar ? (
                        <Image source={{ uri: item.userAvatar }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>
                                {(item.userName || item.location || 'U')[0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                    {item.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <CheckCircle2 size={12} color="#FFF" />
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                        const cid = item.clerkUserId || item.userId;
                        if (cid) navigation.navigate('UserProfile', { clerkUserId: cid });
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.reviewerName}>{item.userName || 'Traveler'}</Text>
                    <View style={styles.metaRow}>
                        <MapPin size={10} color={theme.colors.text.secondary} />
                        <Text style={styles.reviewMeta}>{item.location}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.ratingBox}>
                    <StarRating count={item.rating} />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
            </View>

            {/* Achievement / Stats Badges */}
            <View style={styles.statsBadges}>
                <View style={styles.statBadge}>
                    <Clock size={10} color={theme.colors.primary} />
                    <Text style={styles.statBadgeText}>{item.tripDuration || '3 Days'}</Text>
                </View>
                <View style={styles.statBadge}>
                    <Users size={10} color={theme.colors.primary} />
                    <Text style={styles.statBadgeText}>{item.travelers || '2'} Travelers</Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}>
                    <Text style={[styles.statBadgeText, { color: '#0EA5E9' }]}>{item.tripType || 'Adventure'}</Text>
                </View>
            </View>

            <Text style={styles.reviewComment}>{item.comment}</Text>

            {/* Review Images */}
            {item.images && item.images.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                    {item.images.map((img: string, i: number) => (
                        <Image key={i} source={{ uri: img }} style={styles.reviewImage} />
                    ))}
                </ScrollView>
            )}

            <View style={styles.reviewFooter}>
                <TouchableOpacity style={styles.likeBtn} onPress={() => handleLike(item._id)}>
                    <ThumbsUp size={14} color={theme.colors.primary} />
                    <Text style={styles.likeBtnText}>{item.helpfulCount || 0} Helpful</Text>
                </TouchableOpacity>
                <Text style={styles.dateText}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</Text>
            </View>
        </BentoCard>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.heroSection}>
                <View style={styles.heroRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Traveler{'\n'}Community</Text>
                        <Text style={styles.subtitle}>Insights from fellow adventurers</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.writeBtn} onPress={() => setShowForm(v => !v)}>
                    <Text style={styles.writeBtnText}>{showForm ? 'Cancel' : 'Share Your Trip ✨'}</Text>
                </TouchableOpacity>
            </View>

            {/* Write Review Form */}
            {showForm && (
                <BentoCard style={styles.formCard}>
                    <Text style={styles.formLabel}>Location</Text>
                    <TextInput
                        style={styles.formInput}
                        placeholder="e.g. Paris, France"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={newLocation}
                        onChangeText={setNewLocation}
                    />
                    <Text style={styles.formLabel}>Rating</Text>
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <TouchableOpacity key={n} onPress={() => setNewRating(n)}>
                                <Star
                                    size={28}
                                    color={n <= newRating ? theme.colors.star : '#D0D0D0'}
                                    fill={n <= newRating ? theme.colors.star : 'transparent'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.formLabel}>Comment</Text>
                    <TextInput
                        style={[styles.formInput, styles.formTextArea]}
                        placeholder="Share your experience…"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                        numberOfLines={4}
                    />
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReview}>
                        <Text style={styles.submitBtnText}>Submit Review ✨</Text>
                    </TouchableOpacity>
                </BentoCard>
            )}

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Search size={16} color={theme.colors.text.secondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search reviews or locations…"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={() => fetchReviews(true)}
                    returnKeyType="search"
                />
            </View>

            {/* Category Pills */}
            <View style={styles.tagsRow}>
                {TRIP_TYPES.map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tag, activeType === t && styles.tagActive]}
                        onPress={() => setActiveType(t)}
                    >
                        <Text style={[styles.tagText, activeType === t && styles.tagTextActive]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sort */}
            <View style={styles.sortContainer}>
                <SlidersHorizontal size={14} color={theme.colors.text.secondary} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
                    {SORT_OPTIONS.map(s => (
                        <TouchableOpacity
                            key={s.value}
                            style={[styles.sortBtn, sortBy === s.value && styles.sortBtnActive]}
                            onPress={() => setSortBy(s.value)}
                        >
                            <Text style={[styles.sortText, sortBy === s.value && styles.sortTextActive]}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={(item, idx) => item._id || String(idx)}
                    renderItem={renderReview}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => { if (hasMore) fetchReviews(); }}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No reviews yet. Be the first! 🌍</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    heroSection: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
    heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    headerIllustration: { marginRight: -10 },
    title: { fontSize: 36, fontWeight: '900', color: theme.colors.text.primary, letterSpacing: -1 },
    subtitle: { fontSize: 14, color: theme.colors.text.secondary, marginTop: 4 },
    writeBtn: {
        backgroundColor: theme.colors.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center',
        shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    writeBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

    formCard: { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 24 },
    formLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 6, marginTop: 12 },
    formInput: {
        backgroundColor: theme.colors.accent, borderRadius: 12, padding: 12,
        fontSize: 14, color: theme.colors.text.primary,
    },
    formTextArea: { height: 90, textAlignVertical: 'top' },
    ratingRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
    submitBtn: { backgroundColor: theme.colors.primary, borderRadius: 40, padding: 14, alignItems: 'center', marginTop: 16 },
    submitBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 20,
        marginBottom: 16, gap: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    },
    searchInput: { flex: 1, fontSize: 14, color: theme.colors.text.primary, fontWeight: '500' },

    tagsRow: { flexDirection: 'row', paddingLeft: 20, marginBottom: 16, gap: 8 },
    tag: {
        paddingVertical: 10, paddingHorizontal: 20, borderRadius: 16,
        backgroundColor: '#FFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    },
    tagActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    tagText: { fontSize: 13, fontWeight: '600', color: theme.colors.text.primary },
    tagTextActive: { color: '#FFF' },

    sortContainer: { flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginBottom: 20, gap: 12 },
    sortScroll: { gap: 8, paddingRight: 20 },
    sortBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.03)' },
    sortBtnActive: { backgroundColor: theme.colors.secondary },
    sortText: { fontSize: 12, fontWeight: '600', color: theme.colors.text.primary },
    sortTextActive: { fontWeight: '800' },

    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { paddingHorizontal: 20, paddingBottom: 100 },
    emptyText: { textAlign: 'center', color: theme.colors.text.secondary, marginTop: 60, fontSize: 15 },

    reviewCard: { padding: 20, marginBottom: 16, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
    avatarContainer: { position: 'relative' },
    avatarImage: { width: 48, height: 48, borderRadius: 24 },
    avatarCircle: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: '#FFF', fontWeight: '800', fontSize: 18 },
    verifiedBadge: {
        position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9,
        backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF',
    },
    reviewerName: { fontSize: 16, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 2 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    reviewMeta: { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '500' },
    ratingBox: { alignItems: 'flex-end', gap: 4 },
    ratingText: { fontSize: 14, fontWeight: '800', color: theme.colors.text.primary },

    statsBadges: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
    statBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(26,60,52,0.05)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8
    },
    statBadgeText: { fontSize: 11, fontWeight: '700', color: theme.colors.primary },

    reviewComment: { fontSize: 14, color: theme.colors.text.primary, lineHeight: 22, marginBottom: 16, opacity: 0.9 },

    imagesScroll: { marginBottom: 16, marginHorizontal: -4 },
    reviewImage: { width: 120, height: 120, borderRadius: 16, marginHorizontal: 4 },

    reviewFooter: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)'
    },
    likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(26,60,52,0.08)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
    likeBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
    dateText: { fontSize: 11, color: theme.colors.text.secondary, fontWeight: '500' },
});
