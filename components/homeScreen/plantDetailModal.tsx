import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Switch, ScrollView, StatusBar, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plant } from './plant';
import { useInterval } from './useInterval';

type PlantDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (plant: Plant) => Promise<void>;
  onTogglePump: (plantId: string, status: boolean) => Promise<void>;
  onDelete?: (plantId: string) => Promise<void>;
  plant: Plant | null;
};

export function PlantDetailModal({ visible, onClose, onSave, onTogglePump, onDelete, plant }: PlantDetailModalProps) {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [humedad, setHumedad] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [pumpActive, setPumpActive] = useState(false);
  const [pumpLoading, setPumpLoading] = useState(false);
  const [currentHumidity, setCurrentHumidity] = useState('45');
  const [isSimulating, setIsSimulating] = useState(false);
  
  const humidityWidthAnim = useRef(new Animated.Value(45)).current;

  useEffect(() => {
    if (visible && plant) {
      setId(plant.id);
      setNombre(plant.nombre);
      setHumedad(plant.humedad);
      setPumpActive(plant.bombActive || false);
      
      const simulatedHumidity = Math.floor(Math.random() * 60) + 20;
      setCurrentHumidity(simulatedHumidity.toString());
      humidityWidthAnim.setValue(simulatedHumidity);
      setIsSimulating(true);
    } else if (!visible) {
      setError('');
      setIsSimulating(false);
    }
  }, [visible, plant]);

  useEffect(() => {
    Animated.timing(humidityWidthAnim, {
      toValue: parseInt(currentHumidity),
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [currentHumidity]);

  useInterval(() => {
    if (isSimulating) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = Math.floor(Math.random() * 5) + 1;
      
      setCurrentHumidity(prevHumidity => {
        const newValue = Math.max(0, Math.min(100, parseInt(prevHumidity) + (direction * change)));
        return newValue.toString();
      });
    }
  }, 3000);

  const handleTogglePump = async () => {
    try {
      setPumpLoading(true);
      await onTogglePump(id, !pumpActive);
      
      if (!pumpActive) {
        setCurrentHumidity(prevHumidity => {
          const increase = Math.floor(Math.random() * 15) + 10;
          const newValue = Math.min(100, parseInt(prevHumidity) + increase);
          return newValue.toString();
        });
      }
      
      setPumpActive(!pumpActive);
    } catch (err) {
      console.error('Error al cambiar estado de la bomba:', err);
      setError('Error al controlar la bomba de agua. Por favor intenta de nuevo.');
    } finally {
      setPumpLoading(false);
    }
  };

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
        humedad: humedad.trim(),
        bombActive: pumpActive
      });

      onClose();
    } catch (err) {
      console.error('Error al actualizar la planta:', err);
      setError('Error al guardar los cambios. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = () => {
    if (!id || !onDelete) return;
    
    Alert.alert(
      "Eliminar Planta",
      `¿Estás seguro que deseas eliminar "${nombre}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleteLoading(true);
              await onDelete(id);
              onClose();
            } catch (err) {
              console.error('Error al eliminar la planta:', err);
              setError('Error al eliminar la planta. Por favor intenta de nuevo.');
            } finally {
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };

  const getHumidityStatus = () => {
    const currentHumidityNum = parseInt(currentHumidity);
    const targetHumidityNum = parseInt(humedad);
    
    if (isNaN(currentHumidityNum) || isNaN(targetHumidityNum)) return 'unknown';
    
    const difference = Math.abs(currentHumidityNum - targetHumidityNum);
    if (difference <= 5) return 'optimal';
    if (currentHumidityNum < targetHumidityNum) return 'low';
    return 'high';
  };

  const humidityStatus = getHumidityStatus();
  const humidityColor = {
    'optimal': '#34C759',
    'low': '#FF9500',
    'high': '#4682B4',
    'unknown': '#8E8E93'
  }[humidityStatus];

  const humidityMessage = {
    'optimal': 'Nivel óptimo',
    'low': 'Nivel bajo',
    'high': 'Nivel alto',
    'unknown': 'No disponible'
  }[humidityStatus];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Detalles de la Planta</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.contentContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ID de la planta</Text>
                  <TextInput
                    style={styles.input}
                    value={id}
                    onChangeText={(text) => {
                      setId(text);
                      setError('');
                    }}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre de la planta</Text>
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={(text) => {
                      setNombre(text);
                      setError('');
                    }}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Humedad deseada (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={humedad}
                    onChangeText={(text) => {
                      setHumedad(text);
                      setError('');
                    }}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.currentHumidityContainer}>
                  <View style={styles.humidityHeader}>
                    <Ionicons name="water-outline" size={24} color="#4682B4" />
                    <Text style={styles.humidityTitle}>Humedad Actual del Suelo</Text>
                  </View>
                  
                  <View style={styles.humidityInfo}>
                    <View style={styles.humidityValueContainer}>
                      <Text style={styles.humidityValue}>{currentHumidity}%</Text>
                      <Text style={[styles.humidityStatus, { color: humidityColor }]}>
                        {humidityMessage}
                      </Text>
                    </View>
                    
                    <View style={styles.humidityMeter}>
                      <Animated.View 
                        style={[
                          styles.humidityFill, 
                          { 
                            width: humidityWidthAnim.interpolate({
                              inputRange: [0, 100],
                              outputRange: ['0%', '100%'],
                            }),
                            backgroundColor: humidityColor
                          }
                        ]} 
                      />
                    </View>
                    
                    <View style={styles.humidityTarget}>
                      <Text style={styles.humidityTargetLabel}>Objetivo:</Text>
                      <Text style={styles.humidityTargetValue}>{humedad}%</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.pumpContainer}>
                  <View style={styles.pumpHeader}>
                    <Ionicons name="water" size={24} color="#4682B4" />
                    <Text style={styles.pumpTitle}>Control de Bomba de Agua</Text>
                  </View>
                  
                  <View style={styles.pumpControls}>
                    <Text style={styles.pumpStatus}>
                      Estado: {pumpActive ? 'Encendida' : 'Apagada'}
                    </Text>
                    
                    {pumpLoading ? (
                      <ActivityIndicator size="small" color="#4682B4" />
                    ) : (
                      <Switch
                        value={pumpActive}
                        onValueChange={handleTogglePump}
                        trackColor={{ false: '#CCCCCC', true: '#81B0FF' }}
                        thumbColor={pumpActive ? '#4682B4' : '#F5F5F5'}
                        ios_backgroundColor="#CCCCCC"
                      />
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={deleteLoading}
              activeOpacity={0.8}
            >
              {deleteLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <View style={styles.deleteButtonContent}>
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.deleteButtonText}>Eliminar Planta</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      }
    })
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    height: '80%',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    padding: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  contentContainer: {
    paddingVertical: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    ...Platform.select({
      android: {
        paddingVertical: 8,
        elevation: 1,
      }
    })
  },
  currentHumidityContainer: {
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    ...Platform.select({
      android: {
        elevation: 2,
      }
    })
  },
  humidityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  humidityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  humidityInfo: {
    marginTop: 5,
  },
  humidityValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  humidityValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  humidityStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  humidityMeter: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  humidityFill: {
    height: '100%',
    borderRadius: 6,
  },
  humidityTarget: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  humidityTargetLabel: {
    fontSize: 12,
    color: '#666',
  },
  humidityTargetValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  pumpContainer: {
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    ...Platform.select({
      android: {
        elevation: 2,
      }
    })
  },
  pumpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pumpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  pumpControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pumpStatus: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#34C759',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    ...Platform.select({
      android: {
        elevation: 4,
      }
    })
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    ...Platform.select({
      android: {
        elevation: 4,
      }
    })
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: -5,
    textAlign: 'center',
  },
});