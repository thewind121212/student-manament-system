import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function NavBar() {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="bg hidden items-center gap-2 rounded-full px-2 text-xs ring-[1.5px] ring-gray-300 md:flex">
        <Image src="/search.png" alt="search" width={14} height={14} />
        <input
          type="text"
          placeholder="seach..."
          className="w-[200px] bg-transparent p-2 outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex w-full items-center justify-end gap-6">
        <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white">
          <Image src="/message.png" alt="message" width={20} height={20} />
        </div>
        <div className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white">
          <div className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
            1
          </div>
          <Image
            src="/announcement.png"
            alt="announcement"
            width={20}
            height={20}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium leading-3">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-right text-[10px] text-gray-500">{role}</span>
        </div>
        {/* <Image
          src="/avatar.png"
          alt="avatar"
          height={36}
          width={36}
          className="rounded-full"
        /> */}
        <UserButton />
      </div>
    </div>
  );
}
