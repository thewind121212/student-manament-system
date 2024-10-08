import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { TableColPropsType } from "@/lib/types";
import Table from "@/components/Table";
import { isValidNumber } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { Parent, Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";

type ParentList = Parent & { students: string[] };

export default async function ParentsList({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { page, ...queryParams } = searchParams;

  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns: TableColPropsType[] = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student Names",
      accessor: "students",
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
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const p = isValidNumber(page) ? Number(page) : 1;

  // URL PARAMS CONDITION

  const renderRow = (item: ParentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 p-4 text-sm even:bg-slate-50 hover:bg-wliafdewaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h1 className="font-semibold">{item.name}</h1>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.students.join(", ")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const query: Prisma.ParentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [parentQuery, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.parent.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden text-lg font-semibold md:block">All Parents</h1>
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
            {role === "admin" && <FormContainer table="parent" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table col={columns} renderRow={renderRow} data={parentQuery} />
      {/* PAGAINGION */}
      <Pagination page={p} count={count} />
    </div>
  );
}
