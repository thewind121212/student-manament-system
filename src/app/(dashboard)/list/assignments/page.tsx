import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { TableColPropsType } from "@/lib/types";
import Table from "@/components/Table";
import FormContainer from "@/components/FormContainer";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import { isValidNumber } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";

type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

export default async function AssignmentList({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { page, ...queryParams } = searchParams;

  const p = isValidNumber(page) ? Number(page) : 1;

  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.userId;

  const columns: TableColPropsType[] = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 p-4 text-sm even:bg-slate-50 hover:bg-wliafdewaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h1 className="font-semibold">{item.lesson.subject.name}</h1>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("vi-VN").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "teacher" && (
              <>
                <FormContainer table="assignment" type="update" data={item} />
                <FormContainer table="assignment" type="delete" id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION

  const query: Prisma.AssignmentWhereInput = {};

  query.lesson = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
            query.lesson.subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
  }

  const [assignmentQuery, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({ where: query }),
  ]);
  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">
          All Assignment
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
            {role === "admin" ||
              (role === "teacher" && (
                <FormContainer table="assignment" type="create" />
              ))}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table col={columns} renderRow={renderRow} data={assignmentQuery} />
      {/* PAGAINGION */}
      <Pagination page={p} count={count} />
    </div>
  );
}
