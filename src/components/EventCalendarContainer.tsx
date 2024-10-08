import React from "react";
import Image from "next/image";
import Calendar from "react-calendar";
import EventList from "./EventList";
import EventCalender from "./EventCalender";
import { prisma } from "@/lib/prisma";

export default async function EventCalendarContainer({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { date } = searchParams;

  const [day, month, year] = date ? date.split("/") : [];

  const dateQuery = date
    ? new Date(Number(year), Number(month) - 1, Number(day))
    : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(dateQuery.setHours(0, 0, 0, 0)),
        lte: new Date(dateQuery.setHours(23, 59, 59, 999)),
      },
    },
  });

  return (
    <div className="rounded-md bg-white p-4">
      <EventCalender />
      <div className="flex items-center justify-between">
        <h1 className="my-4 text-xl font-semibold">Events</h1>
        <Image src="/moreDark.png" alt="line-chart" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList data={data} />
      </div>
    </div>
  );
}
