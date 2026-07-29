import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageLayout } from "@/components/layout/PageLayout";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <PageLayout
      user={{
        name: session.user.name ?? session.user.email ?? "User",
        email: session.user.email ?? "",
        image: session.user.image,
        role: session.user.role,
      }}
    >
      {children}
    </PageLayout>
  );
}
