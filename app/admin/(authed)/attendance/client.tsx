"use client";

import { useState } from "react";
import { markAttendance, unmarkAttendance } from "@/app/actions/admin/attendance";

type Event = { id: string; name: string; date: string };
type Member = { user_id: string; full_name: string; member_number: number };
type Attendance = { member_id: string; event_id: string };

export default function AdminAttendanceClient({
  events,
  members,
  attendances,
}: {
  events: Event[];
  members: Member[];
  attendances: Attendance[];
}) {
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || "");
  const [localAttendances, setLocalAttendances] = useState(attendances);

  const isAttending = (memberId: string) =>
    localAttendances.some(
      (a) => a.member_id === memberId && a.event_id === selectedEvent
    );

  const handleToggle = async (memberId: string) => {
    const attending = isAttending(memberId);
    if (attending) {
      await unmarkAttendance(memberId, selectedEvent);
      setLocalAttendances((prev) =>
        prev.filter(
          (a) => !(a.member_id === memberId && a.event_id === selectedEvent)
        )
      );
    } else {
      await markAttendance(memberId, selectedEvent);
      setLocalAttendances((prev) => [
        ...prev,
        { member_id: memberId, event_id: selectedEvent },
      ]);
    }
  };

  return (
    <>
      {/* Event selector */}
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="bg-bg border border-border-2 py-2 px-4 font-mono text-[12px] text-ink mb-8 focus:border-red focus:outline-none"
      >
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.name}{" // "}{new Date(ev.date).toLocaleDateString()}
          </option>
        ))}
      </select>

      {/* Members checklist */}
      <div className="flex flex-col gap-2">
        {members.map((m) => (
          <label
            key={m.user_id}
            className="flex items-center gap-3 py-2 border-b border-border/50 cursor-pointer hover:bg-asphalt/30"
          >
            <input
              type="checkbox"
              checked={isAttending(m.user_id)}
              onChange={() => handleToggle(m.user_id)}
              className="accent-red"
            />
            <span className="font-mono text-[11px] text-ink-faint w-8">
              #{m.member_number}
            </span>
            <span className="font-mono text-[11px] text-ink">
              {m.full_name}
            </span>
          </label>
        ))}
      </div>

      {members.length === 0 && (
        <p className="font-mono text-[11px] text-ink-faint mt-8">
          no members yet.
        </p>
      )}
    </>
  );
}
