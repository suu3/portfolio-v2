"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import useScrollLock from "@/hooks/useScrollLock";
import {
  createGame,
  draw,
  update,
  VH,
  VW,
  type Assets,
  type Game,
  type Input,
} from "./game";
import {
  canvasCls,
  gateCls,
  hintCls,
  padBtnCls,
  padCls,
  padGroupCls,
  padJumpCls,
  skipCls,
} from "./styles";

/**
 * A small side-scroller the visitor walks through before the site appears.
 *
 * Two rules keep it from being a wall: the skip button is plain DOM (it works
 * even if the rAF loop is frozen or the game never renders), and falling into a
 * pit just puts you back on the ledge — there is no lose state.
 */
export default function EntryGate({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<Input>({ left: false, right: false, jump: false });
  const doneRef = useRef(false);
  const [gone, setGone] = useState(false);
  const unlockScroll = useScrollLock();

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    unlockScroll();
    setGone(true);
    onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDone]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const game: Game = createGame();
    const input = inputRef.current;
    let raf = 0;
    let last = performance.now();

    // Sprites stream in; the level draws its fallback shapes until they land, so
    // nobody ever waits on an image before they can move.
    const assets: Assets = { walk: null, stars: null, crate: null, bg: null };
    const loadInto = (key: keyof Assets, src: string) => {
      const img = new Image();
      img.onload = () => {
        assets[key] = img;
      };
      img.src = src;
    };
    // webp everywhere except the walk sheet: it is 17 flat colours, which png
    // packs into 7KB while webp needs 18KB
    loadInto("walk", "/images/entry-walk-sheet.png");
    loadInto("stars", "/images/entry-star-sheet.webp");
    loadInto("crate", "/images/intro-block.webp");
    loadInto("bg", "/images/intro-bg.webp");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();

    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      update(game, dt, input);
      input.jump = false; // edge-triggered

      for (const e of game.events) {
        if (e === "jump") sfx.step(2);
        else if (e === "gem") sfx.step(game.got + 3);
        else if (e === "fall") sfx.close();
        else if (e === "clear") sfx.open();
      }

      // letterbox the fixed virtual viewport inside whatever the window is
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(canvas.width / (VW * dpr), canvas.height / (VH * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(
        scale * dpr,
        0,
        0,
        scale * dpr,
        (canvas.width - VW * scale * dpr) / 2,
        (canvas.height - VH * scale * dpr) / 2,
      );
      draw(ctx, game, assets);

      if (game.status === "done") {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          input.left = down;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          input.right = down;
          break;
        case " ":
        case "ArrowUp":
        case "w":
        case "W":
          if (down) input.jump = true;
          break;
        case "Escape":
          if (down) finish();
          return;
        default:
          return;
      }
      e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => onKey(e, true);
    const onUp = (e: KeyboardEvent) => onKey(e, false);

    // rAF is frozen while the tab is hidden; without this the first frame back
    // would carry the whole absence as one delta.
    const onVisible = () => {
      if (!document.hidden) last = performance.now();
    };
    // a held key can get stuck down if focus leaves mid-press
    const onBlur = () => {
      input.left = false;
      input.right = false;
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("resize", resize);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [finish]);

  if (gone) return null;

  const hold = (key: "left" | "right", down: boolean) => () => {
    inputRef.current[key] = down;
  };

  return (
    <div className={gateCls}>
      <canvas ref={canvasRef} className={canvasCls} />

      <button
        type="button"
        onClick={finish}
        className={skipCls}
        data-cursor="pointer"
        data-cursor-label="Skip"
      >
        skip ⏭
      </button>

      <p className={hintCls}>← → 이동 · space 점프 · esc 건너뛰기</p>

      <div className={padCls} aria-hidden>
        <div className={padGroupCls}>
          <button
            type="button"
            tabIndex={-1}
            className={padBtnCls}
            onPointerDown={hold("left", true)}
            onPointerUp={hold("left", false)}
            onPointerLeave={hold("left", false)}
            onPointerCancel={hold("left", false)}
          >
            ←
          </button>
          <button
            type="button"
            tabIndex={-1}
            className={padBtnCls}
            onPointerDown={hold("right", true)}
            onPointerUp={hold("right", false)}
            onPointerLeave={hold("right", false)}
            onPointerCancel={hold("right", false)}
          >
            →
          </button>
        </div>
        <button
          type="button"
          tabIndex={-1}
          className={padJumpCls}
          onPointerDown={() => {
            inputRef.current.jump = true;
          }}
        >
          jump
        </button>
      </div>
    </div>
  );
}
