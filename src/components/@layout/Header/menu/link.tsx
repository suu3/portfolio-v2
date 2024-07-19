import { useRef } from "react";
import Link from "next/link";
import { css } from "@/styled-system/css";

export default function link({ title, href }: { title: string; href: string }) {
  return (
    <div
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
      })}
    >
      <Link
        href={href}
        className={css({
          fontSize: "56px",
          padding: "0",
          color: "white",
          fontWeight: 600,
          fontFamily: "Prompt",
        })}
      >
        {title.toUpperCase()}
      </Link>
    </div>
  );
}
