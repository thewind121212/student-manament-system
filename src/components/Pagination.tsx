"use client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

type Props = {
  page: number;
  count: number;
};

export default function Pagination({ page, count }: Props) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const buildPaginationLink = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    return pathName + "?" + params.toString();
  };

  return (
    <div className="flex items-center justify-between p-4 text-gray-500">
      <Link
        href={buildPaginationLink(page - 1)}
        className={`${page === 1 ? "pointer-events-none" : ""}`}
        aria-disabled={page === 1}
        tabIndex={page === 1 ? -1 : undefined}
      >
        <button
          disabled={page === 1}
          className={`rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold disabled:opacity-50 ${page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          Prev
        </button>
      </Link>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, i) => {
          const pageIndex = i + 1;
          return (
            <Link
              href={buildPaginationLink(pageIndex)}
              key={pageIndex + "pagination"}
            >
              <button
                className={`rounded-sm px-2 ${page === pageIndex ? "bg-wliafdewaSky" : ""}`}
              >
                {pageIndex}
              </button>
            </Link>
          );
        })}
      </div>
      <Link
        href={buildPaginationLink(page + 1)}
        className={`${page === Math.ceil(count / ITEM_PER_PAGE) ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <button
          disabled={page === Math.ceil(count / ITEM_PER_PAGE)}
          className="rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </Link>
    </div>
  );
}
