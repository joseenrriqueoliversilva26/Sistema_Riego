import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { auth } from '@/lib/firebase ';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; 
import { Eye, EyeOff } from 'lucide-react-native';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert('Error', 'No se encontró usuario');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const firebaseError = error as FirebaseError; 
      let errorMessage = 'Error desconocido';
      
      switch (firebaseError.code) {
        case 'auth/wrong-password':
          errorMessage = 'La contraseña actual es incorrecta';
          break;
        case 'auth/weak-password':
          errorMessage = 'La nueva contraseña es demasiado débil';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Por favor, vuelve a iniciar sesión para realizar esta acción';
          break;
        default:
          errorMessage = firebaseError.message;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? 
                <EyeOff size={24} color="#4CAF50" /> : 
                <Eye size={24} color="#4CAF50" />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? 
                <EyeOff size={24} color="#4CAF50" /> : 
                <Eye size={24} color="#4CAF50" />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar nueva contraseña"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 
                <EyeOff size={24} color="#4CAF50" /> : 
                <Eye size={24} color="#4CAF50" />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={handlePasswordChange}
            >
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F1F8E9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  input: {
    flex: 1,
    padding: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});