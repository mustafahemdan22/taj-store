import { v2 as cloudinary } from 'cloudinary';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// ============================================================================
// CONFIGURATION
// ============================================================================

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// 2. Define the folder/prefix to scan on Cloudinary
const CLOUDINARY_FOLDER_TO_SCAN = 'taj-scarf';

// 3. Set to true ONLY when you are 100% sure you want to permanently DELETE files.
const ACTUALLY_DELETE_FILES = false;

// ============================================================================
// LOGIC
// ============================================================================

/**
 * Uses `git grep` or standard regex to find all hardcoded or referenced public_ids in the project.
 * This looks for exact strings that start with 'taj-scarf/' inside .ts, .tsx, .js, .json files.
 */
function scanCodeForPublicIds(): Set<string> {
  const validIds = new Set<string>();
  
  console.log('🔍 Scanning local project files and database dumps for Cloudinary public_ids...');

  // 1. Scan db_dump.json if it exists (for dynamic content in Convex)
  const dbDumpPath = './db_dump.json';
  if (existsSync(dbDumpPath)) {
    try {
      const dbDump = readFileSync(dbDumpPath, 'utf-8');
      const data = JSON.parse(dbDump);
      if (Array.isArray(data.categories)) {
        data.categories.forEach((cat: any) => {
          if (cat.heroImagePublicId) validIds.add(cat.heroImagePublicId);
        });
      }
      if (Array.isArray(data.products)) {
        data.products.forEach((prod: any) => {
          if (Array.isArray(prod.images)) {
            prod.images.forEach((img: string) => validIds.add(img));
          }
        });
      }
      console.log(`✅ Loaded IDs from db_dump.json`);
    } catch(e) { 
      console.error('Error parsing db_dump.json', e);
    }
  }

  // 2. Scan convex/productData.ts (seed data logic)
  const productDataPath = './convex/productData.ts';
  if (existsSync(productDataPath)) {
    try {
       // We know the seed data generates placeholders systematically. 
       // If you ever change the seed data structure, this logic needs to be updated.
       const slugs = ['silk', 'wool', 'pashmina', 'cotton', 'acrylic', 'infinity'];
       slugs.forEach(slug => {
         validIds.add(`taj-scarf/categories/${slug}/header`);
         for(let i=1; i<=6; i++) {
            validIds.add(`taj-scarf/categories/${slug}/products/${i}`);
         }
       });
       console.log(`✅ Loaded seed data placeholder logic from convex/productData.ts`);
    } catch(e) { console.error(e); }
  }

  // 3. Scan the codebase for raw "taj-scarf/..." strings using a simple grep
  try {
    const grepCommand = `git grep -ho "taj-scarf/[a-zA-Z0-9_/-]*" || echo ""`;
    const grepOutput = execSync(grepCommand, { encoding: 'utf-8' });
    
    if (grepOutput.trim()) {
        const matches = grepOutput.split('\n');
        matches.forEach(match => {
           match = match.trim();
           match = match.replace(/['"]+/g, ''); // Remove quotes
           if (match.startsWith('taj-scarf/')) {
               // Remove trailing image extensions just in case (Cloudinary public_id doesn't usually include it)
               match = match.replace(/\.(png|jpg|jpeg|webp)$/i, '');
               validIds.add(match);
           }
        });
        console.log(`✅ Extracted static string references from code.`);
    }
  } catch (error) {
    console.warn("⚠️  Warning scanning code (git grep failed). Are you in a git repository?");
  }

  console.log(`✨ Total unique valid public_ids discovered: ${validIds.size}`);
  return validIds;
}

async function cleanupCloudinary() {
  console.log('==================================================');
  console.log('🧹 STARTING CLOUDINARY CLEANUP SCAN');
  console.log(`📂 Scanning folder: ${CLOUDINARY_FOLDER_TO_SCAN}`);
  console.log(`⚠️  Delete Mode: ${ACTUALLY_DELETE_FILES ? 'ON (Dangerous!)' : 'OFF (Dry Run)'}`);
  console.log('==================================================\n');

  const VALID_PUBLIC_IDS = scanCodeForPublicIds();

  if (VALID_PUBLIC_IDS.size === 0) {
      console.log('❌ No valid IDs found. Aborting to prevent accidental deletion of everything.');
      console.log('Ensure you have a db_dump.json file located in the root or that the code contains image paths.');
      return;
  }

  try {
    // 1. Fetch ALL images currently under the specified folder in Cloudinary
    console.log('\nFetching files from Cloudinary API (this may take a moment)...');
    
    let allCloudinaryImages: string[] = [];
    let nextCursor: string | undefined = undefined;

    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: CLOUDINARY_FOLDER_TO_SCAN,
        max_results: 500,
        next_cursor: nextCursor,
      }) as { resources: { public_id: string }[], next_cursor?: string };

      const batchIds = result.resources.map(res => res.public_id);
      allCloudinaryImages = allCloudinaryImages.concat(batchIds);
      nextCursor = result.next_cursor;
      
    } while (nextCursor);

    console.log(`Found a total of ${allCloudinaryImages.length} images on Cloudinary.`);

    // 2. Compare to find EXTRA/UNUSED images
    const extraImages: string[] = [];
    const validImagesFound: string[] = [];

    for (const cloudinaryId of allCloudinaryImages) {
      if (VALID_PUBLIC_IDS.has(cloudinaryId)) {
        validImagesFound.push(cloudinaryId);
      } else {
        extraImages.push(cloudinaryId);
      }
    }

    console.log(`\nAnalysis Results:`);
    console.log(`✅ Valid/Used Images Found: ${validImagesFound.length}`);
    console.log(`🗑️  Extra/Unused Images Found: ${extraImages.length}`);

    if (extraImages.length > 0) {
        console.log('\nSample of unused images that will be targeted:');
        extraImages.slice(0, 5).forEach(img => console.log(`   - ${img}`));
        if (extraImages.length > 5) console.log(`   ... and ${extraImages.length - 5} more.`);
    }

    // 3. Delete the extra images (if enabled)
    const deletedImages: string[] = [];
    const failedDeletes: { id: string; reason: string }[] = [];

    if (extraImages.length > 0 && ACTUALLY_DELETE_FILES) {
      console.log('\n🗑️  Executing Deletion Pipeline...');
      
      const chunkSize = 100;
      for (let i = 0; i < extraImages.length; i += chunkSize) {
        const chunk = extraImages.slice(i, i + chunkSize);
        console.log(`Deleting chunk ${i} to ${i + chunk.length}...`);
        
        try {
          const deleteResult = await cloudinary.api.delete_resources(chunk);
          for (const [id, status] of Object.entries(deleteResult.deleted)) {
            if (status === 'deleted') {
              deletedImages.push(id);
            } else {
              failedDeletes.push({ id, reason: String(status) });
            }
          }
        } catch (err: any) {
          console.error('Failed to delete chunk:', err.message);
          chunk.forEach(id => failedDeletes.push({ id, reason: err.message }));
        }
      }
    } else if (extraImages.length > 0 && !ACTUALLY_DELETE_FILES) {
      console.log('\nℹ️  Skipping Deletion: ACTUALLY_DELETE_FILES is set to false.');
    }

    // 4. Generate JSON Report
    const reportStr = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFoundOnCloud: allCloudinaryImages.length,
        totalUsedByProject: VALID_PUBLIC_IDS.size,
        validImagesConfirmed: validImagesFound.length,
        extraImagesDetected: extraImages.length,
        imagesSuccessfullyDeleted: deletedImages.length,
        failedDeletions: failedDeletes.length,
        mode: ACTUALLY_DELETE_FILES ? "Deletion Executed" : "Dry Run Only"
      },
      lists: {
        extraImagesTargeted: extraImages,
        successfullyDeleted: deletedImages,
        failedToToDelete: failedDeletes
      }
    };

    writeFileSync('cloudinaryCleanupReport.json', JSON.stringify(reportStr, null, 2));

    console.log('\n==================================================');
    console.log('✅ CLEANUP SCAN COMPLETE');
    console.log('📄 Detailed report saved to "cloudinaryCleanupReport.json"');
    console.log('==================================================');

  } catch (error) {
    console.error('❌ An error occurred during the cleanup process:', error);
  }
}

cleanupCloudinary();
