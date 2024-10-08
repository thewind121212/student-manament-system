import React from "react";
import UserCard from "@/components/UserCard";
import CountChart from "@/components/CountChart";
import AttendanceChart from "@/components/AttendanceChart";
import FinanceChart from "@/components/FinanceChart";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import Announcements from "@/components/Announcements";
import { prisma } from "@/lib/prisma";

export default async function Admin({searchParams}: {searchParams: Record<string, string>}) {

  const dataSex = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  })

  const boys = dataSex.find(d => d.sex === 'MALE')?._count || 0
  const girls = dataSex.find(d => d.sex === 'FEMALE')?._count || 0



  const today =  new Date()
  const dayOfWeek = today.getDay()

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        {/* USER CARD */}
        <div className="flex flex-wrap justify-between gap-4">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="parent" />
        </div>
        {/* MIDDLE CHART   */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* COUNT CHART */}
          <div className="h-[450px] w-full lg:w-1/3">
            <CountChart boys={boys} girls={girls}  />
          </div>
          {/* ATTENDENCE CHART */}
          <div className="h-[450px] w-full lg:w-2/3">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART*/}
        <div className="w-full h-[500px]">
          <FinanceChart/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
      <EventCalendarContainer searchParams={searchParams}/>
      <Announcements/>
      </div>
    </div>
  );
}
