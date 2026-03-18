import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { premiumProductData } from "../productData";

// Add a single product
export const createProduct = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    price: v.number(),
    images: v.array(v.string()),
    category: v.string(),
    description: v.string(),
    descriptionEn: v.string(),
    brand: v.string(),
    stock: v.number(),
    unit: v.string(),
    rating: v.number(),
    reviews: v.number(),
  },



  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      category: args.category.trim().toLowerCase(),
    });
  },
});




export const getProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getProductById = query({
  args: { productId: v.string() },
  handler: async ({ db }, args) => {
    if (!args.productId) return null;
    try {
      const id = db.normalizeId("products", args.productId);
      if (!id) return null;
      return await db.get(id);
    } catch {
      return null;
    }
  },
});

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const category = args.category.trim().toLowerCase();

    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) =>
        q.eq("category", category)
      )
      .collect();
  },
});

export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return { deleted: true };
  },
});

// Update product image(s) with Cloudinary IDs
export const updateProductImage = mutation({
  args: {
    productId: v.id("products"),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, {
      images: args.images
    });
    return { success: true };
  },
});

/**
 * Migration: Normalize all products to use ONLY the images array.
 * Cleans up legacy 'image' field and ensures public IDs include correct paths.
 */
export const migrateToStrictCloudinary = mutation({
  args: {},
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    let updated = 0;

    for (const product of allProducts) {
      const legacyImage = (product as any).image;
      let finalImages = product.images || [];

      // If we have a legacy image not in the array, add it to the front
      if (legacyImage && !finalImages.includes(legacyImage)) {
        finalImages = [legacyImage, ...finalImages];
      }

      // Filter out empty or placeholder strings
      finalImages = finalImages.filter(img =>
        img &&
        !img.includes('coming-soon')
      );

      // Normalize paths: ensure public_id includes the correct category folder
      // e.g., if it's just "1", convert to "taj-scarf/categories/[category]/products/1"
      finalImages = finalImages.map(img => {
        if (img.startsWith('http') || img.includes('/')) return img;
        // It's a flat ID, prepend the standard path
        return `products/${product.category}/${img}`;
      });

      // Remove duplicates
      finalImages = [...new Set(finalImages)];

      // Always update to ensure 'image' field is removed by patch (schema update will handle the rest)
      const patchData: any = { images: finalImages };
      // We set legacy image to undefined if it exists just to be safe during the transition
      if (legacyImage !== undefined) {
        patchData.image = undefined;
      }

      await ctx.db.patch(product._id, patchData);
      updated++;
    }

    return `Successfully migrated ${updated} products to strict Cloudinary architecture.`;
  },
});

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing products to avoid duplicates and fix paths
    const existingProds = await ctx.db.query("products").collect();
    for (const prod of existingProds) {
      await ctx.db.delete(prod._id);
    }

    let count = 0;

    // Loop through each category in your product data
    for (const [category, items] of Object.entries(premiumProductData)) {
      for (const item of items) {

        // Insert each product into the database
        await ctx.db.insert("products", {
          name: item.nameAr,
          nameEn: item.nameEn,
          description: item.descriptionAr,
          descriptionEn: item.descriptionEn,
          category: category,

          // Provide default values for required fields 
          price: 1000,
          brand: "Taj",
          stock: 10,
          unit: "piece",
          rating: 5,
          reviews: 0,
          images: [`taj-scarf/categories/${category}/products/1`],
        });
        count++;
      }
    }

    return `Successfully seeded ${count} products!`;
  },
});
