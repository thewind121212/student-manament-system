import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type Props = {
  type: 'admin' | 'teacher' | 'student' | 'parent';
  className?: string;
};

export default async function UserCard({ type }: Props) {

  const modelMap : Record<typeof type, any> = {
    admin: prisma.admin.count(), 
    teacher: prisma.teacher.count(),
    student: prisma.student.count(),
    parent: prisma.parent.count()
  }

  const count = await modelMap[type];


  return (
    <div className="odd:bg-wliafdewaPurple even:bg-wliafdewaYellow min-w-[130px] flex-1 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white px-2 py-1 text-[10px] text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="more-button" width={20} height={20} />
      </div>
      <h1 className="my-4 text-2xl font-semibold">{count}</h1>
      <h2 className="text-sm font-medium capitalize text-gray-500">{type}</h2>
    </div>
  );
}
