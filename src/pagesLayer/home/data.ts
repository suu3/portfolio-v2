/**
 * 공개 저장소에 올라가는 더미 데이터입니다.
 * 실제 이력 내용은 로컬 백업본에서 이 파일만 교체해 사용합니다.
 */

export const profile = {
  name: "Sample Dev",
  handle: "sample",
  role: "Frontend Developer",
  tagline: "확장 가능한 구조 설계와\n인터랙티브 웹을 만듭니다.",
  email: "hello@example.com",
  github: "https://github.com/",
  blog: "https://example.com/blog",
  location: "Seoul, KR",
};

export const about = [
  {
    no: "01",
    title: "타 직군과의 소통",
    body: "샘플 텍스트입니다. 협업 방식과 커뮤니케이션에 대한 소개가 이 자리에 들어갑니다. 문단 길이를 가늠하기 위한 더미 문장이며, 실제 내용으로 교체됩니다.",
  },
  {
    no: "02",
    title: "변경에 강한 구조",
    body: "샘플 텍스트입니다. 설계 관점과 구조에 대한 소개가 이 자리에 들어갑니다. 문단 길이를 가늠하기 위한 더미 문장이며, 실제 내용으로 교체됩니다.",
  },
  {
    no: "03",
    title: "자동화와 관측 가능성",
    body: "샘플 텍스트입니다. 자동화·모니터링 경험에 대한 소개가 이 자리에 들어갑니다. 문단 길이를 가늠하기 위한 더미 문장이며, 실제 내용으로 교체됩니다.",
  },
];

export type Project = {
  title: string;
  period: string;
  team: string;
  summary: string;
  stack: string[];
  highlights: string[];
};

export const company = {
  name: "Sample Company",
  role: "웹 프론트엔드 개발자",
  period: "20XX.XX — 재직 중",
  intro:
    "샘플 회사 소개 문장입니다. 담당한 서비스와 역할에 대한 한두 줄 설명이 이 자리에 들어갑니다.",
};

export const projects: Project[] = [
  {
    title: "Sample Project A",
    period: "20XX.XX — 현재",
    team: "FE 3명",
    summary: "프로젝트 한 줄 요약이 들어가는 자리입니다. 목적과 범위를 간단히 설명합니다.",
    stack: [
      "Turborepo",
      "Next.js (App Router)",
      "PandaCSS",
      "TypeScript",
      "Three.js / GLB",
      "Zod",
      "React Hook Form",
      "Playwright",
      "MSW",
    ],
    highlights: [
      "성과 항목 1 — 무엇을 어떻게 개선했는지 한 문장으로 적는 자리입니다.",
      "성과 항목 2 — 구조 설계나 리팩터링 내용을 적는 자리입니다.",
      "성과 항목 3 — 상태 관리·동기화 관련 내용을 적는 자리입니다.",
      "성과 항목 4 — 마이그레이션이나 인증 관련 내용을 적는 자리입니다.",
      "성과 항목 5 — 자동화 워크플로 관련 내용을 적는 자리입니다.",
      "성과 항목 6 — 빌드·배포 최적화 관련 내용을 적는 자리입니다.",
    ],
  },
  {
    title: "Sample Project B",
    period: "20XX.XX — 20XX.XX",
    team: "FE 1명 (단독)",
    summary: "프로젝트 한 줄 요약이 들어가는 자리입니다. 데이터 시각화 서비스 예시입니다.",
    stack: [
      "Next.js (Page Router)",
      "TypeScript",
      "SCSS",
      "Chart Library",
      "Playwright",
      "Storybook",
      "AWS",
    ],
    highlights: [
      "성과 항목 1 — 인터랙티브 차트 개발 내용을 적는 자리입니다.",
      "성과 항목 2 — 레거시 마이그레이션 내용을 적는 자리입니다.",
      "성과 항목 3 — 번들·폰트 최적화 내용을 적는 자리입니다.",
      "성과 항목 4 — 테스트·CI/CD 구축 내용을 적는 자리입니다.",
    ],
  },
  {
    title: "Sample Design System",
    period: "협업 프로젝트",
    team: "FE 5명 · 디자이너 4명",
    summary: "디자이너와 프론트엔드가 함께 공통 디자인 시스템을 구축한 프로젝트 예시입니다.",
    stack: ["Storybook", "React", "PandaCSS", "TypeScript"],
    highlights: [
      "성과 항목 1 — 토큰·프리셋 세팅 내용을 적는 자리입니다.",
      "성과 항목 2 — 담당한 공통 컴포넌트를 적는 자리입니다.",
      "성과 항목 3 — 컴포넌트 추상화 방식에 대해 적는 자리입니다.",
    ],
  },
  {
    title: "Sample Project C",
    period: "20XX.XX — 20XX.XX",
    team: "FE 3명",
    summary: "신규 기능 개발 및 유지보수를 담당한 프로젝트 예시입니다.",
    stack: ["React", "JavaScript", "SCSS", "react-i18next"],
    highlights: [
      "성과 항목 1 — 짧은 기간에 완료한 기능 개발 내용을 적는 자리입니다.",
      "성과 항목 2 — 담당한 도메인 기능을 적는 자리입니다.",
      "성과 항목 3 — 공통 컴포넌트·인터랙션 개발 내용을 적는 자리입니다.",
    ],
  },
];

