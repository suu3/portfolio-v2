// import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
import "./globals.css";
import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import { css, cx } from "@/styled-system/css";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Portfolio site",
  description: "Portfolio site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cx(
          // inter.className,
          css({
            bg: "colorNeutral03",
          })
        )}
      >
        {children}
        <Cursor />
      </body>
    </html>
  );
}
