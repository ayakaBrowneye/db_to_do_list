import { PrismaClient } from "@prisma/client";

import { List } from "@/component/List";
import { getPayload } from "@/lib/auth/auth";

// 取得データの型定義
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

export default async function Task() {
  const decoded: JwtPayload | null = await getPayload();

  if (!decoded) {
    throw new Error("ユーザー情報を取得できませんでした。");
  }

  // DBへの問い合わせ
  const prisma = new PrismaClient();

  const findList: Array<List> = await prisma.lists.findMany({
    where: {
      userId: decoded.id,
    },
    select: {
      id: true,
      title: true,
      completed: true,
      createdAt: true,
    },
  });

  return <List task={findList} userName={decoded.username} />;
}
