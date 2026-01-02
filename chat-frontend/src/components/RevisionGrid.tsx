export type TopicCard = { topic: string; confidence: number };

export default function RevisionGrid({
  topics,
  onSelect,
}: {
  topics: TopicCard[];
  onSelect: (topic: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {topics.map((t) => (
        <button
          key={t.topic}
          onClick={() => onSelect(t.topic)}
          className="rounded-2xl border border-zinc-300/10 bg-zinc-100/5 p-4 text-left hover:bg-zinc-100/10 transition"
        >
          <div className="text-sm font-medium">{t.topic}</div>
          <div className="mt-2 h-2 rounded bg-zinc-800">
            <div className="h-2 rounded bg-emerald-400" style={{ width: `${t.confidence * 100}%` }} />
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            Confidence {(t.confidence * 100).toFixed(0)}%
          </div>
        </button>
      ))}
    </div>
  );
}
