import { css } from "@/styles/css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const FullPageSection = ({ children }: Props) => {
  return (
    <section
      //   className={styles.section}
      className={css({
        height: "100vh",
      })}
    >
      {children}
    </section>
  );
};

export default FullPageSection;
