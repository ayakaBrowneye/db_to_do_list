"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";

import { useRegistrationContext } from "@/component/ContextProvider";
import { LoadingSpinner } from "@/component/loadingSpinner";

import style from "./style.module.scss";

type props = {
  onNext: () => void;
};

type Input = {
  user: string;
  pass: string;
};

export function RegistrationInput(props: props) {
  // ユーザーネームとパスを管理するcontext
  const { setUserData } = useRegistrationContext();

  //   エラーメッセージ用useState
  const [error, setError] = useState("");

  // loading用のエラーメッセージ
  const [loading, setLoading] = useState(false);

  // react-hook-formの定義
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  //   登録処理_登録ボタンをクリックしたら発火
  const registration = async (data: Input) => {
    // ローディングスピナーの表示
    setLoading(true);

    // エラーメッセージの初期化
    setError("");

    // DBへのユーザ確認
    try {
      // ユーザーデータの取得→contextに格納
      const { user, pass } = data;
      setUserData({
        user,
        pass,
      });

      // ユーザー名がすでにあるかどうかを確認する
      const registerUrl = `${process.env.NEXT_PUBLIC_API_URL}/login/registrationCheck`;

      const res = await fetch(registerUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!res.ok) {
        const resData: { message: string } = await res.json();
        console.log(resData);
        throw new Error(resData.message);
      }

      setLoading(false);
      props.onNext();
    } catch (e) {
      console.log(error);
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
        {/* ローディングスピナー */}
        {loading && <LoadingSpinner />}
        <div className={style.title}>ユーザー登録</div>
        <form onSubmit={handleSubmit(registration)}>
          {/* エラーメッセージ */}
          {error && <p className={style.error}>{error}</p>}
          <input
            className={style.user}
            placeholder="ユーザー名"
            type="text"
            {...register("user", {
              required: "※ユーザー名は必須です。",
              maxLength: { value: 15, message: "15文字以下で入力してください" },
            })}
          />
          {errors.user && <p className={style.error}>{errors.user.message}</p>}
          <input
            className={style.pass}
            placeholder="パスワード"
            type="text"
            {...register("pass", {
              required: "※パスワードは必須です",
              validate: {
                isPattern: (data) => {
                  if (!/^[A-Za-z0-9]+$/.test(data)) {
                    return "半角英数字のみ使用できます";
                  }
                },
                isValidChars: (data) =>
                  /^[A-Za-z0-9_]+$/.test(data) ||
                  "半角英数字またはアンダースコアのみ使用できます",
              },
              maxLength: {
                value: 20,
                message: "※パスワードは20文字以内で設定してください。",
              },
              minLength: {
                value: 8,
                message: "※パスワードは8文字以上で設定してください",
              },
            })}
          />
          {errors.pass && <p className={style.error}>{errors.pass.message}</p>}
          <button className={style.submit} type="submit">
            登録
          </button>
        </form>
        <div className={style.login}>
          <Link href="/login">ログインはこちら</Link>
        </div>
      </div>
    </div>
  );
}
