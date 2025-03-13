"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import styles from "./style.module.scss";

// DBから取得したデータの型
type List = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
};

// 入力データの型定義
type Input = {
  task: string;
};

export const Lists = () => {
  // 表示させるリスト一覧をフロント側で管理する配列
  const [lists, setLists] = useState<Array<List>>([]);

  // 初回のレンダリングの時のみDBよりデータ取得
  useEffect(() => {
    type getDataRes = {
      status: number;
      res: Array<List>;
    };

    //// データの取得処理
    const getData = async () => {
      const getUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
      try {
        const res = await fetch(getUrl);
        if (!res.ok) {
          throw new Error(`status:${res.status}`);
        }
        const resData: getDataRes = await res.json();
        setLists(resData.res);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  // react-hook-formの定義
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>();

  //// 登録処理
  const add = async (data: Input) => {
    const createUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
    // DBへの登録処理
    try {
      const res = await fetch(createUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: data.task }),
      });

      if (!res.ok) {
        throw new Error(`status:${res.status}`);
      }

      const resData = await res.json();
      // 登録処理が完了したら、フロント側で管理するタスク一覧の配列に格納
      setLists([...lists, resData.res]);
      // フォームの入力内容をリセット
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  //// 削除処理
  const remove = async (e: React.MouseEvent<HTMLInputElement>) => {
    // id番号の取得
    const id = e.currentTarget.dataset.num;
    // 削除URLの生成
    const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/${id}`;

    // APIを通して削除処理
    try {
      const res = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`status:${res.status}`);
      }
      // 問題なく削除APIが実行されたら、配列より対象のタスクを処理
      setLists((prevLists) =>
        prevLists.filter((item) => item.id != Number(id))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 更新処理
  const changeCompleted = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // idの取得
    const id = e.currentTarget.dataset.num;
    // 更新URLの生成
    const updataUrl = `${process.env.NEXT_PUBLIC_API_URL}/${id}`;

    // 完了済みか否かを判定
    const completed = e.currentTarget.dataset.checked === "true";

    // 更新処理
    try {
      const res = await fetch(updataUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) {
        throw new Error(`status:${res.status}`);
      }

      const resData = await res.json();

      console.log(resData);

      // 問題なく更新処理が完了したら、配列の内容を更新
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === Number(id)
            ? { ...list, completed: !list.completed }
            : list
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.lists}>
        {lists.length ? (
          lists.map((list) => (
            <div className={styles.list} key={list.id}>
              <div className={styles.left}>
                <input
                  className={styles.checkBtn}
                  type="checkbox"
                  checked={list.completed}
                  data-num={String(list.id)}
                  data-checked={list.completed}
                  onChange={changeCompleted}
                ></input>
                <div className={styles.text}>{list.title}</div>
              </div>
              <div
                className={styles.right}
                onClick={remove}
                data-num={String(list.id)}
              >
                削除
              </div>
            </div>
          ))
        ) : (
          <div className={styles.notask}>No task</div>
        )}
      </div>
      <div className={styles.add}>
        <form onSubmit={handleSubmit(add)}>
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
          <button className={styles.submit} type="submit">
            add
          </button>
        </form>
      </div>
    </div>
  );
};
