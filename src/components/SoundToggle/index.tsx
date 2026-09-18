"use client";

import { useEffect, useState } from "react";
import { disableSfx, enableSfx, sfx } from "@/lib/sfx";
import styles from "./sound.module.css";
import { useTranslations } from "next-intl";

/**
 * Opt-in UI sound. Off by default — unexpected audio is worse than no audio,
 * especially for someone skimming a portfolio in an open-plan office.
 *
 * Interaction sounds are delegated off [data-cursor], which already marks
 * exactly the elements that are actually clickable.
 */
const SoundToggle = () => {
  const t = useTranslations();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return;

    const interactive = (t: EventTarget | null) =>
      (t as HTMLElement | null)?.closest?.<HTMLElement>("[data-cursor]") ?? null;

    let last: HTMLElement | null = null;

    const onOver = (e: PointerEvent) => {
      const el = interactive(e.target);
      if (el && el !== last) sfx.hover();
      last = el;
    };

    const onClick = (e: MouseEvent) => {
      const el = interactive(e.target);
      if (!el) return;
      const label = el.dataset.cursorLabel ?? "";
      if (label === "Menu") sfx.open();
      else if (label === "Close") sfx.close();
      else sfx.click();
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [on]);

  const toggle = async () => {
    if (on) {
      disableSfx();
      setOn(false);
      return;
    }
    const ok = await enableSfx();
    if (!ok) return;
    setOn(true);
    sfx.open(); // confirm it actually works
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="pointer"
      data-cursor-label={on ? "Mute" : "Sound"}
      aria-pressed={on}
      aria-label={t("a11y.soundToggle")}
      className={`${styles.btn} ${on ? styles.on : ""}`}
    >
      <span className={styles.bars} aria-hidden>
        <i />
        <i />
        <i />
      </span>
      {on ? "sound on" : "sound off"}
    </button>
  );
};

export default SoundToggle;
