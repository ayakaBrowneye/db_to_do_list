import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ペイロードをデコードした時の型
type JwtPayload = {
  id: number;
  username: string;
  exp?: number; // 有効期限（オプション）
};

// _/_/_/_/ トークンと秘密鍵から、ペイロードをデコードする関数
// token:ユーザーのJWT secret:秘密鍵
const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    return decoded;
  } catch (error) {
    console.error("トークンの検証エラー:", error);

    return null;
  }
};

// _/_/_/_/ cookieからユーザーのトークンと秘密鍵を取得して、デコードして返却する関数
export const getPayload = async (): Promise<JwtPayload | null> => {
  try {
    // クッキーからアクセストークンを取得
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      console.error("アクセストークンが取得できませんでした");

      return null;
    }

    const SECRET_KEY: string | undefined = process.env.JWT_SECRET;

    if (!SECRET_KEY) {
      console.error("秘密鍵が取得できませんでした");

      return null;
    }

    // 戻り値がnullだった場合、クッキーを削除する
    const decoded = verifyToken(accessToken, SECRET_KEY);
    if (!decoded) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error(error);

    return null;
  }
};
