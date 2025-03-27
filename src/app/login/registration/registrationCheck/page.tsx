"use client";

import { useState } from "react";

import { useRegistrationContext } from "@/component/ContextProvider";
import { LoadingSpinner } from "@/component/loadingSpinner";
import { Modal } from "@/component/Modal";

import style from "./style.module.scss";

type props = {
  onBack: () => void;
};
export default function RegistrationCheck(props: props) {
  // contextの内容の取得
  const { userData } = useRegistrationContext();

  //   エラーメッセージ用useState
  const [error, setError] = useState("");

  // loading用フラグ
  const [loading, setLoading] = useState(false);

  // モーダル用フラグ
  const [modal, setModal] = useState(false);

  // パスワード表示用の文字列編集
  const showPass = userData.pass.slice(-4);

  //   登録処理_登録ボタンをクリックしたら発火
  const registration = async () => {
    // DBへの登録処理
    try {
      // loadingスピナー表示
      setLoading(true);

      const registerUrl = `${process.env.NEXT_PUBLIC_API_URL}/login/registration`;

      const res = await fetch(registerUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userData.user, pass: userData.pass }),
      });

      if (!res.ok) {
        const resData: { error: string } = await res.json();
        throw new Error(`${resData.error}`);
      }

      // モーダル表示後、スピナー非表示
      setModal(true);
      setLoading(false);
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
        {/* モーダル */}
        {modal && (
          <Modal message="登録が完了しました" link="/login" error={false} />
        )}
        <div className={style.title}>登録内容確認</div>
        <p className={style.text}>登録内容をご確認ください。</p>
        <div>
          <dl>
            <dt>名前</dt>
            <dd>{userData.user}</dd>
            <dt>パスワード</dt>
            <dd>{`************${showPass}`}</dd>
          </dl>
          <div className={style.submit}>
            <button type="submit" onClick={props.onBack}>
              戻る
            </button>
            <button
              className={style.submit}
              type="submit"
              onClick={registration}
            >
              登録
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
