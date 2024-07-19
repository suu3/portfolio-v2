import { css } from "@/styled-system/css";

const themeBg = {
  lime: "colorAccentLime",
  orange: "colorTheme01",
  purple: "colorAccentPurple",
};

export type ThemeBg = keyof typeof themeBg;
const Card = ({ theme }: { theme: ThemeBg }) => {
  return (
    <article
      className={css({
        width: "100%",
        height: "100%",
        borderRadius: 10,
        border: "2px solid black",
        padding: 20,
        boxShadow: "4px 4px 0px 0px black",
        bg: themeBg[theme],
      })}
    ></article>
  );
};

export default Card;
