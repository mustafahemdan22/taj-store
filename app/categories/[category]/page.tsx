import { notFound } from "next/navigation";
import CategoryDetailClient from "./CategoryDetailClient";
import { convexServerClient } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

type Category = {
  slug: string;
  name: string;
  nameEn: string;
  heroImagePublicId: string;
};
export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const slug = (category || "").toLowerCase();
  if (!slug) return notFound();

  const client = convexServerClient();

  const [cat, products] = await Promise.all([
    client.query(api.functions.categories.getCategoryBySlug, { slug }),
    client.query(api.functions.products.getProductsByCategory, { category: slug }),
    
  ]);

  if (!cat) return notFound();

  return (
    <CategoryDetailClient
      category={cat as unknown as Category}
      products={products as unknown as import("@/types").Product[]}
    />
  );
}
