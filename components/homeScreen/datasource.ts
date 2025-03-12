import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, addDoc } from "firebase/firestore";
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
        plants.push({ ...doc.data(), id: doc.id } as Plant);
      });
      
      return plants;
    } catch (error) {
      console.error('Error al obtener plantas:', error);
      throw error;
    }
  }

  async savePlant(plant: Plant): Promise<Plant> {
    console.log('Intentando guardar planta:', plant);

    if (!plant.nombre || !plant.humedad) {
      throw new Error('Nombre y humedad son requeridos');
    }

    try {
      if (plant.id && plant.id.trim() !== '') {
        const plantRef = doc(this.collectionRef, plant.id);
        await setDoc(plantRef, plant, { merge: true });
        console.log('Planta actualizada exitosamente:', plant);
        return plant;
      } 
      else {
        const plants = await this.getPlants();
        const lastPlant = plants[0];
        const newId = lastPlant ? (parseInt(lastPlant.id || '0') + 1) : 1;

        const plantWithId = { ...plant, id: newId.toString() }; 
        
        const docRef = await addDoc(this.collectionRef, plantWithId);
        
        const newPlant = { ...plantWithId, id: docRef.id };
        
        console.log('Planta nueva guardada exitosamente:', newPlant);
        return newPlant;
      }
    } catch (error) {
      console.error('Error al guardar planta:', error);
      throw error;
    }
  }

  async deletePlant(id: string): Promise<boolean> {
    try {
      console.log("ID de la planta a eliminar:", id); 
      const plantDoc = doc(this.collectionRef, id);
      await deleteDoc(plantDoc);
      console.log("Planta eliminada correctamente");
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