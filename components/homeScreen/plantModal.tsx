import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Plant } from './plant';

type PlantModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (plant: Plant) => Promise<void>;
};

export function PlantModal({ visible, onClose, onSave }: PlantModalProps) {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [humedad, setHumedad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (visible) {
      // Mostrar alerta cuando se abre el modal
      setShowAlert(true);
    } else {
      // Limpiar campos cuando se cierra el modal
      setId('');
      setNombre('');
      setHumedad('');
      setError('');
      setShowAlert(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!id.trim()) {
      setError('El ID es requerido');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre de la planta es requerido');
      return;
    }

    if (!humedad.trim()) {
      setError('La humedad es requerida');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await onSave({
        id: id.trim(),
        nombre: nombre.trim(),
        humedad: humedad.trim()
      });

      onClose();
    } catch (err) {
      console.error('Error en modal:', err);
      setError('Error al guardar la planta. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {showAlert && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlert}
          onRequestClose={() => setShowAlert(false)}
        >
          <View style={styles.alertContainer}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>¡Importante!</Text>
              <Text style={styles.alertMessage}>
                ¿Sabes bien qué humedad de suelo necesita tu planta? Si no, investiga en nuestra API de plantas implementada en tu app.
              </Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setShowAlert(false)}
              >
                <Text style={styles.alertButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nueva Planta</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <TextInput
              style={styles.input}
              placeholder="ID de la planta"
              value={id}
              onChangeText={(text) => {
                setId(text);
                setError('');
              }}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Nombre de la planta"
              value={nombre}
              onChangeText={(text) => {
                setNombre(text);
                setError('');
              }}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Humedad deseada (%)"
              value={humedad}
              onChangeText={(text) => {
                setHumedad(text);
                setError('');
              }}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.buttonTextWhite}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonTextWhite}>Agregar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  buttonTextWhite: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  },
  // Nuevos estilos para la alerta
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
  alertContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});