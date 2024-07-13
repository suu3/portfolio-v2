"use client";
import styles from "./page.module.css";
import { useRef, useEffect, useState } from "react";
import Header from "@/components/header";
import StickyCursor from "@/components/stickyCursor";

export default function Home() {
  const stickyElements = useRef([]);
  const [hoverStates, setHoverStates] = useState([]);

  useEffect(() => {
    stickyElements.current = stickyElements.current.slice(0, 2);
    setHoverStates(new Array(stickyElements.current.length).fill(false));
  }, []);

  return (
    <main className={styles.main}>
      <Header refs={stickyElements} />
      <StickyCursor
        stickyElements={stickyElements}
        hoverStates={hoverStates}
        setHoverStates={setHoverStates}
      />
    </main>
  );
}
