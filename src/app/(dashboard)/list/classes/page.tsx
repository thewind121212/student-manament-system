import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { TableColPropsType } from "@/lib/types";
import Table from "@/components/Table";
import { Class, Prisma, Teacher } from "@prisma/client";
import { isValidNumber } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";

import { auth } from "@clerk/nextjs/server";

type ClassList = Class & { supervisor: Teacher };

export default async function ClassesList({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { page, ...queryParams } = searchParams;

  const p = isValidNumber(page) ? Number(page) : 1;

  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns: TableColPropsType[] = [
    {
      header: "Class Name",
      accessor: "name",
    },
    {
      header: "Capacity",
      accessor: "capacity",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Supervisor",
      accessor: "supervisor",
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

  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 p-4 text-sm even:bg-slate-50 hover:bg-wliafdewaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h1 className="font-semibold">{item.name}</h1>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.name[0]}</td>
      <td className="hidden md:table-cell">{item.supervisor.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="class" type="update" data={item} />
              <FormContainer table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION

  const [classesQuery, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Classes</h1>
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
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table col={columns} renderRow={renderRow} data={classesQuery} />
      {/* PAGAINGION */}
      <Pagination page={p} count={count} />
    </div>
  );
}
