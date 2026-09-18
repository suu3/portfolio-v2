import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  // The "/" -> "/home" redirect used to live here. The locale middleware runs
  // ahead of these rules and already sends an unprefixed path to the right
  // language ("/" -> "/ko", "/home" -> "/ko/home"), so a rule here would only
  // fight it. What is left is "/ko" -> "/ko/home", which app/[locale]/page.tsx
  // does in a locale-aware way.
};

export default withNextIntl(nextConfig);
