import styles from "./sparkle.module.css";

type Props = {
  size?: number;
  color?: string;
  /** slow spin + twinkle */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/** The 4-point concave star that anchors the poster/HUD look. */
const Sparkle = ({
  size = 24,
  color = "#ff6737",
  animate = true,
  className,
  style,
}: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-hidden
    className={[animate ? styles.spin : "", className ?? ""].filter(Boolean).join(" ")}
    style={style}
  >
    <path
      d="M50 0 C50 27 27 50 0 50 C27 50 50 73 50 100 C50 73 73 50 100 50 C73 50 50 27 50 0Z"
      fill={color}
    />
  </svg>
);

export default Sparkle;
