"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../../AuthContext";
import SvgIcon from "@/components/ui/SvgIcon";
import Image from "next/image";

type GalleryImage = {
  id: string;
  title: string;
  chapter: string;
  year: number;
  category: string;
  description: string | null;
  image_url: string;
  public_id: string | null;
  width: number | null;
  height: number | null;
  is_wide: boolean;
  is_active: boolean;
  created_at: string;
};

const categories = [
  "Gatherings",
  "Worship",
  "Community",
  "Behind the Scenes",
  "Archive",
];

const chaptersList = [
  "Nairobi",
  "Mombasa",
  "Nakuru",
  "Eldoret",
  "Kisumu",
  "Machakos",
];

async function uploadMediaViaPipeline(file: File, onStatus: (status: string) => void): Promise<{ url: string; publicId: string; width: number; height: number; bytes: number; mimeType: string }> {
  onStatus("Processing at Cloudinary Edge...");
  
  const uploadPreset = 'ml_image';
  
  const sigRes = await fetch("/api/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "aflewo_gallery", uploadPreset }),
  });
  if (!sigRes.ok) throw new Error("Could not get Cloudinary credentials");
  const { signature, timestamp, cloudName, apiKey, folder, uploadPreset: signedPreset } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", apiKey);
  formData.append("folder", folder);
  if (signedPreset) formData.append("upload_preset", signedPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();

  onStatus("Mirroring optimized file to R2 Vault...");
  const mirrorRes = await fetch("/api/mirror-to-r2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cloudinaryUrl: data.secure_url,
      cloudinaryPublicId: data.public_id,
      resourceType: data.resource_type,
      fileName: file.name,
      contentType: file.type
    }),
  });
  if (!mirrorRes.ok) throw new Error("Failed to mirror to R2 Vault");
  const mirrorData = await mirrorRes.json();

  return {
    url: mirrorData.r2Url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    mimeType: data.format ? `${data.resource_type}/${data.format}` : file.type,
  };
}

export default function AdminGalleryPage() {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    chapter: "Nairobi",
    year: new Date().getFullYear(),
    category: "Worship",
    description: "",
    is_wide: false,
    file: null as File | null,
  });

  const isAdmin = profile && ["chapter_admin", "super_admin"].includes(profile.role);

  useEffect(() => {
    if (profile && isAdmin) loadImages();
  }, [profile]);

  const loadImages = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setImages((data || []) as GalleryImage[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.title || !profile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploaded = await uploadMediaViaPipeline(form.file, setUploadStatus);

      setUploadStatus("Saving to database...");
      const { error: insertError } = await supabase.from("gallery_images").insert({
        title: form.title,
        chapter: form.chapter,
        year: form.year,
        category: form.category,
        description: form.description || null,
        image_url: uploaded.url,
        public_id: uploaded.publicId,
        width: uploaded.width,
        height: uploaded.height,
        is_wide: form.is_wide,
        uploaded_by: profile.id,
        is_active: true,
      });

      if (insertError) throw insertError;

      setSuccess(`"${form.title}" uploaded successfully.`);
      setForm({
        title: "",
        chapter: "Nairobi",
        year: new Date().getFullYear(),
        category: "Worship",
        description: "",
        is_wide: false,
        file: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadImages();
    } catch (err) {
      console.error("[admin/gallery] Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadStatus(null);
    }
  };

  const toggleActive = async (img: GalleryImage) => {
    await supabase
      .from("gallery_images")
      .update({ is_active: !img.is_active })
      .eq("id", img.id);
    setImages(prev =>
      prev.map(r => r.id === img.id ? { ...r, is_active: !r.is_active } : r)
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image from the database?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    setImages(prev => prev.filter(r => r.id !== id));
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-24">
        <SvgIcon name="warning" size={48} className="text-white/10 mx-auto opacity-30" />
        <p className="text-white/30 font-bold mt-4">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">Gallery <span className="text-gold">Manager</span></h1>
        <p className="text-white/40 text-sm mt-1">Upload and manage high-fidelity media for the public gallery.</p>
      </div>

      {/* Upload Form */}
      <div className="glass-card-elevated rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-black tracking-tighter">Upload New Image</h2>

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-sm font-bold">
            <SvgIcon name="check_circle" size={18} className="opacity-80" /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            <SvgIcon name="error_circle" size={18} className="opacity-80" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. Worship Team live at Kasarani"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Chapter *</label>
              <select
                value={form.chapter}
                onChange={(e) => setForm(p => ({ ...p, chapter: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                {chaptersList.map((chap) => (
                  <option key={chap} value={chap}>{chap}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Year *</label>
              <input
                type="number"
                required
                min={2004}
                max={new Date().getFullYear()}
                value={form.year}
                onChange={(e) => setForm(p => ({ ...p, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gold">Description (optional)</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors resize-none"
              placeholder="Context about this photo..."
            />
          </div>

          {/* File picker */}
          <div
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-gold/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.file ? (
              <div className="flex items-center justify-center gap-3 text-gold">
                <SvgIcon name="image_off" size={24} className="opacity-80" />
                <div className="text-left">
                  <p className="text-sm font-bold">{form.file.name}</p>
                  <p className="text-xs text-white/30">{(form.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <SvgIcon name="upload_cloud" size={32} className="text-white/20 mx-auto opacity-70" />
                <p className="text-white/40 text-sm">Click to select an image</p>
                <p className="text-white/20 text-xs">JPG, PNG, WebP supported</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setForm(p => ({ ...p, file: f }));
              }}
            />
          </div>

          <div className="flex items-center gap-3">
             <input type="checkbox" id="is_wide" checked={form.is_wide} onChange={e => setForm(p => ({ ...p, is_wide: e.target.checked}))} className="accent-gold w-4 h-4"/>
             <label htmlFor="is_wide" className="text-xs text-white/50 font-bold">This is a wide landscape image (takes up 2 columns)</label>
          </div>

          <button
            type="submit"
            disabled={uploading || !form.file || !form.title}
            className="w-full py-4 bg-gold text-brown rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {uploading ? (
              <><SvgIcon name="spinner" size={18} className="animate-spin opacity-80" /> {uploadStatus || "Uploading..."}</>
            ) : (
              <><SvgIcon name="upload_cloud" size={18} className="opacity-80" /> Upload Image</>
            )}
          </button>
        </form>
      </div>

      {/* Existing Images */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-white/40">
          Gallery Images ({images.length})
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
          </div>
        ) : images.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-12">No images uploaded to DB yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className={`glass-card rounded-xl overflow-hidden flex flex-col ${!img.is_active ? "opacity-40" : ""}`}>
                <div className="relative w-full h-32 bg-black/40">
                  <Image src={img.image_url} alt={img.title} fill className="object-cover" unoptimized />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-black truncate" title={img.title}>{img.title}</p>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">{img.chapter} · {img.year}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => toggleActive(img)}
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border transition-all ${
                        img.is_active
                          ? "text-emerald border-emerald/30 hover:bg-emerald/10"
                          : "text-white/30 border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {img.is_active ? "Active" : "Hidden"}
                    </button>
                    <button
                       onClick={() => handleDelete(img.id)}
                       className="text-red-400 hover:text-red-300 transition-colors p-1"
                       title="Delete"
                    >
                       <SvgIcon name="cross-svgrepo-com" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
