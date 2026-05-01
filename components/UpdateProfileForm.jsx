"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfileForm({ defaultName = "", defaultImage = "" }) {
  const [name, setName] = useState(defaultName);
  const [image, setImage] = useState(defaultImage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.updateUser({
        name,
        image
      });
      if (result.error) throw new Error(result.error.message);
      toast.success("Profile updated");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        className="input-pro"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="input-pro"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />
      <button className="btn-pro btn-pro-primary w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Information"}
      </button>
    </form>
  );
}
