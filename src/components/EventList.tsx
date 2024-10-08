import React from "react";

type Props = {
  data: any;
};

export default function EventList({ data }: Props) {




  return data.map((event : any) => (
    <div
      className="odd:border-t-wliafdewaSky even:border-t-wliafdewaPurple rounded-md border-2 border-t-4 border-gray-100 p-5"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-xs text-gray-300">
          {event.startTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-400">{event.description}</p>
    </div>
  ));
}
