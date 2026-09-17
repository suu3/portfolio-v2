/**
 * The pixel rabbit from the character's bag charm, lifted pixel-for-pixel
 * out of the .blend (6 × 8). Used as the logo mark.
 */
const PIXELS = [
  ".X..X.",
  ".X..X.",
  ".XXXX.",
  "XXXXXX",
  "XBXXBX",
  "XXXXXX",
  ".XBBX.",
  "..XX..",
];

type Props = {
  size?: number;
  color?: string;
  ink?: string;
  className?: string;
};

const PixelRabbit = ({ size = 24, color = "currentColor", ink = "transparent", className }: Props) => (
  <svg
    width={(size * 6) / 8}
    height={size}
    viewBox="0 0 6 8"
    shapeRendering="crispEdges"
    aria-hidden
    className={className}
  >
    {PIXELS.flatMap((row, y) =>
      row.split("").map((p, x) =>
        p === "." ? null : (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={p === "B" ? ink : color} />
        )
      )
    )}
  </svg>
);

export default PixelRabbit;
