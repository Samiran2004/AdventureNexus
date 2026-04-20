import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert, Platform, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';
import { MapPin, Search, Train, Ticket, Calendar, Users, Loader2, CheckCircle, Info, ArrowRight, ArrowLeft, X, User } from 'lucide-react-native';
import { trainService } from '../services/trainService';
import BentoCard from '../components/common/BentoCard';

const SEAT_CLASSES: Record<string, any> = {
    'First_AC':  { label: '1A (First AC)',  emoji: '🧊', fare: 2500, color: theme.colors.primary },
    'Second_AC': { label: '2A (Second AC)', emoji: '❄️', fare: 1500, color: theme.colors.secondary },
    'Third_AC':  { label: '3A (Third AC)',  emoji: '🏔️', fare: 1100, color: theme.colors.accent },
    'Sleeper':   { label: 'SL (Sleeper)',   emoji: '🛏️', fare: 450,  color: theme.colors.success },
    'General':   { label: 'GN (General)',   emoji: '💺', fare: 150,  color: theme.colors.text.secondary },
};

export default function TrainsScreen({ navigation }: any) {
    const { getToken, isSignedIn } = useAuth();
    const { user } = useUser();

    // Tabs
    const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');

    // Search state
    const [fromStation, setFromStation] = useState('New Delhi');
    const [fromCode, setFromCode] = useState('NDLS');
    const [toStation, setToStation] = useState('Howrah Junction');
    const [toCode, setToCode] = useState('HWH');
    const [journeyDate, setJourneyDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [passengers, setPassengers] = useState(1);

    // Results state
    const [trains, setTrains] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    // Modals
    const [bookingModal, setBookingModal] = useState<any>(null);
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    useEffect(() => {
        if (activeTab === 'bookings' && isSignedIn) {
            fetchMyBookings();
        }
    }, [activeTab, isSignedIn]);

    const fetchMyBookings = async () => {
        setLoadingBookings(true);
        try {
            const token = await getToken();
            if (token) {
                const res = await trainService.getMyBookings(token);
                setMyBookings(res.data || []);
            }
        } catch (e) {
            console.log('Error fetching bookings', e);
        }
        setLoadingBookings(false);
    };

    const handleSearch = async () => {
        if (!fromCode || !toCode) { Alert.alert('Error', 'Please enter stations'); return; }
        setSearching(true);
        setSearched(false);
        try {
            const token = await getToken() ?? '';
            const dd = String(journeyDate.getDate()).padStart(2, '0');
            const mm = String(journeyDate.getMonth() + 1).padStart(2, '0');
            const yyyy = journeyDate.getFullYear();
            const dateStr = `${dd}-${mm}-${yyyy}`;

            const res = await trainService.searchTrains(token, { from: fromCode, to: toCode, date: dateStr });
            setTrains(Array.isArray(res.data) ? res.data : []);
            setIsDemo(res.isDemo || false);
            setSearched(true);
        } catch (e) {
            Alert.alert('Error', 'Search failed');
            setTrains([]);
        }
        setSearching(false);
    };

    const swapStations = () => {
        const tempStation = fromStation;
        const tempCode = fromCode;
        setFromStation(toStation);
        setFromCode(toCode);
        setToStation(tempStation);
        setToCode(tempCode);
    };

    const handleCancelBooking = async (id: string) => {
        try {
            const token = await getToken();
            if (token) {
                await trainService.cancelBooking(token, id);
                fetchMyBookings();
                Alert.alert('Success', 'Booking cancelled successfully');
            }
        } catch (e) {
            Alert.alert('Error', 'Cancellation failed');
        }
    };

    const TrainCard = ({ train }: { train: any }) => (
        <BentoCard style={styles.trainCard}>
            <View style={styles.trainHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 24 }}>🚂</Text>
                    <View>
                        <Text style={styles.trainTitle}>{train.trainName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <Text style={styles.trainSubInfo}>#{train.trainNumber}</Text>
                            {train.type && <Text style={styles.trainTypeBadge}>{train.type}</Text>}
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.timelineRow}>
                <View style={styles.timelineTime}>
                    <Text style={styles.timelineMain}>{train.departureTime}</Text>
                    <Text style={styles.timelineSub}>{train.fromCode || train.from}</Text>
                </View>
                <View style={styles.timelineLineWrapper}>
                    <View style={styles.timelineConnectingLine} />
                    <Text style={styles.timelineDuration}>{train.duration}</Text>
                </View>
                <View style={[styles.timelineTime, { alignItems: 'flex-end' }]}>
                    <Text style={styles.timelineMain}>{train.arrivalTime}</Text>
                    <Text style={styles.timelineSub}>{train.toCode || train.to}</Text>
                </View>
            </View>

            <View style={styles.classesContainer}>
                {(train.classes || [{ class: 'General', fare: 300 }]).slice(0, 3).map((cls: any, i: number) => {
                    const cfg = SEAT_CLASSES[cls.class] || SEAT_CLASSES.General;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={styles.classBlock}
                            onPress={() => setBookingModal({ train, selectedClass: cls.class, defaultFare: cls.fare })}
                        >
                            <Text style={[styles.classHeader, { color: cfg.color }]}>{cfg.label.split(' ')[0]}</Text>
                            <Text style={styles.classFare}>₹{cls.fare}</Text>
                            <Text style={styles.classAction}>Book</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </BentoCard>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Train <Text style={styles.titleAccent}>Booking</Text></Text>
                    <Text style={styles.subtitle}>Real-time availability and smart booking</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity style={[styles.tab, activeTab === 'search' && styles.tabActive]} onPress={() => setActiveTab('search')}>
                            <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>🔍 Search Trains</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, activeTab === 'bookings' && styles.tabActive]} onPress={() => setActiveTab('bookings')}>
                            <Text style={[styles.tabText, activeTab === 'bookings' && styles.tabTextActive]}>🎫 My Bookings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'search' && (
                    <View>
                        {/* Search Module */}
                        <BentoCard style={styles.searchModule}>
                            <View style={styles.inputStack}>
                                <View style={styles.inputWrapper}>
                                    <View style={styles.iconCircle}><MapPin size={16} color={theme.colors.primary} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.inputLabel}>From Station</Text>
                                        <TextInput
                                            style={styles.inputField}
                                            value={fromStation}
                                            onChangeText={(v) => { setFromStation(v); setFromCode(v.substring(0, 4).toUpperCase()); }}
                                            placeholder="Station or Code"
                                            placeholderTextColor={theme.colors.text.secondary}
                                            autoCapitalize="sentences"
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.swapBtn} onPress={swapStations}>
                                    <Text style={{ transform: [{ rotate: '90deg' }], color: '#FFF', fontSize: 16 }}>⇄</Text>
                                </TouchableOpacity>

                                <View style={styles.inputWrapper}>
                                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(34,197,94,0.1)' }]}><MapPin size={16} color={theme.colors.success} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.inputLabel}>To Station</Text>
                                        <TextInput
                                            style={styles.inputField}
                                            value={toStation}
                                            onChangeText={(v) => { setToStation(v); setToCode(v.substring(0, 4).toUpperCase()); }}
                                            placeholder="Station or Code"
                                            placeholderTextColor={theme.colors.text.secondary}
                                            autoCapitalize="sentences"
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.filterRow}>
                                <TouchableOpacity style={styles.filterBox} onPress={() => setShowDatePicker(true)}>
                                    <Calendar size={18} color={theme.colors.text.secondary} />
                                    <View>
                                        <Text style={styles.filterLabel}>Journey Date</Text>
                                        <Text style={styles.filterValue}>{journeyDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.filterBox}>
                                    <Users size={18} color={theme.colors.text.secondary} />
                                    <View>
                                        <Text style={styles.filterLabel}>Passengers</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <TouchableOpacity onPress={() => setPassengers(Math.max(1, passengers - 1))} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                                <Text style={{ color: '#FFF', fontSize: 16 }}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.filterValue}>{passengers}</Text>
                                            <TouchableOpacity onPress={() => setPassengers(Math.min(6, passengers + 1))} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                                <Text style={{ color: '#FFF', fontSize: 16 }}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={journeyDate}
                                    mode="date"
                                    display="default"
                                    minimumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) setJourneyDate(selectedDate);
                                    }}
                                />
                            )}

                            <TouchableOpacity style={styles.primaryBtn} onPress={handleSearch} disabled={searching} activeOpacity={0.8}>
                                {searching ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <>
                                        <Search size={18} color="#FFF" />
                                        <Text style={styles.primaryBtnText}>Search Trains</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </BentoCard>

                        {/* Search Results */}
                        {searched && (
                            <View style={styles.resultsContainer}>
                                <View style={styles.resultsHeader}>
                                    <Text style={styles.resultsTitle}>{fromCode} → {toCode}</Text>
                                    <Text style={styles.resultsSubtitle}>{trains.length} trains found</Text>
                                </View>

                                {isDemo && (
                                    <View style={styles.demoWarning}>
                                        <Info size={14} color="#F59E0B" />
                                        <Text style={styles.demoWarningText}>Demo mode active. Add Live API keys in backend.</Text>
                                    </View>
                                )}

                                {trains.length === 0 ? (
                                    <BentoCard style={{ alignItems: 'center', padding: 30 }}>
                                        <Text style={{ color: theme.colors.text.secondary }}>No trains available for this route.</Text>
                                    </BentoCard>
                                ) : (
                                    trains.map((t, i) => <TrainCard key={i} train={t} />)
                                )}
                            </View>
                        )}
                        {!searched && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.sectionTitle}>Popular Routes</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
                                    {[
                                        { f: 'New Delhi', fc: 'NDLS', t: 'Howrah', tc: 'HWH' },
                                        { f: 'Mumbai', fc: 'BCT', t: 'Chennai', tc: 'MAS' },
                                        { f: 'Bengaluru', fc: 'SBC', t: 'New Delhi', tc: 'NDLS' }
                                    ].map((r, i) => (
                                        <TouchableOpacity key={i} style={styles.popularBadge} onPress={() => {
                                            setFromStation(r.f); setFromCode(r.fc);
                                            setToStation(r.t); setToCode(r.tc);
                                        }}>
                                            <Text style={styles.popularBadgeText}>{r.fc} → {r.tc}</Text>
                                            <Text style={styles.popularBadgeSub}>{r.f} - {r.t}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'bookings' && (
                    <View style={styles.resultsContainer}>
                        {!isSignedIn ? (
                            <BentoCard style={{ alignItems: 'center', padding: 40 }}>
                                <Train size={48} color={theme.colors.text.secondary} style={{ marginBottom: 16 }} />
                                <Text style={{ color: theme.colors.text.primary, fontSize: 16, fontWeight: 'bold' }}>Sign In Required</Text>
                                <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginTop: 8 }}>Please sign in to view your bookings.</Text>
                            </BentoCard>
                        ) : loadingBookings ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
                        ) : myBookings.length === 0 ? (
                            <BentoCard style={{ alignItems: 'center', padding: 40 }}>
                                <Ticket size={48} color={theme.colors.text.secondary} style={{ marginBottom: 16 }} />
                                <Text style={{ color: theme.colors.text.primary, fontSize: 16, fontWeight: 'bold' }}>No Bookings Yet</Text>
                                <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginTop: 8 }}>Your train tickets will appear here.</Text>
                            </BentoCard>
                        ) : (
                            myBookings.map((b) => (
                                <BentoCard key={b._id} style={{ marginBottom: 16, padding: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <View>
                                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>{b.trainName}</Text>
                                            <Text style={{ color: theme.colors.primary, fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 4 }}>PNR: {b.pnrNumber}</Text>
                                        </View>
                                        <View style={{ backgroundColor: b.status === 'Confirmed' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }}>
                                            <Text style={{ color: b.status === 'Confirmed' ? theme.colors.success : theme.colors.error, fontSize: 11, fontWeight: '700' }}>{b.status}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12 }}>
                                        <View>
                                            <Text style={{ color: theme.colors.text.secondary, fontSize: 11 }}>From</Text>
                                            <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600', marginTop: 2 }}>{b.fromStationCode || 'SRC'}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={{ color: theme.colors.text.secondary, fontSize: 11 }}>To</Text>
                                            <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600', marginTop: 2 }}>{b.toStationCode || 'NDLS'}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ color: theme.colors.text.secondary, fontSize: 11 }}>Journey Date: {new Date(b.journeyDate).toLocaleDateString('en-IN')}</Text>
                                            <Text style={{ color: theme.colors.text.secondary, fontSize: 11 }}>Fare: ₹{b.fareAmount} • Class: {SEAT_CLASSES[b.seatClass]?.label || b.seatClass}</Text>
                                        </View>
                                        {b.status === 'Confirmed' && (
                                            <TouchableOpacity onPress={() => handleCancelBooking(b._id)} style={{ padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                                                <Text style={{ color: theme.colors.error, fontSize: 12, fontWeight: '600' }}>Cancel</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </BentoCard>
                            ))
                        )}
                    </View>
                )}
                
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Booking Modal Helper Component */}
            <BookingFlowModal 
                visible={!!bookingModal} 
                data={bookingModal} 
                onClose={() => setBookingModal(null)} 
                passengers={passengers} 
                journeyDate={journeyDate}
                onSuccess={() => { setBookingModal(null); setActiveTab('bookings'); }}
            />
        </SafeAreaView>
    );
}

