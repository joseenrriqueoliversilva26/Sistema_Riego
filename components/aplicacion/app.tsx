import React from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";

export const APP: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Sistema de Riego Inteligente con Arduino</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula dapibus nisl, id volutpat sapien
            dictum at. Vivamus vitae nulla vel mi posuere tincidunt vel in ligula.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Monitoreo de Humedad</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi esse, voluptate obcaecati ratione soluta, deserunt accusamus blanditiis dicta aut facere hic. Iusto perspiciatis ex adipisci laboriosam blanditiis laudantium labore esse.
          </Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Componentes del Proyecto</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            Sensor de humedad del suelo
            Arduino Uno
            Bomba de agua
            Relé de control
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Funcionamiento</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            El sistema detecta la humedad y activa el riego automáticamente cuando es necesario.
          </Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Interfaz de Usuario</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            Controla y monitorea el sistema desde una aplicación móvil intuitiva.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Eficiencia del Sistema</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            Reduce el desperdicio de agua y mejora la salud de las plantas.
          </Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.title}>Beneficios</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            Ahorro de agua
            Mayor eficiencia en el riego
            Fácil implementación
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Futuras Mejoras</Text>
          <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero, at aliquam animi ullam tempore, adipisci, quas inventore officia quos sunt fuga eveniet illum labore quasi provident nihil. Quae, dicta molestiae!
          </Text>
        </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    width: "45%",
    maxWidth: 400,
    shadowColor: "#388e3c", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    alignItems: "center",
    marginBottom: 20,
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
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default APP;
