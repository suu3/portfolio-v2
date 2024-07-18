import FullPageSection from "@/components/FullPageSection";
import { flex } from "@/styles/patterns";

const Home = () => {
  return (
    <FullPageSection
      className={flex({
        align: "center",
        // justify: "center",
      })}
    >
      안녕하세요, 프론트엔드 개발자 변수경입니다.
    </FullPageSection>
  );
};

export default Home;
