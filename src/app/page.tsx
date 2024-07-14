"use client";
import styles from "./page.module.css";
import { useRef, useEffect, useState } from "react";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <Cursor />
    </>
  );
}

// <main className={styles.main}>
//   {/* <Header refs={stickyElements} /> */}
//   <StickyCursor
//     stickyElements={stickyElements}
//     hoverStates={hoverStates}
//     setHoverStates={setHoverStates}
//   />
// </main>
