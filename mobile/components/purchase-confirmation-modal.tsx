import React from 'react';
import { Modal, View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

const PurchaseConfirmationModal = ({ visible, item, onConfirm, onCancel }) => {
  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText style={styles.modalText}>Вы уверены, что хотите приобрести этот товар?</ThemedText>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemPrice}>Цена: {item.price}</ThemedText>
          import { Button } from "react-native-paper";

// ... (rest of the imports)

// ... (inside the component)
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onConfirm}
              style={styles.button}
            >
              Да
            </Button>
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.button}
            >
              Нет
            </Button>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default PurchaseConfirmationModal;
