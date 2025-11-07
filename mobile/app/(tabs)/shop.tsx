import { Button, Chip, Dialog, Portal, Paragraph, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import PurchaseConfirmationModal from "@/components/purchase-confirmation-modal";
import { StyleSheet, View, FlatList, ImageBackground, Text } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { addTransaction } from "@/utils/database";
import { getApiProductsBalance, getApiProductsList, postApiProductsBuy } from "@/api";


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
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoItemName, setPromoItemName] = useState("");

  const hideErrorDialog = () => setShowErrorDialog(false);
  const hidePromoDialog = () => setShowPromoDialog(false);

  const fetchData = useCallback(async () => {
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
        setProducts(productsResponse.data.sort((a, b) => a.id - b.id).map(p => ({...p, image: p.imageUrl})));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Ошибка сервера, попробуйте позже");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleBuy = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleConfirmPurchase = async () => {
    if (selectedItem != null && balance >= selectedItem.price) {
      try {
        const code = await postApiProductsBuy({
          body: {
            productId: selectedItem.id
          }
        });

        setBalance(balance - selectedItem.price);
        setPromoCode(code.data.code);
        setPromoItemName(selectedItem.name);
        setShowPromoDialog(true);

        await addTransaction({
          id: code.data.code, // Assuming code.data.code is unique and can serve as transaction ID
          price: selectedItem.price,
          amount: 1, // Assuming o ne item per purchase for now
          itemTitle: selectedItem.name,
          imageUrl: selectedItem.image,
          promocode: code.data.code, // Assuming the returned code is the promocode
          cancelled: false,
        });

        await fetchData(); // Refetch data after successful purchase
      } catch (apiError) {
        console.error("Error during purchase:", apiError);
        setErrorMessage("Ошибка сервера, попробуйте позже");
        setShowErrorDialog(true);
      }
    } else {
      setErrorMessage("У вас недостаточно баллов для покупки");
      setShowErrorDialog(true);
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
          >
            <Text>{item.price} б.</Text>
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
            Баллы: {balance}
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

      <Portal>
        <Dialog visible={showErrorDialog} onDismiss={hideErrorDialog}>
          <Dialog.Title>Ошибка</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{errorMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideErrorDialog}>Хорошо</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showPromoDialog} onDismiss={hidePromoDialog}>
          <Dialog.Title>Вы получили {promoItemName}!</Dialog.Title>
          <Dialog.Content>
            <Paragraph></Paragraph>
            <Paragraph>Ваш промокод на товар: {promoCode}.</Paragraph>
            <Paragraph></Paragraph>
            <Paragraph>Если промокод понадобится позже, то вы можете найти его во вкладке "Мои промокоды".</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hidePromoDialog}>Отлично!</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
