import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-[84vh] grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-[#0f172a] text-white p-12 items-end">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f59e0b]">Mango Library</p>
          <h2 className="text-4xl font-semibold mt-3">Read smarter. Borrow instantly.</h2>
          <p className="mt-4 text-slate-300">Your digital reading room with curated collections and secure account management.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
