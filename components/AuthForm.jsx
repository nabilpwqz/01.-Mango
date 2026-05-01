"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const isLogin = mode === "login";
  const [formData, setFormData] = useState({ name: "", email: "", image: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (error) {
      toast.error(error.message || "Google sign-in failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!formData.email.includes("@")) nextErrors.email = "Please provide a valid email";
    if ((formData.password || "").length < 6) nextErrors.password = "Password must be at least 6 characters";
    if (!isLogin && !(formData.image || "").startsWith("http")) nextErrors.image = "Photo URL must start with http";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email: formData.email,
          password: formData.password
        });
        if (result.error) throw new Error(result.error.message);
        toast.success("Login successful");
        router.push("/");
      } else {
        const result = await authClient.signUp.email({
          name: formData.name,
          email: formData.email,
          image: formData.image,
          password: formData.password
        });
        if (result.error) throw new Error(result.error.message);
        toast.success("Registration successful");
        router.push("/login");
      }
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface w-full max-w-md p-7 md:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">{isLogin ? "Welcome back" : "Create account"}</h1>
      <p className="text-sm muted mb-5">{isLogin ? "Sign in to borrow and track books" : "Join Mango Library in under a minute"}</p>
      <div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                required
                className="input-pro"
                placeholder="Name"
                onChange={handleChange}
              />
              <input
                type="url"
                name="image"
                required
                className="input-pro"
                placeholder="Photo URL"
                onChange={handleChange}
              />
              {errors.image && <p className="text-xs text-red-600">{errors.image}</p>}
            </>
          )}
          <input
            type="email"
            name="email"
            required
            className="input-pro"
            placeholder="Email"
            onChange={handleChange}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          <input
            type="password"
            name="password"
            required
            className="input-pro"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          <button className="btn-pro btn-pro-primary w-full" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button className="btn-pro btn-pro-ghost w-full mt-3" onClick={handleGoogle}>
          Continue with Google
        </button>
        <p className="text-sm mt-4 muted">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/register" : "/login"} className="text-[#059669] font-medium">
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
