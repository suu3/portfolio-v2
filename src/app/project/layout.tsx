"use client";

import Header from "@/components/@layout/Header";
import React, { ReactNode } from "react";

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProjectLayout;
