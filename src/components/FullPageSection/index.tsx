import { css, cx } from "@/styles/css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const FullPageSection = ({ children, className }: Props) => {
  return (
    <section
      className={cx(
        css({
          height: "100vh",
        }),
        className
      )}
    >
      {children}
    </section>
  );
};

export default FullPageSection;
