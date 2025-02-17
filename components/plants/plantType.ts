// plantType.ts
export type Plant = {
    id: number;
    common_name: string;
    scientific_name: string[];
    cycle: string;
    watering: string;
    sunlight: string[];
    default_image?: {
        thumbnail: string;
        regular_url: string;
    };
    poisonous_to_pets: boolean;
    indoor: boolean;
    care_level: string;
    soil_humidity: string;
};