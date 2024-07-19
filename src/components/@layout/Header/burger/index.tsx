"use client";

import { css, cx } from "@/styled-system/css";

export default function Burger({ openMenu }: { openMenu: () => void }) {
  return (
    <div
      data-cursor="pointer"
      onClick={() => {
        openMenu();
      }}
      className={css({
        width: "150px",
        height: "120px",
        bg: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "fixed",
        right: 0,
        top: 0,
        padding: "10px",
        cursor: "pointer",
        border: "1px solid black",

        "& svg": {
          position: "absolute",
          right: "20px",
          top: "20px",

          "& line": {
            transition: "stroke 0.5s",
          },
        },

        _hover: {
          "& p": {
            color: "black",
          },
          "& svg": {
            "& line": {
              stroke: "black",
            },
          },
          "& .background": {
            height: "100%",
          },
        },
      })}
    >
      <div
        className={cx(
          css({
            bg: "colorAccentLime",
            width: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: -1,
            height: 0,
            transition: "height 0.3s",
          }),
          "background"
        )}
      ></div>
      <svg
        width="56"
        height="7"
        viewBox="0 0 56 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="56" y1="0.5" x2="4.37114e-08" y2="0.500005" stroke="white" />
        <line x1="56" y1="6.5" x2="28" y2="6.5" stroke="white" />
      </svg>
      <p
        className={css({
          color: "white",
          margin: "0px",
          textTransform: "uppercase",
          transition: "color 0.5s",
        })}
      >
        Menu
      </p>
    </div>
  );
}
