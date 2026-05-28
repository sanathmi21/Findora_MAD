import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Platform,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TabName = 'Lost' | 'Found' | 'Favorites' | 'Profile';

interface Props {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabs: { name: TabName; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Lost', icon: 'search-outline', activeIcon: 'search' },
  { name: 'Found', icon: 'flag-outline', activeIcon: 'flag' },
  { name: 'Favorites', icon: 'heart-outline', activeIcon: 'heart' },
  { name: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

const TabNavigator: React.FC<Props> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? '#0d7377' : '#aaa'}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '500',
  },
  labelActive: {
    color: '#0d7377',
    fontWeight: '700',
  },
});

export default TabNavigator;