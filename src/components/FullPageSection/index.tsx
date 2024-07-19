import { css, cx } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import { ForwardedRef, forwardRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  alignCenter?: boolean;
  ref: (el: HTMLDivElement) => HTMLDivElement; //' ForwardedRef<HTMLDivElement>
}

const FullPageSection = forwardRef<HTMLDivElement, Props>(
  ({ children, className, alignCenter = false }, ref) => {
    return (
      <section
        ref={ref}
        className={cx(
          css({
            height: "100vh",
            fontSize: 24,
          }),
          alignCenter &&
            flex({
              align: "center",
            }),
          className
        )}
      >
        {children}
      </section>
    );
  }
);

export default FullPageSection;
