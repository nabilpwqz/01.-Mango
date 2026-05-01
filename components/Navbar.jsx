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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    setMobileOpen(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#e5e7eb]">
      <div className="container-pro h-16 flex items-center gap-3 md:gap-6">
        <Link href="/" className="text-[28px] font-bold tracking-tight text-[#0f172a]">
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
        <div className="hidden lg:flex ml-auto mr-2">
          <button
            className="h-10 w-[280px] rounded-xl border border-[#e5e7eb] bg-white px-3 text-left text-sm text-[#6b7280] hover:border-[#cbd5e1] transition"
            onClick={() => router.push("/books")}
          >
            Search books...
          </button>
        </div>
        <button
          className="md:hidden ml-auto h-9 px-3 rounded-lg border border-[#e5e7eb] text-sm"
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
        >
          Menu
        </button>
        {isPending ? (
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse hidden md:block" />
        ) : session?.user ? (
          <div className="hidden md:block relative">
            <button className="cursor-pointer" onClick={() => setUserMenuOpen((prev) => !prev)} type="button">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-[#e5e7eb] bg-[#f3f4f6] relative">
                {session.user.image ? (
                  <Image src={session.user.image} alt={session.user.name || "User"} fill className="object-cover" />
                ) : null}
              </div>
            </button>
            {userMenuOpen && (
              <ul className="absolute right-0 mt-3 w-52 p-2 bg-white rounded-xl border border-[#e5e7eb] shadow-lg space-y-1">
                <li className="px-3 py-2 text-sm font-semibold">{session.user.name || "User"}</li>
                <li>
                  <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]" href="/profile" onClick={() => setUserMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]" href="/books" onClick={() => setUserMenuOpen(false)}>
                    Borrowed Books
                  </Link>
                </li>
                <li>
                  <button className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-[#fef2f2]" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn-pro btn-pro-primary hidden md:inline-flex">
            Login
          </Link>
        )}
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
              <Link href="/login" className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f9fafb]" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
            {!isPending && session?.user && (
              <button className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-[#fef2f2]" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
