// Core imports
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../services/api/types';

// Navigation and services
import { MainTabScreenProps } from '../navigation/types';
import { ProfileService } from '../services/api/profile.service';


type StatCardProps = {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Reusable component for stats display
const StatCard = ({ title, value, icon }: StatCardProps) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#4CAF50" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

// Main component
export const Home = ({ navigation }: MainTabScreenProps<'Home'>) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await ProfileService.getUserProfile();
          if (response.success && response.data) {
            setProfile(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };
    checkAuthAndProfile();
  }, []);

    return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Hi, {profile?.name || 'User'}! 👋</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
    
            {/* Stats Overview Section */}
            <View style={styles.statsContainer}>
              <StatCard
                title="Calories"
                value="1,200"
                icon="flame-outline"
              />
              <StatCard
                title="Water"
                value="1.5L"
                icon="water-outline"
              />
              <StatCard
                title="Steps"
                value="5,430"
                icon="footsteps-outline"
              />
            </View>
    
            {/* Daily Goals Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Goals</Text>
              <TouchableOpacity style={styles.goalCard}>
                <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
                <View style={styles.goalText}>
                  <Text style={styles.goalTitle}>Track your lunch</Text>
                  <Text style={styles.goalSubtitle}>Stay on top of your nutrition</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </View>
    
            {/* User Profile Section */}
            {profile && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <View style={styles.profileCard}>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileLabel}>Weight:</Text>
                        <Text style={styles.profileValue}>{profile.profile.weight}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileLabel}>Height:</Text>
                        <Text style={styles.profileValue}>{profile.profile.height}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileLabel}>Goal:</Text>
                        <Text style={styles.profileValue}>{profile.profile.goal}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileLabel}>Activity Level:</Text>
                        <Text style={styles.profileValue}>{profile.profile.activityLevel}</Text>
                    </View>
                    </View>
                </View>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    };

// Styles
const styles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  section: {
    padding: 20,
  },

  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  // Stats section styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },

  // Goal card styles
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  goalText: {
    flex: 1,
    marginLeft: 15,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#666',
  },

  // Profile section styles
  profileCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 14,
    color: '#666',
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});