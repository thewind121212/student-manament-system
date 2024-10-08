import { TableColPropsType } from "@/lib/types";
import React from "react";

type Props = {
  col: TableColPropsType[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
};

export default function Table({ col, renderRow, data }: Props) {
  return (
    <table className="mt-4 w-full">
      <thead>
        <tr className="text-left text-sm text-gray-500">
          {col.map((c) => (
            <th key={c.accessor} className={c.className}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {data.map((item) => {
          return renderRow(item);
        })}
      </tbody>
    </table>
  );
}
