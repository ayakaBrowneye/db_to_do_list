import {
  faAddressCard,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import styles from "./page.module.scss";

// export default Home;
export default async function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.title}>タスクを記録しよう</div>
        <div className={styles.bottom}>
          <Link href="/login" className={styles.link}>
            <span>
              <FontAwesomeIcon icon={faArrowRightToBracket} />
            </span>
            ユーザーの方はこちらから
          </Link>
          <Link href="/login/registration" className={styles.link}>
            <span>
              <FontAwesomeIcon icon={faAddressCard} />
            </span>
            登録される方はこちらから
          </Link>
        </div>
      </main>
    </div>
  );
}
