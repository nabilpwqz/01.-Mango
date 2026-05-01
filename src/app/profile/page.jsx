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

  return (
    <div className="container-pro py-10">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="surface p-4 h-fit">
          <nav className="space-y-1 text-sm">
            <Link href="/profile" className="block px-3 py-2 rounded-lg border-l-4 border-[#059669] bg-[#f8fafc] font-medium">Profile</Link>
            <Link href="/books" className="block px-3 py-2 rounded-lg muted hover:bg-[#f8fafc] transition">Borrowed Books</Link>
            <Link href="/profile/update" className="block px-3 py-2 rounded-lg muted hover:bg-[#f8fafc] transition">Settings</Link>
          </nav>
        </aside>
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-[#e5e7eb]">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                ) : null}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{user.name || "No Name"}</h1>
                <p className="muted">{user.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/profile/update" className="btn-pro btn-pro-primary">
                Update Information
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/books" className="surface p-4 block hover:-translate-y-1 transition"><p className="text-sm muted">Books Borrowed</p><p className="text-2xl font-semibold mt-1">24</p></Link>
            <Link href="/books" className="surface p-4 block hover:-translate-y-1 transition"><p className="text-sm muted">Reading Streak</p><p className="text-2xl font-semibold mt-1">18 days</p></Link>
            <Link href="/profile/update" className="surface p-4 block hover:-translate-y-1 transition"><p className="text-sm muted">Current Status</p><p className="text-2xl font-semibold mt-1">Active</p></Link>
          </div>
          <div className="surface p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
            <ul className="space-y-4 text-sm">
              <li className="border-l-2 border-[#e5e7eb] pl-4"><p className="font-medium">Borrowed "Cloud Native Patterns"</p><p className="muted">2 days ago</p></li>
              <li className="border-l-2 border-[#e5e7eb] pl-4"><p className="font-medium">Updated profile picture</p><p className="muted">6 days ago</p></li>
              <li className="border-l-2 border-[#e5e7eb] pl-4"><p className="font-medium">Registered on Mango</p><p className="muted">2 weeks ago</p></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
