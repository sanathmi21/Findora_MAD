import React, { useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Platform,StatusBar,Image,Dimensions,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LostItem } from './LostItemsScreen';

const { width } = Dimensions.get('window');

interface Props {
  item: LostItem;
  onBack: () => void;
}

const LostItemDetailScreen: React.FC<Props> = ({ item, onBack }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="cover" />

          {/* Overlay buttons */}
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
              <Ionicons name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>
            <View style={styles.heroRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFavorite(!isFavorite)}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? '#e74c3c' : '#333'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + time */}
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color="#aaa" />
            <Text style={styles.metaText}>Lost {item.timeAgo}  •  Oct 28, 2025</Text>
          </View>

          {/* Info cards */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="location-outline" size={18} color="#0d7377" />
              </View>
              <View>
                <Text style={styles.infoLabel}>LOCATION</Text>
                <Text style={styles.infoValue}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="pricetag-outline" size={18} color="#0d7377" />
              </View>
              <View>
                <Text style={styles.infoLabel}>CATEGORY</Text>
                <Text style={styles.infoValue}>{item.category}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="alert-circle-outline" size={18} color="#e6a817" />
              </View>
              <View>
                <Text style={styles.infoLabel}>STATUS</Text>
                <Text style={[styles.infoValue, styles.statusText]}>Still Missing</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>
            {item.description.replace('...', '')} Found near the seating area near the main entrance.
            The item appears to be in good condition and is stored safely. Please contact the finder
            to arrange retrieval at a public location.
          </Text>

          {/* Precise Location */}
          <Text style={styles.sectionTitle}>Precise Location</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={32} color="#ccc" />
            <Text style={styles.mapLabel}>{item.location}</Text>
            {/* Map pin marker */}
            <View style={styles.mapPin}>
              <Ionicons name="location" size={22} color="#0d7377" />
            </View>
          </View>

          {/* Contact button */}
          <TouchableOpacity style={styles.contactButton} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </TouchableOpacity>

          {/* Safety notice */}
          <View style={styles.safetyCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#0d7377" />
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>Safety First</Text>
              <Text style={styles.safetyDesc}>
                Always meet in a public, well-lit place when retrieving lost items. Findora
                recommends using the in-app chat for all communication.
              </Text>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 44 : 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 12,
    color: '#aaa',
  },
  infoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#edf6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  statusText: {
    color: '#e6a817',
  },
  divider: {
    height: 1,
    backgroundColor: '#efefef',
    marginLeft: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  descText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 21,
    marginBottom: 24,
  },
  mapPlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#e8f0f0',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d4e8e8',
    gap: 6,
    position: 'relative',
  },
  mapLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  mapPin: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -11,
  },
  contactButton: {
    backgroundColor: '#e6a817',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    shadowColor: '#e6a817',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#edf6f6',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#d4e8e8',
  },
  safetyText: {
    flex: 1,
    gap: 4,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0d7377',
  },
  safetyDesc: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});

export default LostItemDetailScreen;