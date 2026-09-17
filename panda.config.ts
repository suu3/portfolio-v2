import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],
  clean: true,

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          colorTheme01: { value: "#ff6737" },
          colorTheme02: { value: "#fc8755" },
          colorTheme03: { value: "#ffddca" },
          colorTheme04: { value: "#f3efec" },
          colorBgSurface: { value: "#2a2b31" },
          colorNeutral01: { value: "#60616a" },
          colorNeutral02: { value: "#9597a1" },
          colorNeutral03: { value: "#ebebeb" },
          colorNeutral04: { value: "#fbfbfb" },
          colorBackground: { value: "#ffffff" },
          colorAccentLime: { value: "#bffe28" },
          colorAccentPink: { value: "#ff00ff" },
          colorAccentPurple: { value: "#8806ce" },

          /* monotone + two point colours (see pagesLayer/home/ui.ts) */
          paper: { value: "#ededeb" },
          surface: { value: "#f7f7f5" },
          ink: { value: "#111111" },
          muted: { value: "#6e6e6a" },
          hair: { value: "rgba(17,17,17,0.14)" },
          dark: { value: "#0d0d0d" },
          darkSurface: { value: "#151515" },
          darkLine: { value: "#2c2c2c" },
          darkMuted: { value: "#8c8c88" },
          point: { value: "#ff5a1f" },
          signal: { value: "#2d3cff" },
        },
        fonts: {
          sans: {
            value:
              "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
          },
          mono: { value: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
        },
      },
    },
  },
  importMap: "@/styled-system",
  // The output directory for your css system
  outdir: "./src/styled-system",
});
