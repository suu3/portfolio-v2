import SplashScreen from "@/components/SplashScreen";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SplashScreen />
      {children}
    </>
  );
}
