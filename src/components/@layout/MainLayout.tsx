import { ReactNode } from "react";
import Header from "./Header";
import EntryFlow from "./EntryFlow";
import CharacterStage from "@/components/@three/CharacterStage/loader";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <EntryFlow />
      <Header />
      {children}
      <CharacterStage />
    </>
  );
};

export default MainLayout;
