import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { TableColPropsType } from "@/lib/types";
import Table from "@/components/Table";
import FormContainer from "@/components/FormContainer";
import { Announcement, Class, Prisma } from "@prisma/client";
import { isValidNumber } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

import { auth } from "@clerk/nextjs/server";

type AnnouncementList = Announcement & { class: Class };

export default async function AnnouncementList({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.userId;
  const { page, ...queryParams } = searchParams;

  const p = isValidNumber(page) ? Number(page) : 1;
  const columns: TableColPropsType[] = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 p-4 text-sm even:bg-slate-50 hover:bg-wliafdewaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h1 className="font-semibold">{item.title}</h1>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("vi-VN").format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const [announcementQuery, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          All Announcements
        </h1>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-wliafdewaYellow">
              <Image
                src="/filter.png"
                alt="filter-button"
                width={14}
                height={14}
              />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-wliafdewaYellow">
              <Image
                src="/sort.png"
                alt="filter-button"
                width={14}
                height={14}
              />
            </button>
            {role === "admin" && (
              <FormContainer table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table col={columns} renderRow={renderRow} data={announcementQuery} />
      {/* PAGAINGION */}
      <Pagination page={p} count={count} />
    </div>
  );
}
