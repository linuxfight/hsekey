import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';

const mockTransactions = [
  {
    id: '1',
    price: 100,
    amount: 1,
    itemTitle: 'Item 1',
    imageUrl: 'https://cataas.com/cat',
    isPromocode: false,
    promocode: 'PROMO123',
    cancelled: false,
  },
  {
    id: '2',
    price: 200,
    amount: 1,
    itemTitle: 'Item 2',
    imageUrl: 'https://cataas.com/cat',
    isPromocode: true,
    promocode: 'PROMO456',
    cancelled: false,
  },
  {
    id: '3',
    price: 300,
    amount: 2,
    itemTitle: 'Item 3',
    imageUrl: 'https://cataas.com/cat',
    isPromocode: false,
    promocode: 'PROMO789',
    cancelled: true,
  },
];

export const TransactionsScreen = () => {
  const renderItem = ({ item }) => (
    <ThemedView style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, item.cancelled && styles.cancelledText]}>{item.itemTitle}</Text>
        <Text style={item.cancelled && styles.cancelledText}>Price: {item.price}</Text>
        <Text style={item.cancelled && styles.cancelledText}>Amount: {item.amount}</Text>
      </View>
      {item.isPromocode && (
        <View style={styles.promocodeContainer}>
          <Text style={[styles.promocodeText, item.cancelled && styles.cancelledText]}>{item.promocode}</Text>
        </View>
      )}
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mockTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  promocodeContainer: {
    marginLeft: 'auto',
  },
  promocodeText: {
    color: 'green',
    fontWeight: 'bold',
  },
  cancelledText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default TransactionsScreen;
