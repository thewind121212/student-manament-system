import { prisma } from "@/lib/prisma";
import React from "react";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/helper";

type Props = {
  type: "teacherId" | "classId";
  id: string | number;
};

export default async function BigCalenderContainer({ type, id }: Props) {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = dataRes.map((item) => {
    return {
      title: item.name,
      start: item.startTime,
      end: item.endTime,
    };
  });

  const shedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="w-full h-screen">
      <BigCalendar data={shedule} />
    </div>
  );
}
