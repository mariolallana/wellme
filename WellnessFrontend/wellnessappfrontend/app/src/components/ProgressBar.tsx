import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProgressBarProps = {
  progress: number;
  color: string;
  label: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color, label }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  // Format to one decimal place
  const formattedProgress = clampedProgress.toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${clampedProgress}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressText}>{`${formattedProgress}%`}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  progressBarContainer: {
    height: 20,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});