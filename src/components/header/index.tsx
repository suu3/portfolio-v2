import { forwardRef } from "react";
import styles from "./style.module.css";
import Magnetic from "../magnetic";

const Header = forwardRef(function Index({ refs }, ref) {
  return (
    <div className={styles.header}>
      <Magnetic>
        <div className={styles.burger}>
          <div
            ref={(el) => (refs.current[0] = el)}
            className={styles.bounds}
          ></div>
          Home
        </div>
      </Magnetic>
      <Magnetic>
        <div className={styles.burger}>
          <div
            ref={(el) => (refs.current[1] = el)}
            className={styles.bounds}
          ></div>
          Project
        </div>
      </Magnetic>
    </div>
  );
});

export default Header;
