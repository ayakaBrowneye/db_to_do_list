import { Suspense } from "react";

import { LoadingSpinner } from "@/component/loadingSpinner";
import Task from "@/component/Task";

import styles from "./style.module.scss";

// export default Home;
export default async function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Suspense fallback={<LoadingSpinner />}>
          <Task />
        </Suspense>
      </main>
    </div>
  );
}
