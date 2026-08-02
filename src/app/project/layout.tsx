import Header from "@/components/@layout/Header";
import { ReactNode } from "react";

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProjectLayout;
