import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { Labels } from '../../constants/labels';
import { Typography } from '../../constants/typography';
import { HospitalCard } from '../../components/HospitalCard';
import { hospitalService, type HospitalSearchParams } from '../../services/hospitalService';
import type { Hospital } from '../../types';

export function HospitalScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'moderate' | 'full'>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = async (params?: HospitalSearchParams) => {
    try {
      setError(null);
      const searchParams: HospitalSearchParams = {
        ...params,
        search: searchQuery || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      };
      
      const response = await hospitalService.getHospitals(searchParams);
      setHospitals(response.data || []);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Failed to load hospitals. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHospitals();
  };

  const handleSearch = () => {
    setLoading(true);
    fetchHospitals();
  };

  const handleStatusFilter = (status: typeof selectedStatus) => {
    setSelectedStatus(status);
    setLoading(true);
    fetchHospitals({ status: status !== 'all' ? status : undefined });
  };

  const handleHospitalPress = (hospital: Hospital) => {
    Alert.alert(
      hospital.name,
      `Status: ${hospital.status}\nLocation: ${hospital.address}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Call:', hospital.contact?.phone) },
        { text: 'Directions', onPress: () => console.log('Navigate to:', hospital.name) }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.danger} />
          <Text style={styles.loadingText}>Searching nearby hospitals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hospitals</Text>
          <Text style={styles.subtitle}>{(hospitals?.length || 0)} facilities found nearby</Text>
        </View>
        <Pressable style={styles.profileBtn}>
          <Icon name="map-search-outline" size={24} color={Colors.danger} />
        </Pressable>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, area or specialist..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['all', 'available', 'moderate', 'full'] as const).map((status) => (
            <Pressable
              key={status}
              style={[styles.filterChip, selectedStatus === status && styles.filterChipActive]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text style={[styles.filterChipText, selectedStatus === status && styles.filterChipTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.danger} />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="wifi-off" size={48} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={onRefresh}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </Pressable>
          </View>
        ) : hospitals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="hospital-building" size={64} color={Colors.grayLight} />
            <Text style={styles.emptyText}>No Hospitals Found</Text>
            <Text style={styles.emptySubtext}>Try changing your filters or search query</Text>
          </View>
        ) : (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onPress={() => handleHospitalPress(hospital)}
            />
          ))
        )}
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FBFBFB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: { ...Typography.h1, fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: 2 },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: { 
    ...Typography.body, 
    color: Colors.textPrimary, 
    marginLeft: 10, 
    flex: 1,
    fontSize: 15,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  filterChipText: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 100,
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 20,
    fontWeight: '700',
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  footerSpace: {
    height: 40,
  },
});
