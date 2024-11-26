// Core imports
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../services/api/apiTypes';

// Navigation and services
import { MainTabScreenProps } from '../navigation/types';
import { ProfileService } from '../services/api/profile.service';


type StatCardProps = {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle?: string;
};

// Reusable component for stats display
const StatCard = ({ title, value, icon, subtitle }: StatCardProps) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#4CAF50" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

// Add this helper function at the top
const calculateDailyStats = (profile: UserProfile) => {
  // Calculate recommended steps based on activity level
  const baseSteps = {
    sedentary: 4000,
    lightlyActive: 7000,
    moderatelyActive: 10000,
    veryActive: 12000
  };

  const activityLevel = profile.profile.activityLevel as keyof typeof baseSteps;
  const recommendedSteps = baseSteps[activityLevel] || 8000;

  // Calculate water intake (ml) based on weight and activity
  const waterPerKg = {
    sedentary: 30,
    lightlyActive: 35,
    moderatelyActive: 40,
    veryActive: 45
  };
  
  const waterNeeded = Math.round((profile.profile.weight * waterPerKg[activityLevel]) / 1000);
  
  // Calculate calories burned from activity
  const caloriesBurnedPerStep = 0.04;
  const estimatedStepsTaken = Math.round(recommendedSteps * 0.7); // 70% of daily goal
  const caloriesBurned = Math.round(estimatedStepsTaken * caloriesBurnedPerStep);

  return {
    recommendedSteps,
    estimatedStepsTaken,
    waterNeeded,
    caloriesBurned
  };
};

// Main component
const Home = ({ navigation }: MainTabScreenProps<'Home'>) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  
  useEffect(() => {
    // Animate components on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    checkAuthAndProfile();
  }, []);

  const checkAuthAndProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('[Home] Token:', token);
    if (token) {
      try {
        const response = await ProfileService.getUserProfile();
        console.log('[Home] Profile fetch response:', response);
        if (response.success && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
  };

  // Update the Stats section in the render
  const stats = profile ? calculateDailyStats(profile) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Animated Header Section */}
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim }
          ]}
        >
          <View>
            <Text style={styles.greeting}>Hi, {profile?.profile.name || 'User'}! 👋</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={40} color="#4CAF50" />
          </View>
        </Animated.View>

        {/* Animated Stats Overview Section */}
        <Animated.View 
          style={[
            styles.statsContainer,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim 
            }
          ]}
        >
          <StatCard
            title="Daily Goal"
            value={`${profile?.nutritionalGoals?.dailyCalories?.toFixed(0) || '2000'} cal`}
            icon="flame-outline"
          />
          <StatCard
            title="Water Goal"
            value={`${stats?.waterNeeded || '2'}L`}
            icon="water-outline"
          />
          <StatCard
            title="Activity"
            value={`${stats?.estimatedStepsTaken.toLocaleString() || '0'}`}
            subtitle={`${stats?.caloriesBurned || 0} cal`}
            icon="footsteps-outline"
          />
        </Animated.View>

        {/* Daily Goals Section with Shadow and Gradient */}
        <Animated.View 
          style={[
            styles.section,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim 
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <TouchableOpacity 
            style={styles.goalCard}
            onPress={() => navigation.navigate('FoodTracking')}
            activeOpacity={0.7}
          >
            <View style={styles.goalIconContainer}>
              <Ionicons name="restaurant-outline" size={24} color="#fff" />
            </View>
            <View style={styles.goalText}>
              <Text style={styles.goalTitle}>Track your lunch</Text>
              <Text style={styles.goalSubtitle}>Stay on top of your nutrition</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Information Section */}
        {profile && (
          <Animated.View 
            style={[
              styles.section,
              { 
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim 
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <View style={styles.profileCard}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Weight:</Text>
                <Text style={styles.profileValue}>{profile.profile.weight} kg</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Height:</Text>
                <Text style={styles.profileValue}>{profile.profile.height} cm</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Goal:</Text>
                <Text style={styles.profileValue}>
                  {profile.profile.goal.charAt(0).toUpperCase() + profile.profile.goal.slice(1)} Weight
                </Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Activity Level:</Text>
                <Text style={styles.profileValue}>
                  {profile.profile.activityLevel.charAt(0).toUpperCase() + 
                   profile.profile.activityLevel.slice(1)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Add dietary preferences section */}
        {profile && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            <View style={styles.dietaryPrefsContainer}>
              {Object.entries(profile.dietaryPreferences)
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <View key={key} style={styles.dietaryPrefTag}>
                    <Ionicons name="leaf-outline" size={16} color="#4CAF50" />
                    <Text style={styles.dietaryPrefText}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                    </Text>
                  </View>
                ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

// Styles
const styles = StyleSheet.create({
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
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalText: {
    flex: 1,
    marginLeft: 15,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 15,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 16,
    color: '#666',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dietaryPrefsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dietaryPrefTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 15,
  },
  dietaryPrefText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
});