import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from "@/components/themed-text";
import { getTransactions, initDatabase } from "@/utils/database";

export const TransactionsScreen = () => {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    const [transactions, setTransactions] = useState<any[]>([]);

    const fetchTransactions = useCallback(async () => {
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    }, []);

    useFocusEffect(
      useCallback(() => {
        fetchTransactions();
      }, [fetchTransactions])
    );

    useEffect(() => {
      initDatabase().then(() => {
        fetchTransactions();
      }).catch(err => console.error("Failed to init database:", err));
    }, [fetchTransactions]);

    const renderItem = ({ item }) => (
    <ThemedView style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <ThemedText style={[styles.itemTitle, item.cancelled && styles.cancelledText]}>{item.itemTitle}</ThemedText>
        <ThemedText style={item.cancelled && styles.cancelledText}>Цена: {item.price * item.amount}</ThemedText>
      </View>
        <View style={styles.promocodeContainer}>
            <Text style={[styles.promocodeText, item.cancelled && styles.cancelledText]}>{item.promocode}</Text>
        </View>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
      margin: 10,
      borderRadius: 25,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
      borderRadius: 25,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold'
  },
  promocodeContainer: {
    marginLeft: 'auto',
  },
  promocodeText: {
    color: 'green',
    fontWeight: 'bold',
  },
    text: {
      color: 'white',
    },
  cancelledText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default TransactionsScreen;
