import { ReactNode } from "react";
import Header from "./Header";
import SplashScreen from "../SplashScreen";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* <SplashScreen /> */}
      <Header />
      {children}
    </>
  );
};

export default MainLayout;
