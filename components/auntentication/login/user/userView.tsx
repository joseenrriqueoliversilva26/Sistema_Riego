import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '@/lib/firebase ';
import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { router } from 'expo-router';
import * as Updates from 'expo-updates'; 
import { ChangePasswordModal } from './changePasswordModal';

export const Userview = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const userEmail = auth.currentUser?.email || '';

  const handleSignOut = async () => {
    try {
      await signOut(auth); 
      await Updates.reloadAsync(); 
      router.replace('/autentication'); 
    } catch (error) {
      const firebaseError = error as FirebaseError;
      Alert.alert('Error', 'Error al cerrar sesión: ' + firebaseError.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Información de Usuario</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.value}>{userEmail}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ChangePasswordModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#1B5E20',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutButton: {
    backgroundColor: '#EF5350',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});