
import { getOptimizedCloudinaryUrl } from "./productImage";


export type CategoryAssets = {
    header: string;
};

export const categoriesImages: Record<string, CategoryAssets> = {
    silk: { header: "taj-scarf/categories/silk/header" },
    wool: { header: "taj-scarf/categories/wool/header" },
    pashmina: { header: "taj-scarf/categories/pashmina/header" },
    cotton: { header: "taj-scarf/categories/cotton/header" },
    acrylic: { header: "taj-scarf/categories/acrylic/header" },
    infinity: { header: "taj-scarf/categories/infinity/header" },
    chiffon: { header: "taj-scarf/categories/chiffon/header" },
    viscose: { header: "taj-scarf/categories/viscose/header" },
};

/**
 * Helper to get images for a specific category.
 * Provides fallback defaults if the category slug is unmapped.
 */
export function getCategoryAssets(slug: string): CategoryAssets {
    const normalizedSlug = slug.toLowerCase();

    const result = categoriesImages[normalizedSlug] || {
        header: "taj-scarf/categories/all",


    };



    return {
        header: getOptimizedCloudinaryUrl(result.header, 1200),
    };
}
