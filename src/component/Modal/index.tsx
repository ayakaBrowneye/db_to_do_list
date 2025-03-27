import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import style from "./style.module.scss";

type props = {
  message: string;
  link: string;
  error: boolean;
};

export const Modal = (props: props) => {
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <div className={style.wrapper}>
          <div className={style.top}>
            <span>
              {props.error ? (
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{ color: "#3498db" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#3498db" }}
                />
              )}
            </span>
            <p>{props.message}</p>
          </div>
          <Link className={style.bottom} href={props.link}>
            閉じる
          </Link>
        </div>
      </div>
    </div>
  );
};
