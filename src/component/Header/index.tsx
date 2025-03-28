import { NextPage } from "next";

import styles from "./style.module.scss";

// 共通ヘッダー
export const Header: NextPage = () => {
  return (
    <header>
      <h1 className={styles.header}>To Do List</h1>
    </header>
  );
};