export const skills = [
  { group: "주력", items: ["Next.js", "React", "TypeScript", "PandaCSS", "SCSS"] },
  {
    group: "경험",
    items: [
      "React Query",
      "Recoil",
      "Zod",
      "React Hook Form",
      "Emotion",
      "Playwright",
      "Jest",
      "MSW",
      "Storybook",
      "Turborepo",
      "Three.js / R3F",
      "Framer Motion",
      "AWS",
      "Django",
      "Gatsby",
      "PWA",
    ],
  },
];

export const sideProjects = [
  {
    year: "20XX",
    title: "인터랙티브 3D 웹 — 샘플",
    body: "개인 프로젝트 소개가 들어가는 자리입니다. 사용 기술과 만들고 있는 경험을 짧게 적습니다.",
  },
  {
    year: "20XX",
    title: "스터디 · 애니메이션 웹",
    body: "스터디 활동 소개가 들어가는 자리입니다. 학습한 내용과 적용 사례를 짧게 적습니다.",
  },
  {
    year: "—",
    title: "기술 블로그 · 정적 사이트",
    body: "개인 블로그와 사이드 결과물 소개가 들어가는 자리입니다.",
  },
];

export const oss = [
  { org: "Sample OSS A", desc: "문서 수정 기여 예시", year: "20XX" },
  { org: "Sample OSS B", desc: "버그 제보 및 반영 예시", year: "20XX" },
  { org: "Sample OSS C", desc: "번역 기여 예시", year: "20XX" },
];

export const certs = [
  { year: "20XX.XX", title: "Sample Certificate", sub: "자격증 설명 자리" },
  { year: "20XX.XX", title: "Sample Certificate", sub: "자격증 설명 자리" },
];

export const languages = [
  { year: "20XX.XX", title: "Language Test", sub: "000" },
  { year: "20XX.XX", title: "Language Test", sub: "000" },
  { year: "20XX.XX", title: "Language Test", sub: "등급" },
];

export const awards = [
  { year: "20XX.XX", title: "수상 내역이 들어가는 자리 1" },
  { year: "20XX.XX", title: "수상 내역이 들어가는 자리 2" },
  { year: "20XX.XX", title: "수상 내역이 들어가는 자리 3" },
];

export const education = {
  school: "Sample University 컴퓨터공학과",
  period: "20XX — 20XX",
  detail: "학력 상세가 들어가는 자리입니다.",
};