// ─── Booking Flow Modal ────────────────────────────────────────────────────────
function BookingFlowModal({ visible, data, onClose, passengers, journeyDate, onSuccess }: any) {
    const { getToken, isSignedIn } = useAuth();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [loading, setLoading] = useState(false);

    if (!visible || !data) return null;

    const totalFare = data.defaultFare * passengers;

    const handleBook = async () => {
        if (!isSignedIn) { Alert.alert('Error', 'Please sign in to book'); return; }
        if (!name || !age) { Alert.alert('Error', 'Please fill name and age'); return; }
        
        setLoading(true);
        try {
            const token = await getToken() ?? '';
            const payload = {
                passengerName: name,
                passengerAge: parseInt(age),
                passengerGender: gender,
                trainNumber: data.train.trainNumber,
                trainName: data.train.trainName,
                fromStation: data.train.fromName || data.train.from,
                fromStationCode: data.train.from,
                toStation: data.train.toName || data.train.to,
                toStationCode: data.train.to,
                journeyDate: journeyDate.toISOString(),
                departureTime: data.train.departureTime,
                arrivalTime: data.train.arrivalTime,
                seatClass: data.selectedClass,
                passengersCount: passengers,
                fareAmount: totalFare
            };
            
            await trainService.bookTicket(token, payload);
            Alert.alert('Success 🎉', 'Your ticket has been booked successfully!');
            onSuccess();
        } catch (e: any) {
            Alert.alert('Booking Failed', e?.response?.data?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                    <Text style={{ fontSize: 18, color: '#FFF', fontWeight: 'bold' }}>Book Ticket</Text>
                    <TouchableOpacity onPress={onClose}><X size={24} color="#FFF" /></TouchableOpacity>
                </View>
                
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {step === 1 ? (
                        <View>
                            <Text style={{ color: theme.colors.text.secondary, marginBottom: 20 }}>Step 1: Passenger Details</Text>
                            
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: theme.colors.text.primary, marginBottom: 8, fontSize: 12 }}>Full Name *</Text>
                                <TextInput style={styles.modalInput} value={name} onChangeText={setName} placeholder="Enter name" placeholderTextColor={theme.colors.text.secondary} />
                            </View>
                            
                            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.text.primary, marginBottom: 8, fontSize: 12 }}>Age *</Text>
                                    <TextInput style={styles.modalInput} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" placeholderTextColor={theme.colors.text.secondary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.text.primary, marginBottom: 8, fontSize: 12 }}>Gender *</Text>
                                    {/* Simple toggle for gender */}
                                    <TouchableOpacity 
                                        style={[styles.modalInput, { justifyContent: 'center' }]} 
                                        onPress={() => setGender(gender === 'Male' ? 'Female' : gender === 'Female' ? 'Other' : 'Male')}
                                    >
                                        <Text style={{ color: '#FFF' }}>{gender}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <TouchableOpacity style={styles.primaryBtn} onPress={() => {
                                if(!name || !age) { Alert.alert('Error', 'Fill required fields'); return; }
                                setStep(2);
                            }}>
                                <Text style={styles.primaryBtnText}>Continue to Review</Text>
                                <ArrowRight size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <Text style={{ color: theme.colors.text.secondary, marginBottom: 20 }}>Step 2: Review & Confirm</Text>
                            
                            <BentoCard style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, marginBottom: 20 }}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>{data.train.trainName}</Text>
                                <Text style={{ color: theme.colors.primary, fontSize: 12, marginTop: 4 }}>{data.train.from} → {data.train.to}</Text>
                                
                                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 }} />
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ color: theme.colors.text.secondary, fontSize: 13 }}>Passenger</Text>
                                    <Text style={{ color: '#FFF', fontSize: 13 }}>{name} ({age}, {gender.charAt(0)})</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ color: theme.colors.text.secondary, fontSize: 13 }}>Date</Text>
                                    <Text style={{ color: '#FFF', fontSize: 13 }}>{journeyDate.toLocaleDateString()}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ color: theme.colors.text.secondary, fontSize: 13 }}>Class</Text>
                                    <Text style={{ color: '#FFF', fontSize: 13 }}>{SEAT_CLASSES[data.selectedClass]?.label || data.selectedClass}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ color: theme.colors.text.secondary, fontSize: 13 }}>Ticket Count</Text>
                                    <Text style={{ color: '#FFF', fontSize: 13 }}>{passengers}</Text>
                                </View>
                                
                                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 }} />
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Total Fare</Text>
                                    <Text style={{ color: theme.colors.success, fontSize: 18, fontWeight: '900' }}>₹{totalFare}</Text>
                                </View>
                            </BentoCard>
                            
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]} onPress={() => setStep(1)}>
                                    <ArrowLeft size={18} color="#FFF" />
                                    <Text style={styles.primaryBtnText}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.primaryBtn, { flex: 2, backgroundColor: theme.colors.success }]} onPress={handleBook} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : (
                                        <>
                                            <CheckCircle size={18} color="#FFF" />
                                            <Text style={styles.primaryBtnText}>Pay & Book</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    
    header: { marginBottom: 20 },
    title: { fontSize: 32, fontWeight: '900', color: theme.colors.text.primary },
    titleAccent: { color: theme.colors.primary },
    subtitle: { fontSize: 14, color: theme.colors.text.secondary, marginTop: 4 },
    
    tabsWrapper: { marginBottom: 20, alignItems: 'center' },
    tabsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 30, padding: 4 },
    tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30 },
    tabActive: { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOffset: { width:0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
    tabText: { color: theme.colors.text.secondary, fontSize: 13, fontWeight: '600' },
    tabTextActive: { color: '#FFF', fontWeight: '800' },
    
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12 },
    
    searchModule: { padding: 16, backgroundColor: 'rgba(30,41,59,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    inputStack: { gap: 12, position: 'relative' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12, gap: 12 },
    iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(99,102,241,0.1)', alignItems: 'center', justifyContent: 'center' },
    inputLabel: { fontSize: 11, color: theme.colors.text.secondary, fontWeight: '600', marginBottom: 2 },
    inputField: { color: '#FFF', fontSize: 15, fontWeight: '700', padding: 0 },
    
    swapBtn: { position: 'absolute', right: 20, top: '50%', marginTop: -18, width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 10, borderWidth: 3, borderColor: '#1E293B' },
    
    filterRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 20 },
    filterBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12, gap: 10 },
    filterLabel: { fontSize: 11, color: theme.colors.text.secondary, marginBottom: 2 },
    filterValue: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    
    primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: theme.colors.primary, paddingVertical: 14, borderRadius: 100 },
    primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    
    resultsContainer: { marginTop: 10 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
    resultsTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    resultsSubtitle: { fontSize: 13, color: theme.colors.text.secondary },
    
    demoWarning: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: 'rgba(245,158,11,0.1)', padding: 10, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
    demoWarningText: { color: '#FCD34D', fontSize: 11 },
    
    trainCard: { padding: 16, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    trainHeader: { marginBottom: 16 },
    trainTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    trainSubInfo: { color: theme.colors.primary, fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold' },
    trainTypeBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, color: 'rgba(255,255,255,0.7)', fontSize: 10 },
    
    timelineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    timelineTime: { flex: 1 },
    timelineMain: { color: '#FFF', fontSize: 18, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    timelineSub: { color: theme.colors.text.secondary, fontSize: 11, marginTop: 2 },
    timelineLineWrapper: { flex: 2, alignItems: 'center', justifyContent: 'center', height: 20 },
    timelineConnectingLine: { position: 'absolute', height: 2, width: '100%', backgroundColor: 'rgba(99,102,241,0.3)' },
    timelineDuration: { backgroundColor: '#1E293B', paddingHorizontal: 8, color: theme.colors.text.secondary, fontSize: 10, zIndex: 2 },
    
    classesContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    classBlock: { flex: 1, minWidth: '30%', backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
    classHeader: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
    classFare: { color: '#FFF', fontSize: 15, fontWeight: '800', marginBottom: 6 },
    classAction: { color: theme.colors.primary, fontSize: 11, fontWeight: '600' },
    
    popularBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    popularBadgeText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
    popularBadgeSub: { color: theme.colors.text.secondary, fontSize: 11 },
    
    modalInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
});
