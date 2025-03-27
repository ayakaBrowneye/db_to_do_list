import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await req.json();

  const prisma = new PrismaClient();

  try {
    //   すでに登録がないか確認する
    const isExistUser = await prisma.user.findMany({
      where: {
        username: user,
      },
    });

    if (isExistUser.length) {
      throw new Error("※このユーザーネームはすでに使用されています。");
    }

    return NextResponse.json(
      {
        message: "登録可能",
      },
      { status: 200 }
    );
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
