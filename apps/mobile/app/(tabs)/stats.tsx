import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export const StatsScreen = () => {
  const [week, setWeek] = useState(moment());

  const handlePrevWeek = () => {
    setWeek(week.clone().subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setWeek(week.clone().add(1, 'week'));
  };

  const data = {
    labels: Array(7).fill(0).map((_, i) => week.clone().startOf('week').add(i, 'day').format('ddd')),
    datasets: [
      {
        data: Array(7).fill(0).map(() => Math.random() * 100),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: Array(7).fill(0).map(() => Math.random() * 100),
        color: (opacity = 1) => `rgba(244, 65, 65, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Activity 1', 'Activity 2'], // optional
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.date}>{week.format('MMMM YYYY')}</Text>
          <View style={styles.weekNavigation}>
            <TouchableOpacity onPress={handlePrevWeek}>
              <Text style={styles.navButton}>&lt; Prev</Text>
            </TouchableOpacity>
            <Text>{week.startOf('week').format('MMM D')} - {week.endOf('week').format('MMM D')}</Text>
            <TouchableOpacity onPress={handleNextWeek}>
              <Text style={styles.navButton}>Next &gt;</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
        />
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 18,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  navButton: {
    color: '#0a7ea4',
  },
});

export default StatsScreen;
