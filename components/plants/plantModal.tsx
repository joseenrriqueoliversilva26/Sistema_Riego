// plantModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Plant } from './plantType';

type PlantModalProps = {
    plant: Plant | null;
    visible: boolean;
    onClose: () => void;
};

export function PlantModal({ plant, visible, onClose }: PlantModalProps) {
    if (!plant) return null;

    const getCareColor = () => {
        switch (plant.care_level?.toLowerCase()) {
            case "easy":
                return "#55CC44";
            case "moderate":
                return "#FFA500";
            case "difficult":
                return "#D63D2E";
            default:
                return "#9E9E9E";
        }
    };

    const InfoItem = ({ label, value }: { label: string; value: string | string[] }) => (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>
                {Array.isArray(value) ? value.join(', ') : value}
            </Text>
        </View>
    );

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View style={styles.imageContainer}>
                            <Image 
                                source={{ uri: plant.default_image?.regular_url || 'https://via.placeholder.com/400' }} 
                                style={styles.plantImage}
                            />
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.plantName}>{plant.common_name}</Text>
                            
                            <View style={styles.careLevelContainer}>
                                <View style={[styles.careLevelDot, { backgroundColor: getCareColor() }]} />
                                <Text style={styles.careLevelText}>
                                    Nivel de cuidado: {plant.care_level || 'Desconocido'}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Información básica:</Text>
                                <InfoItem label="Nombre científico" value={plant.scientific_name} />
                                <InfoItem label="Ciclo" value={plant.cycle || 'Desconocido'} />
                                <InfoItem label="Riego" value={plant.watering || 'Desconocido'} />
                                <InfoItem label="Humedad del suelo" value={plant.soil_humidity || 'Desconocido'} />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Condiciones:</Text>
                                <InfoItem label="Luz solar" value={plant.sunlight} />
                                <InfoItem label="Interior" value={plant.indoor ? 'Sí' : 'No'} />
                                <InfoItem 
                                    label="Tóxica para mascotas" 
                                    value={plant.poisonous_to_pets ? 'Sí' : 'No'} 
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        width: width * 0.9,
        maxHeight: height * 0.9,
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    plantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 20,
    },
    plantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d5a27',
        marginBottom: 8,
    },
    careLevelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    careLevelDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    careLevelText: {
        fontSize: 16,
        color: '#6E798C',
    },
    section: {
        marginTop: 20,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d5a27',
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoLabel: {
        flex: 1,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        flex: 2,
        fontSize: 16,
        color: '#333',
    },
});

