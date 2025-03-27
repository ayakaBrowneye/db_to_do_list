import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json();

  const prisma = new PrismaClient();

  type User = {
    id: number;
    username: string;
    password: string;
  };

  try {
    //   登録済みか否か確認
    const isExistUser: Array<User> = await prisma.user.findMany({
      where: {
        username: user,
      },
    });

    if (!isExistUser.length) {
      throw new Error("※ユーザー登録がありません。");
    }

    // ユーザーパスワードチェック
    if (isExistUser[0].password !== pass) {
      throw new Error("※パスワードが一致しません");
    }

    // JWTを生成するためにペイロードを設定
    const payload = {
      id: isExistUser[0].id,
      username: isExistUser[0].username,
      iat: Math.floor(Date.now() / 1000), // 発行時刻（秒単位）
    };

    // ペイロードを基にアクセストークンとリフレッシュトークンを生成
    // ↓アクセストークン
    const SECRET_KEY = process.env.JWT_SECRET as string;
    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    // ↓リフレッシュトークン
    const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7h",
    });

    // アクセストークンとリフレッシュトークンをクッキーに保存
    const cookieStore = await cookies();

    cookieStore.set({
      name: "accessToken", //クッキー名の指定
      value: accessToken, // クッキーの値
      httpOnly: true, //javascriptでアクセスできないように
      maxAge: 60 * 60, //有効期限1時間
      path: "/",
      secure: false,
    });

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      maxAge: 60 * 60 * 6, //有効期限６時間
      path: "/",
      secure: false,
    });

    // ステータス200を返却
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 401 });
    }
    return NextResponse.json(
      {
        message: "予期せぬエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // アクセストークンとリフレッシュトークンをクッキーから削除
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return NextResponse.json(
    {
      message: "トークンを削除しました",
    },
    { status: 200 }
  );
}
