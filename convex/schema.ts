import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // =========================
  // Categories
  // =========================
  categories: defineTable({
    slug: v.string(),           // URL slug, e.g. "viscose"
    name: v.string(),           // Arabic display name
    nameEn: v.string(),         // English display name
    heroImagePublicId: v.string(), // Cloudinary public_id
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"]),

  // =========================
  // Users
  // =========================
  users: defineTable({
    clerkId: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    password: v.optional(v.string()), // لازم لو هتعمل login داخلي
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // =========================
  // Products
  // =========================
  products: defineTable({
    name: v.string(),
    nameEn: v.string(),
    price: v.number(),
    category: v.string(),
    description: v.string(),
    descriptionEn: v.string(),
    brand: v.string(),
    stock: v.number(),
    unit: v.string(),
    rating: v.number(),
    reviews: v.number(),
    images: v.array(v.string()), // Cloudinary public_id فقط
    subtitle: v.optional(v.string()),
    badge: v.optional(v.string()),
    dynamicPrice: v.optional(v.string()),
  })
    .index("by_category", ["category"]),

  // =========================
  // Orders
  // =========================
  orders: defineTable({
    userId: v.string(),
    orderNumber: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        productDescription: v.string(),
        productCategory: v.string(),
        quantity: v.number(),
        price: v.number(),
        unitPrice: v.number(),
      })
    ),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    customerInfo: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    paymentMethod: v.string(),
    trackingNumber: v.optional(v.string()),
    deliveryDate: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_userId_and_status", ["userId", "status"]),

  // =========================
  // Reviews
  // =========================
  reviews: defineTable({
    productId: v.string(),
    userId: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_productId", ["productId"])
    .index("by_userId", ["userId"])
});