import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviseTopicDetail, getReviseTopics } from "../api/client";
import RevisionGrid, { type TopicCard } from "../components/RevisionGrid";

export default function RevisePage() {
  const nav = useNavigate();
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getReviseTopics();
      setTopics(res.topics);
    })();
  }, []);

  const selectTopic = async (topic: string) => {
    setSelected(topic);
    setLoading(true);
    try {
      const d = await getReviseTopicDetail(topic);
      setDetail(d);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto w-full px-4 py-6 md:w-3/5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Revise</h1>
          <button
            onClick={() => nav("/")}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs hover:bg-zinc-900"
          >
            Back to chat
          </button>
        </div>

        <p className="mt-2 text-sm text-zinc-400">
          Topics you’ve asked before (personalized, with confidence).
        </p>

        <div className="mt-5">
          {topics.length === 0 ? (
            <div className="text-sm text-zinc-400">
              No topics yet. Ask something in chat first.
            </div>
          ) : (
            <RevisionGrid topics={topics} onSelect={selectTopic} />
          )}
        </div>

        {/* Detail panel */}
        <div className="mt-6">
          {!selected ? (
            <div className="text-sm text-zinc-500">Select a topic to view your personalized revision notes.</div>
          ) : loading ? (
            <div className="text-sm text-zinc-400">Loading…</div>
          ) : detail ? (
            <div className="rounded-2xl border border-zinc-300/10 bg-zinc-100/5 p-4">
              <div className="text-sm font-medium">{detail.topic}</div>

              <div className="mt-4">
                <div className="text-xs text-zinc-400">Your recurring mistakes</div>
                {detail.mistakes?.length ? (
                  <ul className="mt-2 space-y-1 text-sm">
                    {detail.mistakes.map((m: any, i: number) => (
                      <li key={i} className="text-zinc-200">
                        • {m.mistake} <span className="text-zinc-500">(x{m.frequency})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 text-sm text-zinc-500">No mistake memory yet for this topic.</div>
                )}
              </div>

              <div className="mt-6">
                <div className="text-xs text-zinc-400">Recent explanations</div>
                <div className="mt-2 space-y-3">
                  {detail.recents?.map((r: any) => (
                    <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                      <div className="text-xs text-zinc-500">{r.created_at}</div>
                      <div className="mt-2 text-sm text-zinc-200">
                        <span className="text-zinc-400">Q:</span> {r.user_input}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-100">
                        {r.response}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
