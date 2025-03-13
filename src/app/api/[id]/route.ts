import { PrismaClient } from "@prisma/client";

// 更新用API
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  type ReqData = {
    completed: boolean;
  };

  // 対象のIDを取得
  const { id } = await params;
  //prismaのインスタンス生成
  const prisma = new PrismaClient();
  // リクエストの取得
  const data: ReqData = await req.json();

  // DBのデータ更新
  const updateList = await prisma.lists.update({
    where: {
      id: Number(id),
    },
    data: {
      completed: !data.completed,
    },
  });

  return Response.json({
    status: 200,
    res: updateList,
  });
}

// 削除用API
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 対象のIDを取得
  const { id } = await params;

  //prismaのインスタンス生成
  const prisma = new PrismaClient();

  // 削除の実行
  const deleteList = await prisma.lists.delete({
    where: {
      id: Number(id),
    },
  });

  return Response.json({
    status: 200,
    res: deleteList,
  });
}
