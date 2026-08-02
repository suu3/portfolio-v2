import Card, { ThemeBg } from "@/components/Card";
import { getRandomIntegerInRange } from "@/lib/random";
import { css } from "@/styled-system/css";
import { flex, grid } from "@/styled-system/patterns";

const cardTheme: ThemeBg[] = ["lime", "purple", "orange"];
const Skills = () => {
  return (
    <div
      className={flex({
        direction: "column",
        margin: "auto",
      })}
    >
      <h2
        className={css({
          paddingBottom: 20,
          fontSize: 36,
          fontWeight: 700,
          fontFamily: "Prompt",
        })}
      >
        SKILLS
      </h2>
      <div
        className={grid({
          gridTemplateColumns: 3,
          gap: 20,
        })}
      >
        {Array.from({ length: 6 }).map((_, index: number) => {
          return (
            <Card
              key={index}
              theme={cardTheme[getRandomIntegerInRange(0, 2)]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
