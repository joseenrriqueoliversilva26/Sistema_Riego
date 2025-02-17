import { config } from "./configa";
import { PlantResult } from "./plantsResulta";

export class DataSource {
    private API_KEY = config.API_KEY;

    async getPlants(page: number): Promise<PlantResult> {
        const url = `https://trefle.io/api/v1/plants?token=${this.API_KEY}&page=${page}`;
        console.log("URL de la API:", url); // 👈 Agregar esto para verificar la URL

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        return response.json();
    }
}
