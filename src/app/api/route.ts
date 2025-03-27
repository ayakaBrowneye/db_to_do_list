import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { getPayload } from "@/lib/auth/auth";

// DBへデータ登録
export async function POST(req: NextRequest) {
  // リクエストの型定義
  type List = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
  };

  // ペイロードをデコードした時の型
  type JwtPayload = {
    id: number;
    username: string;
    exp?: number; // 有効期限（オプション）
  };

  try {
    //  cookieを取得してユーザー情報を獲得
    const userPayload: JwtPayload | null = await getPayload();

    if (!userPayload) {
      throw new Error("ユーザー情報を取得できませんでした。");
    }

    // 登録内容の取得
    const lists: List[] = await req.json();

    console.log(lists);

    // prismaのインスタンス生成
    const prisma = new PrismaClient();

    // DBのユーザIDに紐づいたタスクデータを全て削除
    const deleteList = await prisma.lists.deleteMany({
      where: {
        userId: userPayload.id,
      },
    });

    // 登録するタスクがなかった場合、ここで処理を終了
    if (lists.length === 0) {
      return Response.json(
        {
          message: `${deleteList.count}件のタスクを削除しました。`,
        },
        { status: 200 }
      );
    }

    // 登録用に配列を再構成
    const newList: {
      title: string;
      completed: boolean;
      createdAt: Date;
      userId: number;
    }[] = lists.map((list) => {
      return {
        title: list.title,
        completed: list.completed,
        createdAt: list.createdAt,
        userId: userPayload.id,
      };
    });

    // DBにユーザIDと一括登録
    const createList = await prisma.lists.createMany({
      data: newList,
    });

    return Response.json(
      {
        message: `${deleteList.count}件のタスクを削除し、${createList.count}件のタスクを追加しました。`,
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
