import { ReactNode } from "react";
import Header from "./Header";
import EntryFlow from "./EntryFlow";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <EntryFlow />
      <Header />
      {children}
    </>
  );
};

export default MainLayout;
