import { config } from "./config";
import { PlantResult } from "./plantsResult";

export class DataSource {
    private API_KEY = config.API_KEY;

    async getPlants(page: number = 1, query?: string): Promise<PlantResult> {
        let url = `https://trefle.io/api/v1/plants?token=${this.API_KEY}&page=${page}`;
        
        if (query) {
            url += `&filter[common_name]=${encodeURIComponent(query)}`;
        }

        console.log("API URL:", url);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Request error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                data: data.data,
                current_page: data.links.self.match(/page=(\d+)/)?.[1] || page,
                last_page: data.links.last ? 
                    parseInt(data.links.last.match(/page=(\d+)/)?.[1] || '1') : 
                    page,
                per_page: data.meta?.per_page || 20,
                total: data.meta?.total || 0,
                to: data.meta?.to || 0
            };
        } catch (error) {
            console.error("Error fetching plants:", error);
            throw error;
        }
    }
}