import { Product } from "../types/index";

const CLOUDINARY_CLOUD_NAME = "dfq1xxerr"



/**
 * Dynamically generates an optimized Cloudinary URL for a given public_id.
 * Final shape (required):
 * https://res.cloudinary.com/<cloud_name>/image/upload/f_auto,q_auto,w_<width>/<public_id>
 */
export function getOptimizedCloudinaryUrl(
  publicId: string,
  width = 800
): string {
  if (!publicId) return "";

  if (!CLOUDINARY_CLOUD_NAME) {
    console.error(
      "[Cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set or is empty cannot build URL."
    );
    return "";
  }

  // Architecture guard: we expect only public_id values here.
  // If a full URL slips through, return as‑is.
  if (publicId.startsWith("http")) {
    // If it's a known broken OIP_11 URL, return empty to trigger fallback UI
    if (publicId.includes("OIP_")) return "";
    return publicId;
  }

  const cleanId = publicId.startsWith("/") ? publicId.slice(1) : publicId;
  if (cleanId.includes("placeholder-") || cleanId.includes("OIP_")) {
    return "../../public/header.jpg"; // صورة افتراضية موجودة في public
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${cleanId}`;
}

/**
 * Resolves the best available image URL for a product.
 * Priority: first of product.images.
 */
export function getProductImageUrl(product: Product): string {
  const raw =
    product?.images && product.images.length > 0 ? product.images[0] : null;

  if (!raw) return "";

  return getOptimizedCloudinaryUrl(raw);
}

/**
 * Resolves all available image URLs for a product.
 */
export function getProductImages(product: Product | null | undefined): string[] {
  if (!product) return [];
  const rawImages: string[] = product.images || [];

  if (rawImages.length === 0) {
    return [];
  }

  return rawImages.map((img) => getOptimizedCloudinaryUrl(img));
}
