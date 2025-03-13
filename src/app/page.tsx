import { Header } from "@/component/Header";
import { Lists } from "@/component/List";

import styles from "./page.module.scss";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <Lists />
      </main>
    </div>
  );
}
