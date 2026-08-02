import styles from "./cropmarks.module.css";

/**
 * Print registration marks pinned to the viewport corners, so the whole page
 * reads as a poster proof sheet. Purely decorative.
 */
const CropMarks = () => (
  <div className={styles.wrap} aria-hidden>
    <span className={`${styles.mark} ${styles.tl}`} />
    <span className={`${styles.mark} ${styles.tr}`} />
    <span className={`${styles.mark} ${styles.bl}`} />
    <span className={`${styles.mark} ${styles.br}`} />
  </div>
);

export default CropMarks;
