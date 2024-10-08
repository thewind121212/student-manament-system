import Image from "next/image";
import React from "react";
import Link from "next/link";
import Performance from "@/components/Performance";
import FormContainer from "@/components/FormContainer";
import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Teacher } from "@prisma/client";

type Props = {
  params: { id: string };
};

export default async function TeacherDetailPage({ params: { id } }: Props) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* TEACHER INFO CARD */}
          <div className="flex flex-1 gap-4 rounded-md bg-wliafdewaSky p-4 py-6">
            <div className="aspect-square w-1/3">
              <Image
                src={teacher.img || "/noAvatar.png"}
                alt=""
                width={144}
                height={144}
                className="h-36 w-36 rounded-full object-cover"
              />
            </div>
            <div className="flex w-2/3 flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{teacher.name}</h1>
              {role === "admin" && (
                <FormContainer table="teacher" type="update" data={teacher} />
              )}
              <p className="text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image
                    src="/blood.png"
                    alt="bloodType"
                    width={14}
                    height={14}
                  />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/date.png" alt="date" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("vi-VN").format(teacher.birthday)}
                  </span>
                </div>
                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image src="/mail.png" alt="mail" width={14} height={14} />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                  <Image
                    src="/phone.png"
                    alt="phoneNumber"
                    width={14}
                    height={14}
                  />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARD  */}
          <div className="flex flex-1 flex-wrap justify-between gap-4">
            {/* CARD */}
            <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt="singleAttendance"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* END CARD */}
            {/* CARD */}
            <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt="singleAttendance"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* END CARD */}
            {/* CARD */}
            <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt="singleAttendance"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* END CARD */}
            {/* CARD */}
            <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt="singleAttendance"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
            {/* END CARD */}
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 h-[800px] rounded-md bg-white p-4">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalenderContainer type="teacherId" id={teacher.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex w-full flex-col gap-4 xl:w-1/3">
        <div className="rounded-md bg-white p-4">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <Link
              className="rounded-md bg-wliafdewaSky p-3"
              href={`/list/classes?supervisorId=${2}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className="rounded-md bg-wliafdewaPurpleLight p-3"
              href={`/list/students?teacherId=${2}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link className="rounded-md bg-wliafdewaYellowLight p-3" href="/">
              Teacher&apos;s Lessons
            </Link>
            <Link className="rounded-md bg-pink-50 p-3" href="/">
              Teacher&apos;s Exams
            </Link>
            <Link className="rounded-md bg-wliafdewaSkyLight p-3" href="/">
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}
