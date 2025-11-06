import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from "@/components/themed-text";

const mockTransactions = [
    {
        id: '1',
        price: 100,
        amount: 1,
        itemTitle: 'Батончик',
        imageUrl: 'https://sportivnoepitanie.ru/img/item/500/bombbar-protein-bar-60g.jpg',
        promocode: 'PROMO123',
        cancelled: false,
    },
  {
    id: '2',
    price: 300,
    amount: 2,
    itemTitle: 'Протеин 100%',
    imageUrl: 'https://sportivnoepitanie.ru/img/item/500/optimum-nutrition-100-whey-gold-standard-2270g-1.jpg',
    isPromocode: false,
    promocode: 'PROMO789',
    cancelled: true,
  },
];

export const TransactionsScreen = () => {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

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
        data={mockTransactions}
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
