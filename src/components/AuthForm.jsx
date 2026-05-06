"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-error-message";

/** Normalize fields: trim, lowercase email. */
function normalizeAuthPayload(isLogin, raw) {
  const email = (raw.email || "").trim().toLowerCase();
  const password = (raw.password || "").trim();
  if (isLogin) {
    return { email, password };
  }
  const name = (raw.name || "").trim();
  const image = (raw.image || "").trim();
  return {
    name,
    email,
    password,
    image
  };
}

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
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
      if (result?.error) throw new Error(authErrorMessage(result.error) || "Google sign-in failed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : authErrorMessage(error) || "Google sign-in failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = normalizeAuthPayload(isLogin, formData);
    const nextErrors = {};

    if (!payload.email.includes("@")) nextErrors.email = "Please provide a valid email";
    if (payload.email.length > 255) nextErrors.email = "Email is too long";

    if (isLogin) {
      if (!payload.password) nextErrors.password = "Password is required";
    } else {
      if (!payload.name || payload.name.length < 1) nextErrors.name = "Name is required";
      if (payload.name.length > 120) nextErrors.name = "Name is too long (max 120 characters)";
      if (payload.image && !payload.image.startsWith("http")) nextErrors.image = "Photo URL must start with http or https";
      if (payload.password.length < 8) nextErrors.password = "Password must be at least 8 characters";
      if (payload.password.length > 128) nextErrors.password = "Password is too long (max 128 characters)";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email: payload.email,
          password: payload.password
        });
        if (result.error) throw new Error(authErrorMessage(result.error) || "Invalid email or password");
        try {
          authClient.$store.notify("$sessionSignal");
        } catch {
          /* noop */
        }
        toast.success("Login successful");
        router.push("/");
      } else {
        const result = await authClient.signUp.email({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          ...(payload.image ? { image: payload.image } : {})
        });
        if (result.error) throw new Error(authErrorMessage(result.error) || "Could not create account");
        const signInResult = await authClient.signIn.email({
          email: payload.email,
          password: payload.password
        });
        if (signInResult.error) throw new Error(authErrorMessage(signInResult.error) || "Account created but sign-in failed — try logging in manually");
        try {
          authClient.$store.notify("$sessionSignal");
        } catch {
          /* noop */
        }
        toast.success("Welcome! You're signed in.");
        router.push("/");
      }
      router.refresh();
    } catch (error) {
      const fromErr = error instanceof Error ? error.message : authErrorMessage(error);
      const fallback = isLogin
        ? "Sign-in failed. For local development: start MongoDB (or set MONGODB_URI to Atlas) and match BETTER_AUTH_URL / NEXT_PUBLIC_APP_URL to your dev server port."
        : "Could not create account. Check MongoDB is running, MONGODB_URI in .env.local, and that this email is not already registered.";
      toast.error(fromErr || fallback);
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
              <input type="text" name="name" required className="input-pro" placeholder="Name" onChange={handleChange} />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              <input type="url" name="image" className="input-pro" placeholder="Photo URL (optional)" onChange={handleChange} />
              {errors.image && <p className="text-xs text-red-600">{errors.image}</p>}
            </>
          )}
          <input type="email" name="email" required className="input-pro" placeholder="Email" onChange={handleChange} />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          <input
            type="password"
            name="password"
            required
            className="input-pro"
            placeholder={isLogin ? "Password" : "Password (at least 8 characters)"}
            onChange={handleChange}
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          <button type="submit" className="btn-pro btn-pro-primary w-full" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button type="button" className="btn-pro btn-pro-ghost w-full mt-3" onClick={handleGoogle}>
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
