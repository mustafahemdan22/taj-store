// cloudinaryCheck.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY; 
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const CATEGORIES = [
  "silk",
  "wool",
  "pashmina",
  "cotton",
  "acrylic",
  "infinity",
  "chiffon",
  "viscose",
];

// ✅ تحقق من وجود الصورة على Cloudinary
async function checkImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.api.resource(publicId);
    return true;
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "http_code" in err &&
      (err as { http_code?: number }).http_code === 404
    ) {
      return false;
    }
    const message =
      err instanceof Error ? err.message : JSON.stringify(err, null, 2);
    // console.error("Cloudinary error for", publicId, message); // قفلت دي عشان الكونسول ميتزحمش
    return false;
  }
}

// ✅ تحقق لكل الصور في كل الكاتيجوريز
async function checkCategories() {
  console.log("🔍 جاري فحص الصور على المسار الجديد...");
  const report: Record<string, { found: string[]; missing: string[] }> = {};

  for (const category of CATEGORIES) {
    const heroImage = `categories/${category}/header`;
    
    // 🚀 التعديل هنا: المسار بقى بيطابق النظام الجديد بالمللي
    const productImages = Array.from({ length: 5 }, (_, i) => `categories/${category}/products/${i + 1}`);

    const allImages = [heroImage, ...productImages];
    const found: string[] = [];
    const missing: string[] = [];

    for (const img of allImages) {
      const normalizedId = img.startsWith('taj-scarf/') ? img : `taj-scarf/${img}`;
      const exists = await checkImage(normalizedId);
      if (exists) found.push(img);
      else missing.push(img);
    }

    report[category] = { found, missing };
    console.log(`✅ ${category}: Found ${found.length}, Missing ${missing.length}`);
  }

  fs.writeFileSync('cloudinaryReport.json', JSON.stringify(report, null, 2));
  console.log('📄 Report saved: cloudinaryReport.json');
}

export { CATEGORIES };
export default cloudinary;

// شغل الدالة فوراً لما نشغل الملف
checkCategories().catch(console.error);