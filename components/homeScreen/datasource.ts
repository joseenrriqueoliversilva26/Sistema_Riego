import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { Plant } from "./plant";
import { db } from "@/lib/firebase ";

export class DataSource {
  private collectionRef = collection(db, 'datos');

  async getPlants(): Promise<Plant[]> {
    try {
      const q = query(this.collectionRef, orderBy('id', 'desc'));
      const querySnapshot = await getDocs(q);
      const plants: Plant[] = [];
      
      querySnapshot.forEach((doc) => {
        plants.push(doc.data() as Plant);
      });
      
      return plants;
    } catch (error) {
      console.error('Error al obtener plantas:', error);
      throw error;
    }
  }

  async savePlant(plant: Plant): Promise<Plant> {
    console.log('Intentando guardar planta:', plant);

    if (!plant.id || !plant.nombre || !plant.humedad) {
      throw new Error('ID, nombre y humedad son requeridos');
    }

    try {
      const plantDoc = doc(this.collectionRef, plant.id);
      await setDoc(plantDoc, plant);
      console.log('Planta guardada exitosamente:', plant);
      return plant;
    } catch (error) {
      console.error('Error al guardar planta:', error);
      throw error;
    }
  }

  async deletePlant(id: string): Promise<boolean> {
    try {
      const plantDoc = doc(this.collectionRef, id);
      await deleteDoc(plantDoc);
      return true;
    } catch (error) {
      console.error('Error al eliminar planta:', error);
      throw error;
    }
  }
  async togglePlantPump(id: string, active: boolean): Promise<boolean> {
    try {
      const plantRef = doc(this.collectionRef, id);
      await setDoc(plantRef, { bombActive: active }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error al cambiar estado de bomba:', error);
      throw error;
    }
  }
}