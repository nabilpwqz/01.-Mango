import { redirect } from "next/navigation";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { getServerSession } from "@/lib/session";

export default async function UpdateProfilePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container-pro py-10">
      <div className="max-w-xl surface p-6 md:p-8">
        <h1 className="text-3xl font-semibold mb-4">Update Profile</h1>
        <UpdateProfileForm defaultName={session.user.name || ""} defaultImage={session.user.image || ""} />
      </div>
    </div>
  );
}
