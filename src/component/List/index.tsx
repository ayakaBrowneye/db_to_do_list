"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { faCircleCheck, faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LoadingSpinner } from "../loadingSpinner";
import { Modal } from "../Modal";

import styles from "./style.module.scss";

// DBから取得したデータの型
type List = {
  id: number | null;
  title: string;
  completed: boolean;
  createdAt: Date;
};

type props = {
  task: List[];
  userName: string;
};

// 入力データの型定義
type Input = {
  task: string;
};

export function List(props: props) {
  // タスクを管理するuseState
  const [lists, setLists] = useState<List[]>(
    props.task.map((task, index) => ({
      ...task,
      id: index + 1,
    }))
  );

  // メッセージを管理するuseState
  const [message, setMessage] = useState<string>("");

  // loading表示を管理するuseState
  const [loading, setLoading] = useState<boolean>(false);

  // ログアウトを管理するuseState
  const [logout, setLogout] = useState<boolean>(false);

  // エラーメッセージを管理するuseState
  const [error, setError] = useState<string>("");

  // react-hook-formの定義
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>();

  // ※追加ボタン（API通信なし）
  // useStateに格納
  const onAddClick = (data: Input) => {
    // メッセージの初期化
    setMessage("");

    setLists([
      ...lists,
      {
        id: lists.length + 1,
        title: data.task,
        completed: false,
        createdAt: new Date(),
      },
    ]);

    reset();
  };

  ////_/_/_/_/_ ※タスク完了ボタン（API通信なし） _/_/_/_/_
  // useStateに格納されているプロパティを変更
  const onCompleteClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    // メッセージの初期化
    setMessage("");

    // タスクIDとプロパティcompletedの取得
    const id = e.currentTarget.dataset.id;

    const completed = e.currentTarget.dataset.checked === "true";

    setLists((preLists) =>
      preLists.map((list) =>
        list.id === Number(id) ? { ...list, completed: !completed } : list
      )
    );
  };

  ////_/_/_/_/_ ※削除ボタン（APi通信なし）_/_/_/_/_
  // useStateからタスクを削除
  const onDeleteClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id;

    setLists((preLists) => preLists.filter((list) => list.id !== Number(id)));
  };

  ////_/_/_/_/_ ※保存ボタン（API通信あり）_/_/_/_/_
  // useStateの情報をAPIで送信。
  // 保存ができた→保存完了の文言を出す
  // 保存ができなかった場合→エラー表示
  const onSaveclick = async () => {
    try {
      // ローディング画面の表示
      setLoading(true);

      // apiURLの取得
      const fetchUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

      if (!fetchUrl) {
        throw new Error("API URLが設定されていません。");
      }

      // データの保存
      const res = await fetch(fetchUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lists),
      });

      if (!res.ok) {
        throw new Error("正しく保存がされませんでした。");
      }

      setMessage("データの保存が完了しました。");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
      setError("未知のエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    // apiURLの取得
    const logoutUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;

    // データの保存
    const res = await fetch(logoutUrl, {
      method: "GET",
    });

    if (res.ok) {
      setLogout(true);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.name}>
            <p>
              <span>
                <FontAwesomeIcon icon={faUser} style={{ color: "#3498db" }} />
              </span>
              <span>{props.userName}さんのタスク</span>
            </p>
            <p>
              <button className={styles.logout} onClick={onLogout}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  style={{ color: "#fff" }}
                />
              </button>
            </p>
            {/* ログアウトモーダル */}
            {logout && (
              <Modal
                message={`ログアウトが完了しました。`}
                link="/"
                error={false}
              />
            )}
          </div>
          {message && (
            <div className={styles.message}>
              <span>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#3498db" }}
                />
              </span>
              <p>{message}</p>
            </div>
          )}
          {/* ローディングスピナー */}
          {loading && <LoadingSpinner />}
          {/* エラーモーダル */}
          {error && (
            <Modal
              message={`${error}再度ログインし直してください。`}
              link="/"
              error={true}
            />
          )}
          <div className={styles.lists}>
            {lists.length ? (
              lists.map((list) => (
                <div className={styles.list} key={list.id}>
                  <div className={styles.left}>
                    <input
                      className={styles.checkBtn}
                      type="checkbox"
                      checked={list.completed}
                      data-id={String(list.id)}
                      data-checked={list.completed}
                      onChange={onCompleteClick}
                    ></input>
                    <div className={styles.text}>{list.title}</div>
                  </div>
                  <div
                    className={styles.right}
                    onClick={onDeleteClick}
                    data-id={String(list.id)}
                  >
                    削除
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.notask}>タスクを追加しましょう</div>
            )}
          </div>
          <div className={styles.add}>
            <form onSubmit={handleSubmit(onAddClick)}>
              <input
                className={styles.textbox}
                type="text"
                id="task"
                placeholder="To Do Listを入力してください"
                {...register("task", { required: true })}
              />
              {errors.task && errors.task.type === "required" && (
                <p>※この項目は必須です。</p>
              )}
              <div className={styles.button}>
                <button className={styles.submit} type="submit">
                  add
                </button>
                <button
                  className={styles.submit}
                  type="button"
                  onClick={onSaveclick}
                >
                  save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
