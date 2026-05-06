import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  const emailVerified = user.emailVerified === true;
  const userIdShort = user.id ? `${String(user.id).slice(0, 8)}…` : "—";

  return (
    <div className="container-pro py-10">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="surface p-4 h-fit">
          <nav className="space-y-1 text-sm">
            <Link href="/profile" className="block px-3 py-2 rounded-lg border-l-4 border-[#059669] bg-[#f8fafc] font-medium">
              Profile
            </Link>
            <Link href="/books" className="block px-3 py-2 rounded-lg muted hover:bg-[#f8fafc] transition">
              Borrowed Books
            </Link>
            <Link href="/profile/update" className="block px-3 py-2 rounded-lg muted hover:bg-[#f8fafc] transition">
              Settings
            </Link>
          </nav>
        </aside>
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#e5e7eb] shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "User"} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-[#64748b]">
                    {((user.name || user.email || "?")[0] || "?").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold">{user.name || "No name set"}</h1>
                <p className="muted mt-1">{user.email}</p>
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="muted">User ID</dt>
                    <dd className="font-mono text-[#0f172a]">{userIdShort}</dd>
                  </div>
                  <div>
                    <dt className="muted">Email verified</dt>
                    <dd className="text-[#0f172a]">{emailVerified ? "Yes" : "No"}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/profile/update" className="btn-pro btn-pro-primary">
                Update Information
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/books" className="surface p-4 block hover:-translate-y-1 transition">
              <p className="text-sm muted">Books Borrowed</p>
              <p className="text-2xl font-semibold mt-1">24</p>
            </Link>
            <Link href="/books" className="surface p-4 block hover:-translate-y-1 transition">
              <p className="text-sm muted">Reading Streak</p>
              <p className="text-2xl font-semibold mt-1">18 days</p>
            </Link>
            <Link href="/profile/update" className="surface p-4 block hover:-translate-y-1 transition">
              <p className="text-sm muted">Current Status</p>
              <p className="text-2xl font-semibold mt-1">Active</p>
            </Link>
          </div>
          <div className="surface p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
            <ul className="space-y-4 text-sm">
              <li className="border-l-2 border-[#e5e7eb] pl-4">
                <p className="font-medium">Borrowed &quot;Cloud Native Patterns&quot;</p>
                <p className="muted">2 days ago</p>
              </li>
              <li className="border-l-2 border-[#e5e7eb] pl-4">
                <p className="font-medium">Updated profile picture</p>
                <p className="muted">6 days ago</p>
              </li>
              <li className="border-l-2 border-[#e5e7eb] pl-4">
                <p className="font-medium">Registered on Mango</p>
                <p className="muted">2 weeks ago</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
