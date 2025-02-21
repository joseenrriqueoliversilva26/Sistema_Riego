import { supabase } from "@/lib/supabase";
import { Plant } from "./plant";

export class PlantDataSource {
  async getPlants(): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('datos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al obtener plantas:', error.message);
      throw error;
    }
    return data || [];
  }

  async savePlant(plant: Plant): Promise<Plant> {
    console.log('Intentando guardar planta:', plant);

    if (!plant.id || !plant.nombre || !plant.humedad) {
      throw new Error('ID, nombre y humedad son requeridos');
    }

    try {
      const { data, error } = await supabase
        .from('datos')
        .upsert([{
          id: plant.id,
          nombre: plant.nombre,
          humedad: plant.humedad
        }])
        .select()
        .single();

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No se recibieron datos después de guardar');
      }

      console.log('Planta guardada exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error al guardar planta:', error);
      throw error;
    }
  }

  async deletePlant(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('datos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar planta:', error.message);
      throw error;
    }
    return true;
  }
}