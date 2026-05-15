import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        <AdminHeader />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
