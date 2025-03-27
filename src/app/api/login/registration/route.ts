import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // 送信されたユーザーの名前とパスワードを取得
  const { user, pass } = await req.json();

  // prismaのインスタンスを生成
  const prisma = new PrismaClient();

  try {
    // DB登録処理
    const register = await prisma.user.create({
      data: {
        username: user,
        password: pass,
      },
    });

    return NextResponse.json(
      {
        res: register,
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ res: e.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        res: "予期せぬエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
