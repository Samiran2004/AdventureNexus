import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, ScrollView,
    TouchableOpacity, ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { theme } from '../styles/theme';
import { communityService } from '../services/planService';
import { ChevronLeft, Camera, Check, User, MapPin, Globe, AlignLeft } from 'lucide-react-native';

export default function EditProfileScreen({ route, navigation }: any) {
    const { profile } = route.params || {};
    const { user } = useUser();
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [coverImage, setCoverImage] = useState(profile?.coverImage || '');
    const [country, setCountry] = useState(profile?.country || '');
    const [phonenumber, setPhonenumber] = useState(profile?.phonenumber?.toString() || '');

    const handleSave = async () => {
        if (!firstName.trim()) {
            Alert.alert("Error", "First name is required.");
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();
            if (!token) return;

            const updateData = {
                firstName,
                lastName,
                fullname: `${firstName} ${lastName}`.trim(),
                bio,
                coverImage,
                country,
                phonenumber: phonenumber ? parseInt(phonenumber) : null
            };

            const res = await communityService.updateProfile(token, updateData);

            if (res.success) {
                Alert.alert("Success ✨", "Profile updated successfully!");
                navigation.goBack();
            } else {
                Alert.alert("Error", res.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Update failed:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#1A3C34" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtn}>
                    {loading ? <ActivityIndicator size="small" color="#1A3C34" /> : <Check size={24} color="#1A3C34" />}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Info</Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <User size={14} color="#6B7280" />
                            <Text style={styles.label}>First Name</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Your first name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <User size={14} color="#6B7280" />
                            <Text style={styles.label}>Last Name</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Your last name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <AlignLeft size={14} color="#6B7280" />
                            <Text style={styles.label}>Bio</Text>
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell the world about your adventures..."
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Camera size={14} color="#6B7280" />
                            <Text style={styles.label}>Cover Image URL</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={coverImage}
                            onChangeText={setCoverImage}
                            placeholder="https://images.unsplash.com/..."
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location & Contact</Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Globe size={14} color="#6B7280" />
                            <Text style={styles.label}>Country</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={country}
                            onChangeText={setCountry}
                            placeholder="e.g. Bangladesh"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <MapPin size={14} color="#6B7280" />
                            <Text style={styles.label}>Phone Number</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={phonenumber}
                            onChangeText={setPhonenumber}
                            placeholder="10 digit number"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.fullSaveBtn}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.fullSaveBtnText}>Save Changes ✨</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
        backgroundColor: theme.colors.card.background
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.primary },
    saveBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

    form: { padding: 20 },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },

    inputGroup: { marginBottom: 15 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    label: { fontSize: 14, fontWeight: '600', color: theme.colors.text.primary },
    input: {
        backgroundColor: theme.colors.card.background,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: theme.colors.text.primary,
        borderWidth: 1,
        borderColor: theme.colors.divider
    },
    textArea: { height: 100, textAlignVertical: 'top' },

    fullSaveBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    },
    fullSaveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
