import { useRef } from "react";
import Link from "next/link";
import { css } from "@/styled-system/css";

export default function link({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className={css({
        borderTop: "1px solid white",
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        perspective: "80vw",
        transformOrigin: "top",
        "&:last-of-type": {
          borderBottom: "1px solid white",
        },
        transition: "bg 0.5s",
        _hover: {
          bg: "colorAccentLime",

          "& a": {
            color: "black",
          },
        },
      })}
    >
      <div
        className={css({
          fontSize: "56px",
          padding: "0",
          color: "white",
          fontWeight: 600,
          fontFamily: "Prompt",
          transition: "color 0.5s",
        })}
      >
        {title.toUpperCase()}
      </div>
    </Link>
  );
}
