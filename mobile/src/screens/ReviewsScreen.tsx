import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    SafeAreaView, ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { Star, ThumbsUp, Search } from 'lucide-react-native';
import { reviewService } from '../services/planService';
import BentoCard from '../components/common/BentoCard';

const TRIP_TYPES = ['All', 'Solo', 'Family', 'Adventure', 'Romance', 'Group'];
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

export default function ReviewsScreen() {
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

    const fetchReviews = async (reset = false) => {
        try {
            if (reset) setLoading(true);
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
        }
    };

    useEffect(() => { fetchReviews(true); }, [activeType, sortBy]);

    const handleLike = async (id: string) => {
        try {
            await reviewService.likeReview('', id);
            setReviews(prev =>
                prev.map(r => r._id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r)
            );
        } catch { /* no auth handled */ }
    };

    const handleSubmitReview = async () => {
        if (!newComment.trim() || !newLocation.trim()) {
            Alert.alert('Missing Info', 'Please fill in comment and location.');
            return;
        }
        try {
            await reviewService.createReview('', {
                rating: newRating,
                comment: newComment.trim(),
                location: newLocation.trim(),
                tripType: newType,
            });
            Alert.alert('Success', 'Review submitted!');
            setShowForm(false);
            setNewComment(''); setNewLocation('');
            fetchReviews(true);
        } catch {
            Alert.alert('Error', 'Failed to submit review.');
        }
    };

    const renderReview = ({ item }: any) => (
        <BentoCard style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                        {(item.user?.username || item.location || 'U')[0].toUpperCase()}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.reviewerName}>{item.user?.username || 'Traveler'}</Text>
                    <Text style={styles.reviewMeta}>📍 {item.location}  •  🌍 {item.tripType}</Text>
                </View>
                <StarRating count={item.rating} />
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <TouchableOpacity style={styles.likeRow} onPress={() => handleLike(item._id)}>
                <ThumbsUp size={14} color={theme.colors.text.secondary} />
                <Text style={styles.likeCount}>{item.helpfulCount || 0} helpful</Text>
            </TouchableOpacity>
        </BentoCard>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Community{'\n'}Reviews</Text>
                <TouchableOpacity style={styles.writeBtn} onPress={() => setShowForm(v => !v)}>
                    <Text style={styles.writeBtnText}>{showForm ? 'Cancel' : '+ Write Review'}</Text>
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
            <View style={styles.sortRow}>
                {SORT_OPTIONS.map(s => (
                    <TouchableOpacity
                        key={s.value}
                        style={[styles.sortBtn, sortBy === s.value && styles.sortBtnActive]}
                        onPress={() => setSortBy(s.value)}
                    >
                        <Text style={[styles.sortText, sortBy === s.value && styles.sortTextActive]}>{s.label}</Text>
                    </TouchableOpacity>
                ))}
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
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingHorizontal: 20, paddingTop: 20, marginBottom: 16,
    },
    title: { fontSize: 32, fontWeight: '900', color: theme.colors.text.primary },
    writeBtn: {
        backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 40,
    },
    writeBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

    formCard: { marginHorizontal: 20, marginBottom: 16, padding: 16 },
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
        borderRadius: 40, paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 20,
        marginBottom: 14, gap: 10, elevation: 2,
    },
    searchInput: { flex: 1, fontSize: 14, color: theme.colors.text.primary },

    tagsRow: { flexDirection: 'row', paddingLeft: 20, marginBottom: 12, gap: 8 },
    tag: {
        paddingVertical: 8, paddingHorizontal: 16, borderRadius: 40,
        backgroundColor: '#FFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    },
    tagActive: { backgroundColor: theme.colors.primary },
    tagText: { fontSize: 12, fontWeight: '600', color: theme.colors.text.primary },
    tagTextActive: { color: '#FFF' },

    sortRow: { flexDirection: 'row', paddingLeft: 20, marginBottom: 16, gap: 8 },
    sortBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: theme.colors.accent },
    sortBtnActive: { backgroundColor: theme.colors.secondary },
    sortText: { fontSize: 12, fontWeight: '600', color: theme.colors.text.primary },
    sortTextActive: { fontWeight: '800' },

    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { paddingHorizontal: 20, paddingBottom: 100 },
    emptyText: { textAlign: 'center', color: theme.colors.text.secondary, marginTop: 60, fontSize: 15 },

    reviewCard: { padding: 18, marginBottom: 14, borderRadius: 28 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    avatarCircle: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    reviewerName: { fontSize: 14, fontWeight: '800', color: theme.colors.text.primary },
    reviewMeta: { fontSize: 11, color: theme.colors.text.secondary, marginTop: 2 },
    reviewComment: { fontSize: 13, color: theme.colors.text.primary, lineHeight: 20, marginBottom: 12 },
    likeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    likeCount: { fontSize: 12, color: theme.colors.text.secondary },
});
