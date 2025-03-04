import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plant } from './plant';

type PlantGridProps = {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
};

export function PlantGrid({ plants, onSelectPlant }: PlantGridProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={styles.card}
            onPress={() => onSelectPlant(plant)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="leaf" size={24} color="#6B8E23" />
            </View>
            <Text style={styles.plantName} numberOfLines={1}>
              {plant.nombre}
            </Text>
            <View style={styles.humidityContainer}>
              <Ionicons name="water" size={14} color="#4682B4" />
              <Text style={styles.humidityText}>{plant.humedad}%</Text>
            </View>
            {plant.bombActive && (
              <View style={styles.pumpActive}>
                <Ionicons name="water-outline" size={12} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    gap: 12, 
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '48%', 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  humidityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  humidityText: {
    marginLeft: 4,
    color: '#4682B4',
    fontWeight: '500',
    fontSize: 12,
  },
  pumpActive: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4682B4',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});