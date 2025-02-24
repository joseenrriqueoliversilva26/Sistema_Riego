export type Plant = {
    id: number;
    common_name?: string; 
    scientific_name: string;
    family_common_name?: string;
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