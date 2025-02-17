// plantCard.tsx
import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plant } from "./plantType";

type Props = {
    plant: Plant;
    onPress: (plant: Plant) => void;
}

export function PlantCard({ plant, onPress }: Props) {
    const getCareLevel = () => {
        switch (plant.care_level?.toLowerCase()) {
            case "easy":
                return styles.easy;
            case "moderate":
                return styles.moderate;
            case "difficult":
                return styles.difficult;
            default:
                return styles.unknown;
        }
    };

    return (
        <TouchableOpacity onPress={() => onPress(plant)}>
            <View style={styles.card}>
                <Image 
                    style={styles.image}  
                    source={{
                        uri: plant.default_image?.thumbnail || 'https://via.placeholder.com/150',
                    }}
                />
                <View style={styles.content}>
                    <Text style={styles.label}>Nombre común:</Text>
                    <Text style={styles.textValue}>{plant.common_name}</Text>
                    
                    <Text style={styles.label}>Nombre científico:</Text>
                    <Text style={styles.textValue}>{plant.scientific_name?.[0]}</Text>

                    <Text style={styles.label}>Nivel de cuidado:</Text>
                    <View style={styles.row}>
                        <View style={[styles.careLevel, getCareLevel()]}/>
                        <Text style={styles.textValue}>{plant.care_level || 'Desconocido'}</Text>
                    </View>

                    <Text style={styles.label}>Humedad del suelo:</Text>
                    <Text style={styles.textValue}>{plant.soil_humidity || 'Desconocido'}</Text>
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

