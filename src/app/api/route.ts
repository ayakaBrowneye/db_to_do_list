import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

// DBのデータ取得
export async function GET() {
  // 取得データの型定義
  type List = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
  };

  // prismaインスタンスの生成
  const prisma = new PrismaClient();

  // DBからデータの取得
  const lists: Array<List> = await prisma.lists.findMany();
  return Response.json({
    status: 200,
    res: lists,
  });
}

// DBへデータ登録
export async function POST(req: NextRequest) {
  // リクエストの型定義
  type ReqData = {
    task: string;
  };
  // prismaのインスタンス生成
  const prisma = new PrismaClient();
  // 登録内容の取得
  const data: ReqData = await req.json();
  // リストの登録
  const list = await prisma.lists.create({
    data: {
      title: data.task,
    },
  });

  return Response.json({
    status: 200,
    message: "post test",
    res: list,
  });
}
