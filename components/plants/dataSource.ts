// dataSource.ts
import { config } from "./config";
import { PlantResult } from "./plantsResult";

export class DataSource {
    private API_KEY = config.API_KEY;

    async getPlants(page: number, search?: string): Promise<PlantResult> {
        const searchParam = search ? `&q=${encodeURIComponent(search)}` : '';
        const response = await fetch(
            `https://perenual.com/api/species-list?page=${page}&key=${this.API_KEY}${searchParam}`
        );
        return response.json();
    }
}