"use client";

import { useEffect, useState } from "react";
import { css } from "@/styled-system/css";
import EntryGate from "@/components/EntryGate";
import SplashScreen from "@/components/SplashScreen";
import { ENTRY_GATE } from "@/config/features";

/**
 * Sequences what covers the site on arrival: the playable gate first (once per
 * tab session), then the splash. The splash on its own stays the transition
 * screen for every later visit, exactly as before.
 */
const KEY = "entry-gate:cleared";

type Phase = "pending" | "gate" | "splash";

/** first paint only — avoids a flash of the page while we read sessionStorage */
const coverCls = css({
  zIndex: 10003,
  position: "fixed",
  inset: 0,
  background: "#000",
});

const EntryFlow = () => {
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    let cleared = false;
    try {
      cleared = sessionStorage.getItem(KEY) === "1";
    } catch {
      // private mode / storage disabled — just play it
    }
    setPhase(ENTRY_GATE && !cleared ? "gate" : "splash");
  }, []);

  if (phase === "pending") return <div className={coverCls} />;

  if (phase === "gate") {
    return (
      <EntryGate
        onDone={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* not worth failing over */
          }
          setPhase("splash");
        }}
      />
    );
  }

  return <SplashScreen />;
};

export default EntryFlow;
