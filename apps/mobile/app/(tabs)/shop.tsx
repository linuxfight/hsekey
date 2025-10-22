import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedView } from "@/components/themed-view";

const mockItems = [
  { id: '1', name: 'Item 1', price: '100', image: 'https://cataas.com/cat' },
  { id: '2', name: 'Item 2', price: '200', image: 'https://cataas.com/cat' },
  { id: '3', name: 'Item 3', price: '300', image: 'https://cataas.com/cat' },
  { id: '4', name: 'Item 4', price: '400', image: 'https://cataas.com/cat' },
  { id: '5', name: 'Item 5', price: '500', image: 'https://cataas.com/cat' },
  { id: '6', name: 'Item 6', price: '600', image: 'https://cataas.com/cat' },
];

const ShopScreen = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Ionicons name="cart" size={20} color="#fff" />
        <Text style={styles.buyButtonText}>{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Balance: 1000</Text>
        </View>
      </View>
      <FlatList
        data={mockItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
};

const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderBottomWidth: 1,
  },
  balanceContainer: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  balanceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ShopScreen;