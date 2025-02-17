import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { PlantModal } from './plantModal';
import { PlantDataSource } from './datasource';
import { Plant } from './plant';
import { PlantGrid } from './plantGrid';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const dataSource = new PlantDataSource();

  useEffect(() => {
    loadPlants();
  }, []);

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
      setModalVisible(false);
    } catch (error) {
      console.error('Error al guardar planta:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi jardín</Text>
          <Pressable 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
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
            <Text style={styles.notificationSubtitle}>
              No mostrar de nuevo
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#999" />
        </View>

        <PlantGrid plants={plants} />

        <View style={styles.sensorsContainer}>
          <View style={styles.sensorCard}>
            <Ionicons name="water-outline" size={32} color="#4682B4" />
            <Text style={styles.sensorTitle}>Humedad Ambiente</Text>
            <Text style={styles.sensorValue}>65%</Text>
            <Text style={styles.sensorSubtitle}>Sensor DHT11</Text>
          </View>

          <View style={styles.sensorCard}>
            <Ionicons name="beaker-outline" size={32} color="#6B8E23" />
            <Text style={styles.sensorTitle}>Capacidad Tanque</Text>
            <Text style={styles.sensorValue}>75%</Text>
            <Text style={styles.sensorSubtitle}>Sensor Ultrasónico</Text>
          </View>
        </View>
      </ScrollView>

      <PlantModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddPlant}
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
  },
});