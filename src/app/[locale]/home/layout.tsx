import MainLayout from "@/components/@layout/MainLayout";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
