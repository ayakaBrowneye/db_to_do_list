import { NextPage } from "next";

import styles from "./style.module.scss";

export const LoadingSpinner: NextPage = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};
