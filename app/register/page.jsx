import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[84vh] grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-[#0f172a] text-white p-12 items-end">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f59e0b]">Membership</p>
          <h2 className="text-4xl font-semibold mt-3">Create your reading identity.</h2>
          <p className="mt-4 text-slate-300">Save favorites, borrow faster, and keep a personalized reading timeline.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
