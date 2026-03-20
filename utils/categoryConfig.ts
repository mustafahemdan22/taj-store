import { getOptimizedCloudinaryUrl } from "./productImage";

export const categoryHeroImages: Record<string, string> = {
    silk: "taj-scarf/categories/silk/header",
    wool: "taj-scarf/categories/wool/header",
    pashmina: "taj-scarf/categories/pashmina/header",
    cotton: "taj-scarf/categories/cotton/header",
    acrylic: "taj-scarf/categories/acrylic/header",
    infinity: "taj-scarf/categories/infinity/header",
    chiffon: "taj-scarf/categories/chiffon/header",
    viscose: "taj-scarf/categories/viscose/header",
};

// ... existing code ...

/**
 * Returns the correct Cloudinary image URL for a given category.
 * If the category ID does not exist, it returns a fallback image.
 */
export const getCategoryHeroImage = (category: string): string => {
    const publicId = categoryHeroImages[category] || "taj-scarf/categories/all/header";
    return getOptimizedCloudinaryUrl(publicId, 1200); // Higher width for heroes
};

// export const getCategoryEmoji = (category: string): string => {
//     return categoryEmojis[category] || "🧣";
// };
