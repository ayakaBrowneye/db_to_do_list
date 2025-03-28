import { NextPage } from "next";

import styles from "./style.module.scss";

// ローディングスピナー
// 画面いっぱいにスピナーが表示される
export const LoadingSpinner: NextPage = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};
