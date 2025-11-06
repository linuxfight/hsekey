
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { postApiAuthLogin } from '@/api';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const handleLogin = async () => {
    try {
      const response = await postApiAuthLogin({
        body: {
          email,
          password,
        },
      });
      if (response.data?.token) {
        await SecureStore.setItemAsync('token', response.data.token);
        login();
        router.push('/(tabs)/shop');
      } else {
        Alert.alert('Login Failed', 'No token received');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
      >
          <View style={styles.inner}>
              <Image source={ require('../../assets/images/fitboost.png') } style={styles.logo} />
              <TextInput
                  style={styles.input}
                  placeholder="Почта"
                  placeholderTextColor="#999"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
              <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor="#999"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Войти</Text>
              </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
  );
};

const getStyles = (colorScheme: string) => StyleSheet.create({
    logo: {
      width: '200',
      height: '200',
        margin: 50,
        borderRadius: 25,
    },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
      backgroundColor: Colors[colorScheme].background,
  },
  inner: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
      backgroundColor: Colors[colorScheme].background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors[colorScheme].text,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: Colors[colorScheme].border,
    color: Colors[colorScheme].text,
  },
  button: {
    backgroundColor: '#FFC107', // Light Orange
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
