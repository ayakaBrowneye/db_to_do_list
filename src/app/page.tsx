import styles from "./page.module.scss";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>ToDoList</h1>
      </main>
    </div>
  );
}
