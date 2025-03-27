"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import style from "./error.module.scss";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={style.wrapper}>
      <h2 className={style.title}>
        エラーが発生しました。再度、ログインを実施してください。
      </h2>
      <Link className={style.bottom} href="/login">
        ログイン画面へ
        <FontAwesomeIcon
          icon={faUpRightFromSquare}
          style={{ color: "#3498db" }}
        />
      </Link>
    </div>
  );
}
