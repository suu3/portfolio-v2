type Props = {
  value: string;
  height?: number;
  className?: string;
};

/** Decorative barcode — bar widths are derived from the string, so it's stable across renders. */
const Barcode = ({ value, height = 22, className }: Props) => {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  const src = (value + "·portfolio").split("");
  src.forEach((ch, i) => {
    const code = ch.charCodeAt(0) + i * 7;
    const w = 1 + (code % 3);
    const gap = 1 + ((code >> 2) % 2);
    bars.push({ x, w });
    x += w + gap;
  });

  return (
    <svg
      width={x}
      height={height}
      viewBox={`0 0 ${x} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="currentColor" />
      ))}
    </svg>
  );
};

export default Barcode;
