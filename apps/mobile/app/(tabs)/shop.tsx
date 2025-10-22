import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Alert } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';

const mockItems = [
  { id: '1', name: 'Item 1', price: 100, image: 'https://cataas.com/cat' },
  { id: '2', name: 'Item 2', price: 200, image: 'https://cataas.com/cat' },
  { id: '3', name: 'Item 3', price: 300, image: 'https://cataas.com/cat' },
  { id: '4', name: 'Item 4', price: 400, image: 'https://cataas.com/cat' },
  { id: '5', name: 'Item 5', price: 500, image: 'https://cataas.com/cat' },
  { id: '6', name: 'Item 6', price: 600, image: 'https://cataas.com/cat' },
];

export const ShopScreen = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [balance, setBalance] = React.useState(1000);

  const handleBuy = (item) => {
    if (balance >= item.price) {
      setBalance(balance - item.price);
      Alert.alert('Success', `You have purchased ${item.name}`);
    } else {
      Alert.alert('Error', 'You do not have enough funds to purchase this item');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ImageBackground source={{ uri: item.image }} style={styles.imageBackground} imageStyle={styles.imageStyle}>
        <View style={styles.overlayView}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(item)}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={styles.buyButtonText}>{item.price}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>Balance: {balance}</Text>
            </View>
        </View>
        <FlatList
            data={mockItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
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
    borderBottomColor: Colors[colorScheme].border,
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
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
    overlayView: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  buyButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.7)',
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