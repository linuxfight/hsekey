import { ThemedView } from "@/components/themed-view";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import "moment/locale/ru";
import { ThemedText } from "@/components/themed-text";
import {
  initialize,
  requestPermission,
  readRecords,
  RecordResult,
} from "react-native-health-connect";

import { useThemeColor } from "@/hooks/use-theme-color";

moment.locale("ru");
const screenWidth = Dimensions.get("window").width;

const readSampleData = async (date: moment.Moment) => {
  const isInitialized = await initialize();
  console.log("Initialized:", isInitialized);

  // Request permission for Steps
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "Steps" },
  ]);

  console.log("Granted permissions:", grantedPermissions);

  // Get local dates WITHOUT converting to UTC
  const startMoment = date.clone().startOf("isoWeek");
  const endMoment = date.clone().endOf("isoWeek");

  // Format as ISO string but keep local timezone
  const start = startMoment.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const end = endMoment.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  console.log("Start:", start, "->", startMoment.format("MMM D, YYYY"));
  console.log("End:", end, "->", endMoment.format("MMM D, YYYY"));

  const { records } = await readRecords("Steps", {
    timeRangeFilter: {
      operator: "between",
      startTime: start,
      endTime: end,
    },
  });

  records.forEach((x) => (x.count /= 1000));

  return records;
};

const processRecords = (records: RecordResult<"Steps">[]) => {
  const weekData = Array(7).fill(0);

  if (!records || records.length === 0) {
    return weekData;
  }

  records.forEach((record) => {
    if (record) {
      const day = moment(record.startTime).isoWeekday(); // 1=Monday, 7=Sunday
      if (day >= 1 && day <= 7) {
        weekData[day - 1] += record.count; // Convert to 0-indexed (Monday=0)
      }
    }
  });

  return weekData.map((val) => (isFinite(val) ? val : 0));
};

export const StatsScreen = () => {
  const [records, setRecords] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]); // Initialize with zeros
  const [week, setWeek] = useState(moment());
  const [loading, setLoading] = useState(true);
  const themed = {
    background: useThemeColor({}, "background"),
    text: useThemeColor({}, "text"),
    primary: useThemeColor({}, "tint"),
  };

  const chartConfig = {
    backgroundGradientFrom: themed.background,
    backgroundGradientTo: themed.background,
    strokeWidth: 2, // optional, default 3

    color: (opacity = 1) => themed.text,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  useEffect(() => {
    setLoading(true);
    readSampleData(week)
      .then((fetchedRecords) => {
        const processed = processRecords(fetchedRecords);
        console.log("Processed records:", processed); // Debug log
        setRecords(processed);
      })
      .catch((error) => {
        console.error(error);
        setRecords([0, 0, 0, 0, 0, 0, 0]); // Set zeros on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [week]);

  const handlePrevWeek = () => {
    setWeek(week.clone().subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setWeek(week.clone().add(1, "week"));
  };

  // Ensure data is always valid
  const safeRecords = records.map((val) =>
    typeof val === "number" && isFinite(val) ? val : 0,
  );

  const data = {
    labels: Array(7)
      .fill(0)
      .map((_, i) =>
        week.clone().startOf("isoWeek").add(i, "day").format("ddd"),
      ),
    datasets: [
      {
        data: safeRecords.length > 0 ? safeRecords : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => themed.primary,
        strokeWidth: 2,
      },
    ],
    legend: ["Баллы за шаги"],
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <ThemedText style={styles.date}>
            {week.format("MMMM YYYY")}
          </ThemedText>
          <View style={styles.weekNavigation}>
            <TouchableOpacity onPress={handlePrevWeek}>
              <ThemedText style={styles.navButton}>&lt; Пред.</ThemedText>
            </TouchableOpacity>
            <ThemedText>
              {week.clone().startOf("week").format("MMM D")} -{" "}
              {week.clone().endOf("week").format("MMM D")}
            </ThemedText>
            <TouchableOpacity onPress={handleNextWeek}>
              <ThemedText style={styles.navButton}>След. &gt;</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : (
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  navButton: {
    color: "#0a7ea4",
  },
});

export default StatsScreen;
