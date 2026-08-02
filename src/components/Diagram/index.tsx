import { INK, ORANGE, LIME, PEACH, PAPER, prompt, mono } from "@/pagesLayer/home/ui";

const W = 900;

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  fill?: string;
  accent?: boolean;
};

const Box = ({ x, y, w, h, label, sub, fill = PAPER, accent = false }: BoxProps) => (
  <g>
    <rect x={x + 4} y={y + 4} width={w} height={h} rx={10} fill={INK} />
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill={fill}
      stroke={INK}
      strokeWidth={2.5}
    />
    <text
      x={x + w / 2}
      y={sub ? y + h / 2 - 6 : y + h / 2 + 5}
      textAnchor="middle"
      fontFamily={accent ? mono : prompt}
      fontSize={accent ? 13 : 15}
      fontWeight={700}
      fill={INK}
      letterSpacing={accent ? "0.08em" : "0"}
    >
      {label}
    </text>
    {sub && (
      <text
        x={x + w / 2}
        y={y + h / 2 + 14}
        textAnchor="middle"
        fontFamily={mono}
        fontSize={11}
        fill="#5b5c64"
        letterSpacing="0.04em"
      >
        {sub}
      </text>
    )}
  </g>
);

const Arrow = ({ x, y1, y2 }: { x: number; y1: number; y2: number }) => (
  <g stroke={INK} strokeWidth={2.5} fill="none">
    <line x1={x} y1={y1} x2={x} y2={y2 - 8} />
    <path d={`M${x - 5} ${y2 - 9} L${x} ${y2} L${x + 5} ${y2 - 9}`} fill={INK} stroke="none" />
  </g>
);

const Tag = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <text
    x={x}
    y={y}
    fontFamily={mono}
    fontSize={11}
    fontWeight={700}
    fill={ORANGE}
    letterSpacing="0.16em"
  >
    {text}
  </text>
);

/** 지도·필터·URL·API의 상태 모델을 Adapter/Coordinator로 분리한 구조 */
export const GeoSyncDiagram = () => {
  const sources = ["지도 클릭", "필터 선택", "URL 복원", "뒤로가기"];
  const outputs = ["지도 query", "URL query", "API 파라미터"];
  return (
    <svg viewBox={`0 0 ${W} 512`} width="100%" role="img" aria-label="지역 상태 동기화 구조도">
      <Tag x={30} y={16} text="INPUT / 상태 변경 출처" />
      {sources.map((s, i) => (
        <Box key={s} x={30 + i * 215} y={28} w={195} h={50} label={s} fill={PEACH} />
      ))}
      {sources.map((_, i) => (
        <Arrow key={i} x={30 + i * 215 + 97} y1={78} y2={122} />
      ))}

      <Box
        x={150}
        y={122}
        w={600}
        h={72}
        label="Coordinator — useSyncSample"
        sub="출처를 추적해 반복 갱신·query 덮어쓰기 방지"
        fill={LIME}
      />
      <Arrow x={450} y1={194} y2={232} />

      <Box
        x={150}
        y={232}
        w={600}
        h={66}
        label="Adapter — resolveSampleQuery"
        sub="서로 다른 상태 모델 간 변환 책임"
        fill={ORANGE}
      />
      <Arrow x={450} y1={298} y2={336} />

      <Tag x={30} y={328} text="OUTPUT / 동기화 대상" />
      {outputs.map((o, i) => (
        <Box key={o} x={30 + i * 290} y={336} w={260} h={50} label={o} accent />
      ))}
      {outputs.map((_, i) => (
        <Arrow key={i} x={30 + i * 290 + 130} y1={386} y2={424} />
      ))}

      <Box
        x={30}
        y={424}
        w={840}
        h={68}
        label="지표 A · 지표 B · 랭킹 · 리스트"
        sub="어떤 경로로 지역을 바꿔도 같은 기준으로 갱신 / 새로고침·링크 공유 시 복원"
        fill={PAPER}
      />
    </svg>
  );
};

/** 제품별 차이를 config·전략 객체로 외부화해 공통 엔진을 건드리지 않는 구조 */
export const ProductConfigDiagram = () => {
  const products = ["Product A", "Product B", "Product C"];
  const injected = ["GLB Viewer", "모델 스펙", "상태 저장 방식"];
  return (
    <svg viewBox={`0 0 ${W} 470`} width="100%" role="img" aria-label="제품 확장 구조도">
      <Tag x={30} y={16} text="CONFIG / 제품별 차이 (외부화)" />
      {products.map((p, i) => (
        <Box
          key={p}
          x={30 + i * 290}
          y={28}
          w={260}
          h={64}
          label={p}
          sub="프레임·재단선·면 구성"
          fill={PEACH}
        />
      ))}
      {products.map((_, i) => (
        <Arrow key={i} x={30 + i * 290 + 130} y1={92} y2={132} />
      ))}

      <Box
        x={30}
        y={132}
        w={840}
        h={76}
        label="공통 편집 엔진 — 수정하지 않음"
        sub="Strategy + Dependency Injection / 상속 대신 합성"
        fill={LIME}
      />

      <Tag x={30} y={232} text="INJECT / 외부에서 주입" />
      {injected.map((s, i) => (
        <Box key={s} x={30 + i * 290} y={244} w={260} h={50} label={s} accent />
      ))}
      {injected.map((_, i) => (
        <Arrow key={i} x={30 + i * 290 + 130} y1={294} y2={332} />
      ))}

      <Box
        x={30}
        y={332}
        w={840}
        h={64}
        label="순수 계산 파이프라인 — 배치 · 크롭 · 테마 합성 · 3D 텍스처"
        sub="화면 편집 / 저장 이미지 / 3D 텍스처가 같은 계산 결과를 공유"
        fill={ORANGE}
      />
      <Arrow x={450} y1={396} y2={420} />

      <text
        x={450}
        y={444}
        textAnchor="middle"
        fontFamily={prompt}
        fontSize={16}
        fontWeight={700}
        fill={INK}
      >
        신규 제품 추가 = spec 추가만 (공통 엔진 변경 없음)
      </text>
    </svg>
  );
};
