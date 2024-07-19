import Header from "@/components/@layout/Header";
import MainLayout from "@/components/@layout/MainLayout";
import { ReactNode } from "react";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
