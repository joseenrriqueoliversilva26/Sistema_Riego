import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plant } from './plant';
import { useInterval } from './useInterval';
import { ScrollView, Switch } from 'react-native-gesture-handler';

type PlantDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (plant: Plant) => Promise<void>;
  onTogglePump: (plantId: string, status: boolean) => Promise<void>;
  onDelete?: (plantId: string) => Promise<void>;
  plant: Plant | null;
};

interface HumidityRecord {
  timestamp: Date;
  value: number;
}

export function PlantDetailModal({ visible, onClose, onSave, onTogglePump, onDelete, plant }: PlantDetailModalProps) {
  const [id, setId] = useState(plant?.id || '');
  const [nombre, setNombre] = useState(plant?.nombre || '');
  const [humedad, setHumedad] = useState(plant?.humedad || '');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [pumpActive, setPumpActive] = useState(plant?.bombActive || false);
  const [pumpLoading, setPumpLoading] = useState(false);
  const [currentHumidity, setCurrentHumidity] = useState('45');
  const [isSimulating, setIsSimulating] = useState(false);
  const [humidityHistory, setHumidityHistory] = useState<HumidityRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const humidityWidthAnim = useRef(new Animated.Value(45)).current;

  useEffect(() => {
    if (visible && plant) {
      setId(plant.id || '');
      setNombre(plant.nombre || '');
      setHumedad(plant.humedad || '');
      setPumpActive(plant.bombActive || false);

      const simulatedHumidity = Math.floor(Math.random() * 60) + 20;
      setCurrentHumidity(simulatedHumidity.toString());
      humidityWidthAnim.setValue(simulatedHumidity);
      setIsSimulating(true);
      
      setHumidityHistory([{
        timestamp: new Date(),
        value: simulatedHumidity
      }]);
    } else if (!visible) {
      setError('');
      setIsSimulating(false);
      setShowHistory(false);
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
      const direction = pumpActive ? 1 : Math.random() > 0.5 ? 1 : -1;
      const change = Math.floor(Math.random() * 5) + (pumpActive ? 3 : 1);
      
      setCurrentHumidity(prevHumidity => {
        const newValue = Math.max(0, Math.min(100, parseInt(prevHumidity) + (direction * change)));
        
        setHumidityHistory(prev => [
          ...prev, 
          {
            timestamp: new Date(),
            value: newValue
          }
        ]);
        
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
          const increase = Math.floor(Math.random() * 10) + 5;
          const newValue = Math.min(100, parseInt(prevHumidity) + increase);
          
          setHumidityHistory(prev => [
            ...prev, 
            {
              timestamp: new Date(),
              value: newValue
            }
          ]);
          
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
        id,
        nombre: nombre.trim(),
        humedad: humedad.trim(),
        bombActive: pumpActive,
        humedadActual: currentHumidity 
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
  
  const calculateEfficiency = () => {
    const currentHumidityNum = parseInt(currentHumidity);
    const targetHumidityNum = parseInt(humedad);
    
    if (isNaN(currentHumidityNum) || isNaN(targetHumidityNum)) return 0;
    
    const difference = Math.abs(currentHumidityNum - targetHumidityNum);
    const efficiency = Math.max(0, 100 - (difference * 5)); 
    
    return Math.min(100, efficiency);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

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
                    
                    <View style={styles.efficiencyContainer}>
                      <Text style={styles.efficiencyLabel}>Eficiencia del riego:</Text>
                      <Text style={styles.efficiencyValue}>{calculateEfficiency()}%</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.historyButton}
                    onPress={() => setShowHistory(!showHistory)}
                  >
                    <Text style={styles.historyButtonText}>
                      {showHistory ? 'Ocultar historial' : 'Ver historial'}
                    </Text>
                    <Ionicons 
                      name={showHistory ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#4682B4" 
                    />
                  </TouchableOpacity>
                  
                  {showHistory && (
                    <View style={styles.historyContainer}>
                      <Text style={styles.historyTitle}>Historial de Humedad</Text>
                      {humidityHistory.slice(-5).map((record, index) => (
                        <View key={index} style={styles.historyRow}>
                          <Text style={styles.historyTime}>{formatTime(record.timestamp)}</Text>
                          <View style={styles.historyBarContainer}>
                            <View style={[styles.historyBar, { width: `${record.value}%`, backgroundColor: 
                              record.value < parseInt(humedad) - 5 ? '#FF9500' : 
                              record.value > parseInt(humedad) + 5 ? '#4682B4' : '#34C759' 
                            }]} />
                          </View>
                          <Text style={styles.historyValue}>{record.value}%</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.pumpContainer}>
                  <View style={styles.pumpHeader}>
                    <Ionicons name="water" size={24} color="#4682B4" />
                    <Text style={styles.pumpTitle}>Control de Bomba de Agua</Text>
                  </View>
                  
                  <View style={styles.pumpControls}>
                    <View style={styles.pumpStatusContainer}>
                      <Text style={styles.pumpStatus}>
                        Estado: 
                      </Text>
                      <Text style={[styles.pumpStatusValue, {
                        color: pumpActive ? '#34C759' : '#FF9500'
                      }]}>
                        {pumpActive ? 'Encendida' : 'Apagada'}
                      </Text>
                    </View>
                    
                    {pumpLoading ? (
                      <ActivityIndicator size="small" color="#4682B4" />
                    ) : (
                      <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{pumpActive ? 'ON' : 'OFF'}</Text>
                        <Switch
                          value={pumpActive}
                          onValueChange={handleTogglePump}
                          trackColor={{ false: '#CCCCCC', true: '#81B0FF' }}
                          thumbColor={pumpActive ? '#4682B4' : '#F5F5F5'}
                          ios_backgroundColor="#CCCCCC"
                        />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.savingContainer}>
                    <Ionicons name={pumpActive ? "flash" : "leaf"} size={18} color={pumpActive ? "#FF9500" : "#34C759"} />
                    <Text style={[styles.savingText, {color: pumpActive ? "#FF9500" : "#34C759"}]}>
                      {pumpActive 
                        ? "Consumiendo agua. Recuerda apagar la bomba cuando no sea necesario."
                        : "Ahorrando agua. Sistema de riego inteligente en reposo."}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.recommendationsContainer}>
                  <View style={styles.recommendationsHeader}>
                    <Ionicons name="bulb-outline" size={24} color="#FFC107" />
                    <Text style={styles.recommendationsTitle}>Recomendaciones</Text>
                  </View>
                  
                  <Text style={styles.recommendationText}>
                    {humidityStatus === 'low' 
                      ? "La humedad está por debajo del nivel óptimo. Considera activar la bomba de riego."
                      : humidityStatus === 'high' 
                        ? "La humedad está por encima del nivel óptimo. Recomendamos esperar antes de regar nuevamente."
                        : "La planta se encuentra con un nivel de humedad óptimo. ¡Buen trabajo!"}
                  </Text>
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
    height: '85%',
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
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
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
    marginBottom: 10,
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
  efficiencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    marginTop: 5,
  },
  efficiencyLabel: {
    fontSize: 14,
    color: '#666',
  },
  efficiencyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  historyButtonText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 5,
  },
  historyContainer: {
    marginTop: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTime: {
    width: 55,
    fontSize: 12,
    color: '#666',
  },
  historyBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  historyBar: {
    height: '100%',
    borderRadius: 4,
  },
  historyValue: {
    width: 35,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  pumpContainer: {
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
  pumpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
    marginBottom: 15,
  },
  pumpStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pumpStatus: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginRight: 5,
  },
  pumpStatusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginRight: 5,
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
  },
  savingText: {
    marginLeft: 10,
    fontSize: 13,
    flex: 1,
  },
  recommendationsContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
    ...Platform.select({
      android: {
        elevation: 2,
      }
    })
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginLeft: 8,
  }
});