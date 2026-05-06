"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "My Profile", href: "/profile" }
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayName = session?.user?.name || session?.user?.email || "Account";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#e5e7eb]">
      <div className="container-pro h-16 flex items-center gap-3 md:gap-6">
        <Link href="/" className="text-[28px] font-bold tracking-tight text-[#0f172a] shrink-0">
          Mango
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium pb-1 border-b-2 transition ${
                pathname === link.href
                  ? "text-[#0f172a] border-[#059669]"
                  : "text-[#6b7280] border-transparent hover:text-[#0f172a]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden lg:block">
            <button
              type="button"
              className="h-10 w-[280px] rounded-xl border border-[#e5e7eb] bg-white px-3 text-left text-sm text-[#6b7280] hover:border-[#cbd5e1] transition"
              onClick={() => router.push("/books")}
            >
              Search books...
            </button>
          </div>
          <button
            type="button"
            className="md:hidden h-9 px-3 rounded-lg border border-[#e5e7eb] text-sm"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            Menu
          </button>
          {isPending ? (
            <div className="h-9 min-w-[140px] rounded-lg bg-gray-200 animate-pulse hidden md:block" />
          ) : session?.user ? (
            <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-xl px-2 py-1 max-w-[240px] hover:bg-[#f8fafc] transition"
              title={displayName}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border border-[#e5e7eb] bg-[#f3f4f6] relative shrink-0">
                {session.user.image ? (
                  <Image src={session.user.image} alt={displayName} fill className="object-cover" sizes="36px" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#64748b]">
                    {(displayName[0] || "?").toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-[#0f172a] truncate">{displayName}</span>
            </Link>
            <button type="button" className="btn-pro border border-[#e5e7eb] bg-white text-[#0f172a] hover:bg-[#f8fafc] text-sm" onClick={handleLogout}>
              Logout
            </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link href="/login" className="btn-pro btn-pro-primary">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium text-[#059669] hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e5e7eb] bg-white">
          <div className="container-pro py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isPending && !session?.user && (
              <>
                <Link href="/login" className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
            {!isPending && session?.user && (
              <>
                <p className="px-3 py-2 text-sm font-semibold text-[#0f172a] truncate">{displayName}</p>
                <Link href="/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                <button type="button" className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-[#fef2f2]" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
