import { getApiProductsBalance, getApiProductsList } from "@/api";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Chip } from "react-native-paper";
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

export const ShopScreen = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [balanceResponse, productsResponse] = await Promise.all([
          getApiProductsBalance(),
          getApiProductsList({ query: { page: 1, limit: 10 } }),
        ]);

        if (balanceResponse.data) {
          setBalance(balanceResponse.data.balance);
        }

        if (productsResponse.data) {
          setProducts(productsResponse.data.map(p => ({...p, image: p.imageUrl})));
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <Button
            mode="contained"
            onPress={() => handleBuy(item)}
            icon="cart"
          >
            <Text>{item.price}</Text>
          </Button>
        </View>
      </ImageBackground>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Chip>
            Баланс: {balance}
          </Chip>
        </View>
        <FlatList
          data={products}
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
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
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
  });

export default ShopScreen;
