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

    const InfoItem = ({ label, value }: { label: string; value: string | undefined }) => (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value || 'No disponible'}</Text>
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
                                source={{ uri: plant.image_url || 'https://via.placeholder.com/400' }} 
                                style={styles.plantImage}
                            />
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.plantName}>{plant.common_name || plant.scientific_name}</Text>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Información básica:</Text>
                                <InfoItem label="Nombre científico" value={plant.scientific_name} />
                                <InfoItem label="Familia común" value={plant.family_common_name} />
                                <InfoItem label="Familia" value={plant.family} />
                                <InfoItem label="Estado" value={plant.status} />
                                <InfoItem label="Rango" value={plant.rank} />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Detalles adicionales:</Text>
                                <InfoItem label="Año" value={plant.year?.toString()} />
                                <InfoItem label="Autor" value={plant.author} />
                                <InfoItem label="Observaciones" value={plant.observations} />
                                <InfoItem 
                                    label="Es vegetal" 
                                    value={plant.vegetable ? 'Sí' : 'No'} 
                                />
                            </View>

                            {plant.bibliography && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Bibliografía:</Text>
                                    <Text style={styles.bibliographyText}>{plant.bibliography}</Text>
                                </View>
                            )}
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
    bibliographyText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});