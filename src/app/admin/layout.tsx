import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Langbord \u2014 Admin",
  description: "Moderatorpanel for Langbord",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
