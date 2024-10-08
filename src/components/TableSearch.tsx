'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TableSearch = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchValue = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    params.set("search", searchValue);
    params.delete("page");
    router.push(window.location.pathname + "?" + params.toString());
  }



  return (
    <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;