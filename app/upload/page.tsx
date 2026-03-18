"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiCheckCircle, FiX, FiInfo} from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";
import { Id } from "../../convex/_generated/dataModel";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];


export default function UploadPage() {
  const products = useQuery(api.functions.products.getProducts);
  const updateProductImage = useMutation(api.functions.products.updateProductImage);
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a supported image type`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }

    // Reset input value so the same file can be selected again if needed
    e.target.value = "";
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  }, []);

  const handleUpload = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product first");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading images to Cloudinary...");

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append("images", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload to Cloudinary failed");
      }

      const publicIds = data.publicIds;

      if (!publicIds || publicIds.length === 0) {
        throw new Error("No public IDs returned from Cloudinary");
      }

      // 2. Save Cloudinary Public IDs (or URLs) to Convex
      // We are opting to save public_id for dynamic transformations
      await updateProductImage({
        productId: selectedProductId as Id<"products">,
        images: publicIds,
      });

      toast.success("Images uploaded and saved successfully!", { id: toastId });
      
      // Cleanup previews before resetting
      previews.forEach(url => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviews([]);
      setSelectedProductId("");
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Upload failed. Please try again.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const selectedProduct = products?.find(p => p._id === selectedProductId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Product Images <span className="text-zinc-500">Uploader</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Upload uniquely optimized images to Cloudinary for each product. 
            </p>
          </div>

          <div className="space-y-8">
            {/* Product Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                1. Select Product
              </label>
              <div className="relative">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-[#EEEFF1] dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all outline-none appearance-none cursor-pointer pr-12"
                >
                  <option value="">-- Choose a product to update --</option>
                  {products?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nameEn || p.name} — {p.category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <FiInfo className="w-5 h-5" />
                </div>
              </div>
              {selectedProduct && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 pl-1">
                  Currently selected: <span className="font-bold">{selectedProduct.nameEn || selectedProduct.name}</span>
                </p>
              )}
            </div>

            {/* File Dropzone */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                2. Choose Images
              </label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  disabled={isUploading || !selectedProductId}
                  className={`absolute inset-0 w-full h-full opacity-0 z-10 ${!selectedProductId ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <div className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                  !selectedProductId 
                    ? 'border-gray-50 bg-gray-50 dark:bg-gray-800/20 opacity-50' 
                    : 'border-gray-100 dark:border-gray-800 bg-[#EEEFF1]/50 dark:bg-gray-900/50 group-hover:border-zinc-500/50'
                }`}>
                  <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FiUpload className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                    {!selectedProductId ? "Select a product first" : "Click to browse or drag & drop"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">WEBP, PNG, JPG (Max 10MB)</p>
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            <AnimatePresence>
              {previews.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Selected Files ({previews.length})</span>
                    <button 
                      onClick={() => {
                        previews.forEach(url => URL.revokeObjectURL(url));
                        setSelectedFiles([]);
                        setPreviews([]);
                      }}
                      className="text-xs text-red-500 hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  </label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {previews.map((preview, index) => (
                      <motion.div
                        key={preview}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg border border-gray-100 dark:border-gray-700"
                      >
                        <Image src={preview} alt="preview" fill className="object-cover" />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg active:scale-90"
                        >
                          <FiX className="w-3.2 h-3.2" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: isUploading || !selectedProductId || selectedFiles.length === 0 ? 1 : 1.02 }}
                whileTap={{ scale: isUploading || !selectedProductId || selectedFiles.length === 0 ? 1 : 0.98 }}
                onClick={handleUpload}
                disabled={isUploading || !selectedProductId || selectedFiles.length === 0}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isUploading || !selectedProductId || selectedFiles.length === 0
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-zinc-800 text-white hover:bg-black"
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-6 h-6" />
                    <span>Update Product Images</span>
                  </>
                )}
              </motion.button>
              
              <div className="mt-6 flex items-start gap-4 p-5 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl">
                <FiInfo className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Dynamic Transformation Support</p>
                  <p className="text-xs text-blue-800/70 dark:text-blue-200/60 leading-relaxed">
                    We store Cloudinary <span className="font-bold">Public IDs</span> in the database. 
                    This allows us to dynamically generate optimized images (WebP/AVIF, quality auto, responsive sizes) 
                    across the entire application without re-uploading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
