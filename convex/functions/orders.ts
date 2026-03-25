import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
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
  },
  handler: async ({ db }, args) => {
    return await db.insert("orders", args);
  },
});
