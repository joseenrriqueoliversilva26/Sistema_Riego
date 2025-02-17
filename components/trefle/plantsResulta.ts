import { Plant } from "./plantTypea";

// plantsResult.ts
export type PlantResult = {
    data: Plant[];
    to: number;
    per_page: number;
    current_page: number;
    last_page: number;
    total: number;
}