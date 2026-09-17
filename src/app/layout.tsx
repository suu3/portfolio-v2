import "./globals.css";
import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import Grain from "@/components/Grain";
import SoundToggle from "@/components/SoundToggle";

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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SoundToggle />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
