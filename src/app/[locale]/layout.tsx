import "../globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Cursor from "@/components/Cursor";
import Grain from "@/components/Grain";
import { htmlLang, locales, type Locale } from "@/i18n/routing";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

/** build all three at compile time rather than on first request */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  // Passed whole rather than picked over: the messages are a few kB of UI
  // chrome, and every client component in here reaches for some of it.
  const messages = await getMessages();

  return (
    <html lang={htmlLang[locale as Locale]}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={jetBrainsMono.variable}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Grain />
          <Cursor />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
