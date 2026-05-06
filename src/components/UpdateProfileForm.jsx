"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-error-message";

export default function UpdateProfileForm({ defaultName = "", defaultImage = "" }) {
  const [name, setName] = useState((defaultName || "").trim());
  const [image, setImage] = useState((defaultImage || "").trim());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const img = image.trim();
    if (!n) {
      toast.error("Name is required");
      return;
    }
    if (img && !img.startsWith("http")) {
      toast.error("Image URL must start with http or https");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.updateUser({
        name: n,
        image: img || null
      });
      if (result.error) throw new Error(authErrorMessage(result.error) || "Update failed");
      try {
        authClient.$store.notify("$sessionSignal");
      } catch {
        /* noop */
      }
      toast.success("Profile updated");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : authErrorMessage(error) || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Name</label>
        <input className="input-pro w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Profile photo URL</label>
        <input className="input-pro w-full" placeholder="https://... (optional — leave blank to clear)" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <button type="submit" className="btn-pro btn-pro-primary w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Information"}
      </button>
    </form>
  );
}
