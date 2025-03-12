import { Plant } from "./plantType";

export type PlantResult = {
    data: Plant[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    to: number;
};