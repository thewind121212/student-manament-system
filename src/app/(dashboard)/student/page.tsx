import Announcements from "@/components/Announcements";
import EventCalender from "@/components/EventCalender";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import React from "react";

import { auth } from "@clerk/nextjs/server";

export default function StudentPage() {
  const { sessionClaims } = auth();
  const currentUserId = sessionClaims?.userId;
  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT */}
      <div className="h-screen w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-4">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalenderContainer type="classId" id={currentUserId! as string} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 xl:w-1/3">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
}
