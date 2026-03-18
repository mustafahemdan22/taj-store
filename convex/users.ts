import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Sync user from Clerk Webhook
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        profileImage: args.profileImage,
      });
    }

    // Try to find by email if they signed up previously via custom auth
    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingByEmail) {
      // Link the Clerk ID to the existing account
      return await ctx.db.patch(existingByEmail._id, {
        clerkId: args.clerkId,
        firstName: args.firstName, // Update with Clerk info
        lastName: args.lastName,
        profileImage: args.profileImage,
      });
    }

    // Insert new user
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      profileImage: args.profileImage,
    });
  },
});

// Optionally, add a getUser query to fetch current user data by clerkId
export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});
