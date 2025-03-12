import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plant } from "./plantType";

type Props = {
    plant: Plant;
    onPress: (plant: Plant) => void;
};

export function PlantCard({ plant, onPress }: Props) {
    return (
        <TouchableOpacity onPress={() => onPress(plant)} style={styles.cardContainer}>
            <View style={styles.card}>
                <Image 
                    style={styles.image}  
                    source={{
                        uri: plant.image_url || 'https://via.placeholder.com/150',
                    }}
                />
                <View style={styles.content}>
                    <Text style={styles.commonName} numberOfLines={2}>
                        {plant.common_name || 'Sin nombre común'}
                    </Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Científico:</Text>
                        <Text style={styles.scientificName} numberOfLines={1}>
                            {plant.scientific_name}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Familia:</Text>
                        <Text style={styles.family} numberOfLines={1}>
                            {plant.family_common_name || plant.family || 'No disponible'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    card: {
        flexDirection: "row",
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        height: 180,
    },
    image: { 
        width: "40%", 
        height: "100%",
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    commonName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#2d5a27",
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginRight: 8,
        fontWeight: '500',
    },
    scientificName: {
        fontSize: 14,
        color: "#333",
        flex: 1,
    },
    family: {
        fontSize: 14,
        color: "#333",
        flex: 1,
    }
});