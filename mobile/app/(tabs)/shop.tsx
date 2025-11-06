import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import PurchaseConfirmationModal from "@/components/purchase-confirmation-modal";

type Item = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const mockItems: Item[] = [
  {
    id: "1",
    name: "Батончик",
    price: 50,
    image: "https://vitaminof.ru/upload/iblock/bb5/111.jpg",
  },
  {
    id: "2",
    name: "Бутылка для воды",
    price: 250,
    image:
      "https://leonardo.osnova.io/d92d1228-0f53-5d0e-ae87-f24556cee743/-/scale_crop/592x/-/format/webp/",
  },
  {
    id: "3",
    name: "Умные часы",
    price: 150000,
    image: "https://ir.ozone.ru/s3/multimedia-1-4/wc1000/7402036684.jpg",
  },
];

export const ShopScreen = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [balance, setBalance] = useState(1000);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleBuy = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedItem != null && balance >= selectedItem.price) {
      setBalance(balance - selectedItem.price);
      Alert.alert("Success", `You have purchased ${selectedItem.name}`);
    } else {
      Alert.alert(
        "Error",
        "You do not have enough funds to purchase this item",
      );
    }
    setModalVisible(false);
  };

  const handleCancelPurchase = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (!modalVisible) {
      setSelectedItem(null);
    }
  }, [modalVisible]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlayView}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handleBuy(item)}
          >
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
            <Text style={styles.balanceText}>Баланс: {balance}</Text>
          </View>
        </View>
        <FlatList
          data={mockItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
        <PurchaseConfirmationModal
          visible={modalVisible}
          item={selectedItem}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCancelPurchase}
        />
      </SafeAreaView>
    </ThemedView>
  );
};

const getStyles = (colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: 10,
    },
    balanceContainer: {
      backgroundColor: "#FFC107",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
    },
    balanceText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    listContainer: {
      padding: 10,
    },
    itemContainer: {
      flex: 1,
      flexDirection: "column",
      margin: 5,
      borderRadius: 8,
      overflow: "hidden",
      height: 200,
    },
    imageBackground: {
      flex: 1,
      justifyContent: "flex-end",
    },
    imageStyle: {
      resizeMode: "cover",
    },
    overlayView: {
      padding: 10,
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent dark background
    },
    itemName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#fff",
    },
    buyButton: {
      backgroundColor: "rgba(255, 193, 7)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
    },
    buyButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      marginLeft: 5,
    },
  });

export default ShopScreen;
