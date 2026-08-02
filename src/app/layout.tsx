import "./globals.css";
import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import Grain from "@/components/Grain";
import CropMarks from "@/components/CropMarks";
import SoundToggle from "@/components/SoundToggle";
import { css } from "@/styled-system/css";

export const metadata: Metadata = {
  title: "Portfolio · Frontend Developer",
  description: "확장 가능한 구조 설계와 인터랙티브 웹을 만드는 프론트엔드 개발자 포트폴리오.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={css({
          bg: "#f3efec",
          color: "#23242a",
        })}
      >
        {children}
        <SoundToggle />
        <CropMarks />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
