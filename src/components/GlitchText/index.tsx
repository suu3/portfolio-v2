import styles from "./glitch.module.css";

type Props = {
  children: string;
  /** keep the RGB split running instead of only on hover */
  live?: boolean;
  className?: string;
};

const GlitchText = ({ children, live = false, className }: Props) => (
  <span
    className={[styles.glitch, live ? styles.live : "", className ?? ""]
      .filter(Boolean)
      .join(" ")}
    data-text={children}
  >
    {children}
  </span>
);

export default GlitchText;
