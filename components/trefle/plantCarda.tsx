import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plant } from "./plantTypea";

type Props = {
    plant: Plant;
    onPress: (plant: Plant) => void;
}

export function PlantCard({ plant, onPress }: Props) {
    return (
        <TouchableOpacity onPress={() => onPress(plant)}>
            <View style={styles.card}>
                <Image 
                    style={styles.image}  
                    source={{
                        uri: plant.image_url || 'https://via.placeholder.com/150',
                    }}
                />
                <View style={styles.content}>
                    <Text style={styles.label}>Nombre común:</Text>
                    <Text style={styles.textValue}>{plant.common_name || 'No disponible'}</Text>
                    
                    <Text style={styles.label}>Nombre científico:</Text>
                    <Text style={styles.textValue}>{plant.scientific_name}</Text>

                    <Text style={styles.label}>Familia:</Text>
                    <Text style={styles.textValue}>{plant.family_common_name || plant.family || 'No disponible'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        height: 450,
        width: "100%",
        borderRadius: 15,
        borderWidth: 8,
        borderColor: "#2d5a27",
        padding: 10,
        marginVertical: 8,
        backgroundColor: 'white',
    },
    image: { 
        width: "50%", 
        height: "100%",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        resizeMode: "cover",
    },
    content: {
        flexDirection: "column",
        gap: 8,
        padding: 12,
    },
    careLevel: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    easy: {
        backgroundColor: "green",
    },
    moderate: {
        backgroundColor: "orange",
    },
    difficult: {
        backgroundColor: "red",
    },
    unknown: {
        backgroundColor: "grey",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    textValue: {
        fontSize: 18,
        color: "#3C3E44"
    },
    label: {
        fontSize: 21,
        color: "#2d5a27"
    }
});