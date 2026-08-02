import styles from "./marquee.module.css";

type Props = {
  items: string[];
  /** seconds for one full pass */
  duration?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
};

/** Zine-style scrolling ticker band. Pauses on hover. */
const Marquee = ({
  items,
  duration = 24,
  reverse = false,
  separator = "✦",
  className,
}: Props) => {
  const row = (key: string) => (
    <div
      key={key}
      className={styles.track}
      style={{ ["--dur" as string]: `${duration}s` }}
      aria-hidden={key === "b"}
    >
      {items.map((item, i) => (
        <span key={`${key}-${i}`} style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {item}
          <span style={{ opacity: 0.5 }}>{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={[styles.wrap, reverse ? styles.reverse : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {row("a")}
      {row("b")}
    </div>
  );
};

export default Marquee;
