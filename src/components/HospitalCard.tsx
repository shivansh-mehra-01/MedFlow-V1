import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Hospital, HospitalStatus } from '../types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BedCapacityBar } from './BedCapacityBar';

function statusDotColor(status: HospitalStatus) {
  if (status === 'full') return Colors.danger;
  if (status === 'moderate') return Colors.warning;
  return Colors.success;
}

function getStatusLabel(status: HospitalStatus) {
  if (status === 'full') return 'FULL';
  if (status === 'moderate') return 'BUSY';
  return 'AVAILABLE';
}

export function HospitalCard({
  hospital,
  onPress,
}: {
  hospital: Hospital;
  onPress?: () => void;
}) {
  const icuUsed = hospital.icuTotal - hospital.icuFree;
  const genUsed = hospital.generalTotal - hospital.generalFree;

  const content = (
    <View style={styles.cardInner}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: statusDotColor(hospital.status) }]} />
            <Text style={[styles.statusText, { color: statusDotColor(hospital.status) }]}>
              {getStatusLabel(hospital.status)}
            </Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{hospital.name}</Text>
          <Text style={styles.address} numberOfLines={1}>
            <Icon name="map-marker" size={12} color={Colors.textTertiary} /> {hospital.address}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={14} color="#FFB800" />
          <Text style={styles.ratingText}>{hospital.rating?.toFixed(1) || '4.0'}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <BedCapacityBar label="ICU Beds" used={icuUsed} total={hospital.icuTotal} />
        </View>
        <View style={styles.statBox}>
          <BedCapacityBar label="General Beds" used={genUsed} total={hospital.generalTotal} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.specs}>
          {hospital.specialists?.slice(0, 2).map((s, i) => (
            <View key={i} style={styles.specChip}>
              <Text style={styles.specText}>{s}</Text>
            </View>
          ))}
          {(hospital.specialists?.length ?? 0) > 2 && (
            <Text style={styles.moreText}>+{hospital.specialists!.length - 2} more</Text>
          )}
        </View>
        <Text style={styles.distanceText}>{hospital.distance}</Text>
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardInner: {
    padding: 16,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleArea: {
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  address: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  distanceText: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.danger,
  },
});
