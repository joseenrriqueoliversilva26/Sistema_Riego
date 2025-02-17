export type Plant = {
    id: number;
    common_name?: string;  // Puede ser null
    scientific_name: string;
    family_common_name?: string; // Puede ser null
    family?: string;
    image_url?: string;
    year?: number;
    bibliography?: string;
    author?: string;
    status?: string;
    rank?: string;
    observations?: string;
    vegetable?: boolean;
    links: {
        self: string;
        plant: string;
        genus: string;
    };
};
