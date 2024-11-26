import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MicronutrientItem {
  name: string;
  value: number;
  unit: string;
  percentage: number;
  icon: 'sunny-outline' | 'fitness-outline' | 'bone-outline' | 'leaf-outline';
  color: string;
}

interface Props {
  micronutrients: MicronutrientItem[];
}

const MicronutrientCard = ({ item }: { item: MicronutrientItem }) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: item.percentage / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [item.percentage]);

  return (
    <View style={styles.microCard}>
      <View style={styles.microHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.microName}>{item.name}</Text>
        <Text style={styles.microValue}>
          {item.value}{item.unit}
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }),
              backgroundColor: item.color
            }
          ]}
        />
      </View>
      <Text style={styles.percentage}>{item.percentage}% of daily goal</Text>
    </View>
  );
};

const MicronutrientsPanel = ({ micronutrients }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Micronutrients</Text>
      <View style={styles.grid}>
        {micronutrients.map((item, index) => (
          <MicronutrientCard key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  grid: {
    gap: 12,
  },
  microCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
  },
  microHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  microName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  microValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default MicronutrientsPanel;