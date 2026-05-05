"use client";

import styles from "./MemberCard.module.css";

export default function MemberCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        {/* Top row */}
        <div className={styles.cardTop}>
          <span className={styles.brandMark}>SLOWHRS</span>
          <span className={styles.cardId}>SH-00024</span>
        </div>

        {/* Center */}
        <div className={styles.cardCenter}>
          <p className={styles.memberName}>Pending Member.</p>
        </div>

        {/* Bottom row */}
        <div className={styles.cardBottom}>
          <span className={styles.tierLabel}>Guest</span>
          <div className={styles.hearts}>
            {[0, 1, 2, 3].map((i) => (
              <svg key={i} width="14" height="13" viewBox="0 0 14 13" className={i === 0 ? styles.heartFilled : styles.heartEmpty}>
                <path d="M7 1.5l1.7 3.5 3.8.6-2.75 2.7.65 3.7L7 10.4 3.6 12l.65-3.7L1.5 5.6l3.8-.6L7 1.5z" fill="currentColor" />
              </svg>
            ))}
          </div>
        </div>

        {/* Corner marks */}
        <div className={`${styles.corner} ${styles.cornerTL}`} />
        <div className={`${styles.corner} ${styles.cornerBR}`} />
      </div>
    </div>
  );
}
