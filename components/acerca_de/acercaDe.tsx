import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export const AcercaDe: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>Sistema de Riego Inteligente para Jardines</Text>
        <Text style={styles.description}>
          Este proyecto tiene como objetivo optimizar el uso del agua en jardines mediante un sistema de riego
          automatizado. Utilizando sensores de humedad y temperatura, el sistema puede determinar cuándo es
          necesario regar las plantas, evitando el desperdicio de agua y mejorando la eficiencia en el mantenimiento
          de áreas verdes.
        </Text>
        <Text style={styles.subTitle}>Características del Proyecto:</Text>
        <Text style={styles.listItem}>✔ Monitoreo en tiempo real de la humedad del suelo.</Text>
        <Text style={styles.listItem}>✔ Activación automática del riego cuando es necesario.</Text>
        <Text style={styles.listItem}>✔ Integración con una aplicación móvil para control y seguimiento.</Text>
        <Text style={styles.listItem}>✔ Ahorro de agua y optimización del crecimiento de las plantas.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9", 
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#388e3c", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32", 
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#4caf50", 
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 24,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b5e20", 
    textAlign: "center",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    color: "#43a047", 
    textAlign: "left",
    marginBottom: 5,
  },
});

export default AcercaDe;
