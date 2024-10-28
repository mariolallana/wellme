// src/screens/Home.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';

type StatCardProps = {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={24} color="#4CAF50" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

export const Home = ({ navigation }: MainTabScreenProps<'Home'>) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, User! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

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
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
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
    addButton: {
      backgroundColor: '#4CAF50',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summary: {
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    calorieInfo: {
      alignItems: 'center',
    },
    calorieTitle: {
      fontSize: 16,
      color: '#666',
    },
    calorieValue: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 5,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    mealsList: {
      gap: 10,
    },
    mealCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 10,
    },
    mealInfo: {
      flex: 1,
    },
    mealName: {
      fontSize: 16,
      fontWeight: '500',
    },
    mealTime: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
    },
    calories: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4CAF50',
    },
  });