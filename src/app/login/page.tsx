"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/component/loadingSpinner";

import style from "./style.module.scss";

export default function Register() {
  // ログインフォーム入力値の型定義;
  type Input = {
    user: string;
    pass: string;
  };

  // ローディングスピナー切り替え用
  const [loading, setLoading] = useState<boolean>(false);

  //   エラーメッセージ用useState
  const [error, setError] = useState<string>("");

  // useRouterのインスタンス生成
  const router = useRouter();

  // react-hook-formの定義
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Input>();

  //   登録処理_登録ボタンをクリックしたら発火
  const login = async (data: Input) => {
    // エラー変数の初期化
    setError("");

    // ローディングスピナーの表示
    setLoading(true);

    // 入力データの取得
    const { user, pass } = data;

    // ログインAPIURLの定義
    const registerUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;

    // ログイン処理のAPIを呼び出す
    try {
      const res = await fetch(registerUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, pass }),
      });

      // ログインAPIでステータスが200でなかった場合
      if (!res.ok) {
        const error: { message: string } = await res.json();

        throw new Error(error.message);
      }

      // ダッシュボード画面にリダイレクト
      router.push("/dashboard");

      reset();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.wrapper}>
        {loading && <LoadingSpinner />}
        <div className={style.title}>ログイン</div>
        <form onSubmit={handleSubmit(login)}>
          {error && <p className={style.error}>{error}</p>}
          <input
            className={style.user}
            placeholder="ユーザー名"
            type="text"
            {...register("user", {
              required: "※ユーザー名は必須です。",
            })}
          />
          {errors.user && <p className={style.error}>{errors.user.message}</p>}
          <input
            className={style.pass}
            placeholder="パスワード"
            type="text"
            {...register("pass", {
              required: "※パスワードは必須です",
            })}
          />
          {errors.pass && <p className={style.error}>{errors.pass.message}</p>}
          <button className={style.submit} type="submit">
            Login
          </button>
        </form>
        <div className={style.register}>
          <Link href="/login/registration">ユーザー登録はこちら</Link>
        </div>
      </div>
    </div>
  );
}
