import { useEffect } from "react";

const useScrollLock = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow; // 기존 스타일 저장
    document.body.style.overflow = "hidden"; // 스크롤 잠금

    return () => {
      document.body.style.overflow = originalStyle; // 컴포넌트 언마운트 시 원래 스타일 복원
    };
  }, []);

  const unlockScroll = () => {
    document.body.style.overflow = "auto";
  };

  return unlockScroll;
};

export default useScrollLock;
