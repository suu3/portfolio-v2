"use client";

import { css } from "@/styled-system/css";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Beyond from "./sections/Beyond";
import Footer from "./sections/Footer";
import { CREAM } from "./ui";

const Home = () => {
  return (
    <main
      className={css({
        background: CREAM,
        overflowX: "hidden",
        position: "relative",
      })}
    >
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Beyond />
      <Footer />
    </main>
  );
};

export default Home;
