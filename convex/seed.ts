import { mutation } from "./_generated/server";
import { premiumProductData } from "./productData";

const CATEGORIES = [
  {
    slug: "silk",
    name: "حرير",
    nameEn: "Silk",
    heroImagePublicId: "taj-scarf/categories/silk/header",
    description: "حرير طبيعي أنيق وناعم",
    descriptionEn: "Elegant and soft natural silk",
    sortOrder: 2,
  },
  {
    slug: "wool",
    name: "صوف",
    nameEn: "Wool",
    heroImagePublicId: "taj-scarf/categories/wool/header",
    description: "صوف عالي الجودة للشتاء",
    descriptionEn: "High-quality winter wool",
    sortOrder: 3,
  },
  {
    slug: "pashmina",
    name: "باشمينا",
    nameEn: "Pashmina",
    heroImagePublicId: "taj-scarf/categories/pashmina/header",
    description: "باشمينا فاخرة للمناسبات",
    descriptionEn: "Luxury pashmina for special occasions",
    sortOrder: 4,
  },
  {
    slug: "cotton",
    name: "قطن",
    nameEn: "Cotton",
    heroImagePublicId: "taj-scarf/categories/cotton/header",
    description: "قطن مصري ناعم وعملي",
    descriptionEn: "Soft and practical Egyptian cotton",
    sortOrder: 5,
  },
  {
    slug: "acrylic",
    name: "أكريليك",
    nameEn: "Acrylic",
    heroImagePublicId: "taj-scarf/categories/acrylic/header",
    description: "أكريليك دافئ للاستخدام اليومي",
    descriptionEn: "Warm acrylic for daily use",
    sortOrder: 6,
  },
  {
    slug: "infinity",
    name: "إنفينيتي",
    nameEn: "Infinity",
    heroImagePublicId: "taj-scarf/categories/infinity/header",
    description: "أوشحة إنفينيتي الدائرية العملية",
    descriptionEn: "Practical circular infinity scarves",
    sortOrder: 7,
  },
];

/**
 * Seed mutation to safely populate Categories and Products in the Convex database.
 * Run this by executing: `npx convex run seed`
 */
export default mutation({
  handler: async (ctx) => {
    // === 🚨 ADDED EXPERIMENTAL WIPE 🚨 ===
    // Wipe all existing products to ensure the new ones (with new images) replace the old ones.
    const allExistingProducts = await ctx.db.query("products").collect();
    for (const prod of allExistingProducts) {
      await ctx.db.delete(prod._id);
    }
    
    // Also wipe categories to clear out any removed 
    const allExistingCategories = await ctx.db.query("categories").collect();
    for (const cat of allExistingCategories) {
      await ctx.db.delete(cat._id);
    }
    // ===================================

    let categoriesInserted = 0;
    let productsInserted = 0;

    for (const cat of CATEGORIES) {
      // 1. Insert Category if it doesn't already exist (Idempotent)
      const existingCategory = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .first();

      if (!existingCategory) {
        await ctx.db.insert("categories", {
          slug: cat.slug,
          name: cat.name,
          nameEn: cat.nameEn,
          heroImagePublicId: cat.heroImagePublicId,
          description: cat.description,
          descriptionEn: cat.descriptionEn,
          sortOrder: cat.sortOrder,
        });
        categoriesInserted++;
      }

      // 2. Fetch seed data for products from productData.ts
      const productsData = premiumProductData[cat.slug as keyof typeof premiumProductData] || [];
      if (productsData.length === 0) continue;

      // Ensure we insert exactly 25 products per category
      // Optimization: Fetch all existing products for this category first to prevent doing 25 separate queries
      const existingCategoryProducts = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", cat.slug))
        .collect();
      const existingProductNames = new Set(existingCategoryProducts.map((p) => p.nameEn));

      for (let i = 0; i < 25; i++) {
        // Reuse products and append a sequence if we exceed the available seed data length
        const baseProduct = productsData[i % productsData.length];
        const isDuplicate = i >= productsData.length;

        const productNameArabic = isDuplicate ? `${baseProduct.nameAr} - إصدار ${i + 1}` : baseProduct.nameAr;
        const productNameEnglish = isDuplicate ? `${baseProduct.nameEn} - V${i + 1}` : baseProduct.nameEn;

        // Check if product already exists via our Set
        if (!existingProductNames.has(productNameEnglish)) {
          await ctx.db.insert("products", {
            name: productNameArabic,
            nameEn: productNameEnglish,
            // Generate a random, realistic price
            price: Math.floor(Math.random() * (250 - 50 + 1)) + 50,
            category: cat.slug,
            description: baseProduct.descriptionAr,
            descriptionEn: baseProduct.descriptionEn,
            brand: "Taj Scarf",
            stock: Math.floor(Math.random() * 100) + 10,
            unit: "Piece",
            rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // Rating between 3.5 and 5.0
            reviews: Math.floor(Math.random() * 100),
            // Assign exactly ONE image based on the specific index in the generation loop (1-indexed)
            images: [
              `taj-scarf/categories/${cat.slug}/products/${i + 1}`
            ],
            subtitle: "Premium Collection",
            // Pass undefined optionally (Convex strips these out or handles them directly if schema permits)
          });
          existingProductNames.add(productNameEnglish);
          productsInserted++;
        }
      }
    }

    // Print a report matching requirements
    const reportStr = `🌱 SEED REPORT 🌱\nCategories Inserted: ${categoriesInserted} \nProducts Inserted: ${productsInserted}`;
    console.log(reportStr);

    return {
      success: true,
      message: "Seed completed successfully",
      categoriesInserted,
      productsInserted,
    };
  },
});
