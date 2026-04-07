import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  children: React.ReactNode;
}

export default function AdminAuthedLayout({ children }: Props) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
  return <AdminShell>{children}</AdminShell>;
}
