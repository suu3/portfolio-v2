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
        },
      },
    },
  },
  importMap: "@/styled-system",
  // The output directory for your css system
  outdir: "./src/styled-system",
});
