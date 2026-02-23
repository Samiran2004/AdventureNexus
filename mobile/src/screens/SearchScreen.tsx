import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, SafeAreaView, Image,
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { theme } from '../styles/theme';
import { MapPin, Plane, Calendar, Users, DollarSign, Search, Star, Heart } from 'lucide-react-native';
import { planService, likedPlansService } from '../services/planService';
import BentoCard from '../components/common/BentoCard';

const BUDGET_OPTIONS = [
    { label: 'Budget', value: 'budget', limit: 25000 },
    { label: 'Mid-range', value: 'mid', limit: 65000 },
    { label: 'Luxury', value: 'luxury', limit: 200000 },
];

const TRAVELER_OPTIONS = ['1', '2', '3', '4+'];

export default function SearchScreen({ navigation }: any) {
    const { getToken } = useAuth();
    const [to, setTo] = useState('');
    const [from, setFrom] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [travelers, setTravelers] = useState('2');
    const [budget, setBudget] = useState('mid');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

    const handleSearch = async () => {
        if (!to.trim() || !from.trim() || !departDate.trim()) {
            Alert.alert('Missing Info', 'Please fill in destination, origin, and departure date.');
            return;
        }

        try {
            setIsLoading(true);
            setResults([]);

            const start = new Date(departDate);
            const end = returnDate ? new Date(returnDate) : new Date(start.getTime() + 7 * 86400000);
            const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
            const budgetLimit = BUDGET_OPTIONS.find(b => b.value === budget)?.limit ?? 65000;

            const token = await getToken() ?? '';
            const data = await planService.searchDestination(token, {
                to: to.trim(),
                from: from.trim(),
                date: departDate,
                travelers: isNaN(parseInt(travelers)) ? 2 : parseInt(travelers),
                budget: budgetLimit,
                budget_range: budget,
                duration,
            });

            if (data?.data) {
                setResults(Array.isArray(data.data) ? data.data : [data.data]);
            } else {
                Alert.alert('No Results', 'No plans found. Try a different search.');
            }
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to generate plan. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLike = (id: string) => {
        setLikedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const renderResult = ({ item }: any) => (
        <BentoCard
            style={styles.resultCard}
            onPress={() => navigation.navigate('Details', { plan: item })}
        >
            {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.resultImage} resizeMode="cover" />
            ) : (
                <View style={[styles.resultImage, styles.imagePlaceholder]}>
                    <Text style={styles.placeholderEmoji}>🌍</Text>
                </View>
            )}
            <View style={styles.resultOverlay} />

            {/* Heart button */}
            <TouchableOpacity style={styles.heartBtn} onPress={() => toggleLike(item._id || item.name)}>
                <Heart
                    size={18}
                    color={likedIds.has(item._id || item.name) ? '#FF4E6A' : '#FFF'}
                    fill={likedIds.has(item._id || item.name) ? '#FF4E6A' : 'transparent'}
                />
            </TouchableOpacity>

            {/* AI Score badge */}
            {item.ai_score != null && (
                <View style={styles.scoreBadge}>
                    <Star size={10} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.scoreText}>{item.ai_score}</Text>
                </View>
            )}

            <View style={styles.resultContent}>
                <Text style={styles.resultTitle} numberOfLines={2}>{item.name}</Text>
                <View style={styles.resultStats}>
                    <Text style={styles.resultStat}>📅 {item.days} days</Text>
                    {item.cost != null && (
                        <Text style={styles.resultStat}>💰 ${item.cost?.toLocaleString()}</Text>
                    )}
                </View>
                {item.destination_overview ? (
                    <Text style={styles.resultOverview} numberOfLines={2}>{item.destination_overview}</Text>
                ) : null}
            </View>
        </BentoCard>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>✨ Find Your</Text>
                    <Text style={styles.titleAccent}>Adventure</Text>
                    <Text style={styles.subtitle}>AI-powered trip planning just for you</Text>
                </View>

                {/* Search Form */}
                <BentoCard style={styles.formCard}>
                    {/* Where to */}
                    <View style={styles.fieldRow}>
                        <MapPin size={16} color={theme.colors.primary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Where to? (e.g. Kyoto, Japan)"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={to}
                            onChangeText={setTo}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Where from */}
                    <View style={styles.fieldRow}>
                        <Plane size={16} color={theme.colors.primary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Where from? (e.g. London, UK)"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={from}
                            onChangeText={setFrom}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Departure date */}
                    <View style={styles.fieldRow}>
                        <Calendar size={16} color={theme.colors.primary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Departure date (YYYY-MM-DD)"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={departDate}
                            onChangeText={setDepartDate}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Return date */}
                    <View style={styles.fieldRow}>
                        <Calendar size={16} color={theme.colors.text.secondary} />
                        <TextInput
                            style={styles.input}
                            placeholder="Return date (YYYY-MM-DD)"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={returnDate}
                            onChangeText={setReturnDate}
                        />
                    </View>

                    {/* Travelers */}
                    <Text style={styles.fieldLabel}>
                        <Users size={13} color={theme.colors.primary} /> Travelers
                    </Text>
                    <View style={styles.pillRow}>
                        {TRAVELER_OPTIONS.map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.optionPill, travelers === t && styles.optionPillActive]}
                                onPress={() => setTravelers(t)}
                            >
                                <Text style={[styles.optionPillText, travelers === t && styles.optionPillTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Budget */}
                    <Text style={styles.fieldLabel}>
                        <DollarSign size={13} color={theme.colors.primary} /> Budget Range
                    </Text>
                    <View style={styles.pillRow}>
                        {BUDGET_OPTIONS.map(b => (
                            <TouchableOpacity
                                key={b.value}
                                style={[styles.optionPill, budget === b.value && styles.optionPillActive]}
                                onPress={() => setBudget(b.value)}
                            >
                                <Text style={[styles.optionPillText, budget === b.value && styles.optionPillTextActive]}>{b.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Search Button */}
                    <TouchableOpacity
                        style={[styles.searchBtn, isLoading && styles.searchBtnDisabled]}
                        onPress={handleSearch}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <View style={styles.searchBtnContent}>
                                <Search size={18} color="#FFF" />
                                <Text style={styles.searchBtnText}>Search with AI ✨</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </BentoCard>

                {/* Loading */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Finding your perfect adventure…</Text>
                    </View>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <View style={styles.resultsSection}>
                        <Text style={styles.resultsTitle}>
                            {results.length} Plan{results.length > 1 ? 's' : ''} Found
                        </Text>
                        {results.map((item, idx) => (
                            <View key={idx}>{renderResult({ item })}</View>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

    header: { marginBottom: 24 },
    title: { fontSize: 38, fontWeight: '900', color: theme.colors.text.primary, lineHeight: 40 },
    titleAccent: { fontSize: 38, fontWeight: '900', color: theme.colors.primary, lineHeight: 40 },
    subtitle: { fontSize: 14, color: theme.colors.text.secondary, marginTop: 6 },

    formCard: { padding: 20, marginBottom: 20 },
    fieldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
    input: { flex: 1, fontSize: 14, color: theme.colors.text.primary, fontWeight: '500' },
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 2 },

    fieldLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.text.primary, marginTop: 16, marginBottom: 10 },
    pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
    optionPill: {
        paddingVertical: 8, paddingHorizontal: 18, borderRadius: 40,
        backgroundColor: theme.colors.accent, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    },
    optionPillActive: { backgroundColor: theme.colors.primary },
    optionPillText: { fontSize: 13, fontWeight: '600', color: theme.colors.text.primary },
    optionPillTextActive: { color: '#FFF' },

    searchBtn: {
        backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 40,
        alignItems: 'center', marginTop: 20,
    },
    searchBtnDisabled: { opacity: 0.7 },
    searchBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    searchBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

    loadingContainer: { alignItems: 'center', paddingVertical: 30 },
    loadingText: { marginTop: 12, color: theme.colors.text.secondary, fontSize: 14 },

    resultsSection: { marginTop: 8 },
    resultsTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 16 },

    resultCard: { height: 260, padding: 0, marginBottom: 16, borderRadius: 32 },
    resultImage: { width: '100%', height: '100%', position: 'absolute', borderRadius: 32 },
    imagePlaceholder: { backgroundColor: theme.colors.accent, justifyContent: 'center', alignItems: 'center' },
    placeholderEmoji: { fontSize: 48 },
    resultOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    heartBtn: {
        position: 'absolute', top: 16, right: 16,
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center',
    },
    scoreBadge: {
        position: 'absolute', top: 16, left: 16,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,0,0,0.4)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20,
    },
    scoreText: { fontSize: 11, color: '#FFD700', fontWeight: '800' },
    resultContent: { flex: 1, justifyContent: 'flex-end', padding: 20 },
    resultTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
    resultStats: { flexDirection: 'row', gap: 14, marginBottom: 6 },
    resultStat: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
    resultOverview: { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 17 },
});
