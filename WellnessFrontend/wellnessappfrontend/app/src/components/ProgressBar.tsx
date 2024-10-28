import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProgressBarProps = {
  progress: number;
  color: string;
  label: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color, label }) => (
  <View style={styles.container}>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
    <Text style={styles.progressText}>{`${progress}%`}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

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