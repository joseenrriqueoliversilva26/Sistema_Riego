import { config } from "./config";
import { PlantResult } from "./plantsResult";

export class DataSource {
    private API_KEY = config.API_KEY;

    async getPlants(page: number, query?: string): Promise<PlantResult> {
        let url = `https://trefle.io/api/v1/plants?token=${this.API_KEY}&page=${page}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`; 
        }
        console.log("URL de la API:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        return response.json();
    }
}