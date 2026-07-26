"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Event = {
  id: number;
  title: string;
  event_date: string;
  start_time: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [message, setMessage] = useState("");

  const loadEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_date, start_time")
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      setMessage(`読み込みエラー：${error.message}`);
      return;
    }

    setEvents(data ?? []);
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const { error } = await supabase.from("events").insert({
      title,
      event_date: eventDate,
      start_time: startTime,
    });

    if (error) {
      setMessage(`登録エラー：${error.message}`);
      return;
    }

    setTitle("");
    setEventDate("");
    setStartTime("");
    setMessage("予定を登録しました。");
    await loadEvents();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        シンプル予定管理
      </h1>

      <form
        onSubmit={addEvent}
        className="mb-8 space-y-4 rounded-xl border p-5"
      >
        <div>
          <label className="mb-1 block">予定名</label>
          <input
            className="w-full rounded border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：定例会議"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">日付</label>
          <input
            type="date"
            className="w-full rounded border p-2"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block">開始時刻</label>
          <input
            type="time"
            className="w-full rounded border p-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          予定を登録
        </button>
      </form>

      {message && (
        <p className="mb-5 rounded bg-slate-100 p-3">
          {message}
        </p>
      )}

      <h2 className="mb-3 text-2xl font-semibold">予定一覧</h2>

      {events.length === 0 ? (
        <p>登録されている予定はありません。</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="rounded-xl border p-4">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-slate-600">
                {event.event_date}　{event.start_time.slice(0, 5)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}