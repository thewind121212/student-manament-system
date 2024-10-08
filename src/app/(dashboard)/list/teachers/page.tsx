import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { TableColPropsType, TeacherType } from "@/lib/types";
import Table from "@/components/Table";
import Link from "next/link";
import { isValidNumber } from "@/lib/helper";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

export default async function TeacherList({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { page, ...queryParams } = searchParams;

  const query: Prisma.TeacherWhereInput = {};

  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns: TableColPropsType[] = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Teacher ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) return;

      switch (key) {
        case "classId":
          query.lessons = {
            some: {
              classId: isValidNumber(value) ? Number(value) : undefined,
            },
          };
          break;
        case "search":
          query.name = {
            contains: value,
            mode: "insensitive",
          };
      }
    }
  }

  const p = isValidNumber(page) ? Number(page) : 1;

  const [teacherQuery, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 p-4 text-sm even:bg-slate-50 hover:bg-wliafdewaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/noAvatar.png"}
          alt={item.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover md:hidden xl:block"
        />
        <div className="flex flex-col">
          <h1 className="font-semibold">{item.name}</h1>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.subjects.map((subject) => subject.name).join(",")}
      </td>
      <td className="hidden md:table-cell">
        {item.classes.map((classItem) => classItem.name).join(",")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-wliafdewaSky">
              <Image src="/view.png" width={16} height={16} alt="viewButton" />
            </button>
          </Link>
          {role === "admin" && (
            <FormContainer table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Teachers</h1>
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
              <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table col={columns} renderRow={renderRow} data={teacherQuery} />
      {/* PAGAINGION */}
      <Pagination page={p} count={count} />
    </div>
  );
}
