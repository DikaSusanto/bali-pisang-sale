import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import EmailLogClientPage from "./EmailLogClientPage";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin Email Logs | Bali Pisang Sale',
  description: 'View and manage all email logs in the admin panel.',
};

export default async function EmailLogDashboard({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const params = searchParams ? await searchParams : {};
  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || "10", 10);

  // Initial fetch for SSR hydration
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { order: true },
  });

  const totalLogsCount = await prisma.emailLog.count();

  return (
    <EmailLogClientPage
      initialLogs={logs}
      totalLogsCount={totalLogsCount}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}