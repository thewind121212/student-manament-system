"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  boys: number;
  girls: number;
};

function CountChart({ boys, girls }: Props) {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "white",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: boys,
      fill: "#C3EBFA",
    },
  ];

  return (
    <div className="h-full w-full rounded-xl bg-white p-4">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="line-chart" width={20} height={20} />
      </div>
      {/* CHARTS */}
      <div className="relative h-[75%] w-full">
        <Image
          src="/maleFemale.png"
          alt="countchartLedgen"
          width={50}
          height={50}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar
              label={{ position: "insideStart", fill: "#fff" }}
              background
              dataKey="count"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="h-5 w-5 rounded-full bg-wliafdewaSky" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys {Math.round((boys / (boys + girls)) * 100)}%
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 w-5 rounded-full bg-wliafdewaYellow" />
          <h1 className="font-bold">
            {girls} 
          </h1>
          <h2 className="text-xs text-gray-300">Girls {Math.round((girls / (boys + girls)) * 100)}%</h2>
        </div>
      </div>
    </div>
  );
}

export default CountChart;
