import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HospitalCard } from '../../components/HospitalCard';
import { Colors } from '../../constants/colors';
import { Labels } from '../../constants/labels';
import { mockHospitals } from '../../constants/mockData';
import { Typography } from '../../constants/typography';
import type { HospitalStatus } from '../../types';
function markerColor(status: HospitalStatus) {
  if (status === 'full') {
    return Colors.danger;
  }
  if (status === 'moderate') {
    return Colors.warning;
  }
  return Colors.success;
}

export function HospitalMapScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.danger} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.screenTitle}>{Labels.map}</Text>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>Hospital Map View Disabled</Text>
      </View>

      <View style={styles.legend}>
        <LegendDot color={Colors.danger} label="Full" />
        <LegendDot color={Colors.warning} label="Moderate" />
        <LegendDot color={Colors.success} label="Available" />
        <LegendDot color={Colors.info} label="Ambulance" />
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {mockHospitals.length === 0 ? (
          <Text style={styles.empty}>{Labels.noData}</Text>
        ) : (
          mockHospitals.map(h => (
            <HospitalCard
              key={h.id}
              hospital={h}
              onPress={() =>
                Alert.alert(
                  h.name,
                  `${h.address}\nICU free: ${h.icuFree} · OT free: ${h.otFree}\n${h.distance}`,
                )
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenTitle: { ...Typography.h1, color: Colors.textPrimary, paddingHorizontal: 16, marginBottom: 8 },
  mapPlaceholder: {
    height: 220,
    width: '100%',
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { ...Typography.body, color: Colors.textSecondary },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    alignItems: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendLabel: { ...Typography.tiny, color: Colors.textSecondary },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { ...Typography.body, color: Colors.textTertiary, textAlign: 'center', marginTop: 24 },
});
