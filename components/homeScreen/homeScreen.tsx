import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { PlantModal } from './plantModal';
import { PlantDetailModal } from './plantDetailModal';
import { Plant } from './plant';
import { PlantGrid } from './plantGrid';
import { DataSource } from "./datasource";
import { useInterval } from "./useInterval";
import { Animated } from "react-native";

export default function HomeScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const dataSource = new DataSource();
  
  const [ambientHumidity, setAmbientHumidity] = useState(65);
  const [tankCapacity, setTankCapacity] = useState(75);
  
  const humidityAnim = useRef(new Animated.Value(65)).current;
  const tankAnim = useRef(new Animated.Value(75)).current;

  useEffect(() => {
    loadPlants();
    simulateSensorChanges();
  }, []);
  
  useEffect(() => {
    Animated.timing(humidityAnim, {
      toValue: ambientHumidity,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [ambientHumidity]);
  
  useEffect(() => {
    Animated.timing(tankAnim, {
      toValue: tankCapacity,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [tankCapacity]);
  
  useInterval(() => {
    simulateSensorChanges();
  }, 5000);
  
  const simulateSensorChanges = () => {
    const newHumidity = Math.floor(Math.random() * 50) + 40;
    setAmbientHumidity(newHumidity);
    
    const newTankCapacity = Math.floor(Math.random() * 80) + 20;
    setTankCapacity(newTankCapacity);
  };

  const loadPlants = async () => {
    try {
      const results = await dataSource.getPlants();
      setPlants(results);
    } catch (error) {
      console.error('Error al cargar plantas:', error);
    }
  };

  const handleAddPlant = async (plant: Plant) => {
    try {
      await dataSource.savePlant(plant);
      await loadPlants();
      setAddModalVisible(false);
    } catch (error) {
      console.error('Error al guardar planta:', error);
    }
  };

  const handleUpdatePlant = async (plant: Plant) => {
    try {
      await dataSource.savePlant(plant);
      await loadPlants();
      setDetailModalVisible(false);
      setSelectedPlant(null);
    } catch (error) {
      console.error('Error al actualizar planta:', error);
    }
  };

  const handleTogglePump = async (plantId: string, status: boolean): Promise<void> => {
    try {
      await dataSource.togglePlantPump(plantId, status);
      await loadPlants();
    } catch (error) {
      console.error('Error al cambiar estado de bomba:', error);
      throw error;
    }
  };

  const handleDeletePlant = async (plantId: string): Promise<void> => {
    try {
      await dataSource.deletePlant(plantId);
      await loadPlants();
    } catch (error) {
      console.error('Error al eliminar planta:', error);
      throw error;
    }
  };

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setDetailModalVisible(true);
  };
  
  const getHumidityColor = () => {
    if (ambientHumidity < 50) return '#FF9500';
    if (ambientHumidity > 80) return '#4682B4';
    return '#34C759';
  };
  
  const getTankColor = () => {
    if (tankCapacity < 30) return '#FF3B30';
    if (tankCapacity < 50) return '#FF9500';
    return '#34C759';
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi jardín</Text>
          <Pressable 
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.notificationCard}>
          <Ionicons name="leaf-outline" size={24} color="#6B8E23" />
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>
              Descubre el nuevo sistema de riego inteligente
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </View>

        <PlantGrid 
          plants={plants} 
          onSelectPlant={handleSelectPlant}
        />

        <View style={styles.sensorsContainer}>
          <View style={styles.sensorCard}>
            <Ionicons name="water-outline" size={32} color="#4682B4" />
            <Text style={styles.sensorTitle}>Humedad Ambiente</Text>
            <Text style={[styles.sensorValue, { color: getHumidityColor() }]}>{ambientHumidity}%</Text>
            <Text style={styles.sensorSubtitle}>Sensor DHT11</Text>
            
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: humidityAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: getHumidityColor() 
                  }
                ]} 
              />
            </View>
          </View>

          <View style={styles.sensorCard}>
            <Ionicons name="beaker-outline" size={32} color="#6B8E23" />
            <Text style={styles.sensorTitle}>Capacidad Tanque</Text>
            <Text style={[styles.sensorValue, { color: getTankColor() }]}>{tankCapacity}%</Text>
            <Text style={styles.sensorSubtitle}>Sensor Ultrasónico</Text>
            
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: tankAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: getTankColor() 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <PlantModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddPlant}
      />

      <PlantDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedPlant(null);
        }}
        onSave={handleUpdatePlant}
        onTogglePump={handleTogglePump}
        onDelete={handleDeletePlant}
        plant={selectedPlant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 24,
    color: '#666',
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  sensorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  sensorCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  sensorValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  sensorSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});