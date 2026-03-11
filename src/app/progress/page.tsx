"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Brain, CheckCircle2, Clock, Loader2, Target } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

interface ProgressStats {
  total_notes: number;
  resolved_notes: number;
  pending_notes: number;
  resolution_rate: number;
  total_reviews: number;
  average_reviews_per_note: number;
  reviewed_today: number;
  error_breakdown: Record<string, number>;
  last_7_days: Array<{
    date: string;
    created: number;
    reviewed: number;
  }>;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/revision/progress`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const maxTrendValue = Math.max(
    1,
    ...(stats?.last_7_days.map((d) => Math.max(d.created, d.reviewed)) ?? [1]),
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="border-b border-[#2a2a3a] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-[#1a1a24] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#94a3b8]" />
          </Link>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-semibold text-white">Track Progress</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#46B1BD] animate-spin" />
          </div>
        ) : !stats ? (
          <div className="text-center py-20">
            <p className="text-[#94a3b8]">Could not load progress stats.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-[#64748b] uppercase mb-1">Total Notes</p>
                <p className="text-2xl text-white font-semibold">{stats.total_notes}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-[#64748b] uppercase mb-1">Resolved</p>
                <p className="text-2xl text-emerald-400 font-semibold">{stats.resolved_notes}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-[#64748b] uppercase mb-1">Pending</p>
                <p className="text-2xl text-amber-400 font-semibold">{stats.pending_notes}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-[#64748b] uppercase mb-1">Reviewed Today</p>
                <p className="text-2xl text-[#46B1BD] font-semibold">{stats.reviewed_today}</p>
              </div>
            </div>

            <div className="glass rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-white font-semibold">Resolution Rate</h2>
                </div>
                <span className="text-emerald-400 font-semibold">{stats.resolution_rate}%</span>
              </div>
              <div className="w-full h-3 bg-[#1a1a24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#46B1BD]"
                  style={{ width: `${Math.min(100, stats.resolution_rate)}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <Clock className="w-4 h-4" />
                  Total reviews: <span className="text-white">{stats.total_reviews}</span>
                </div>
                <div className="flex items-center gap-2 text-[#94a3b8]">
                  <CheckCircle2 className="w-4 h-4" />
                  Avg reviews/note: <span className="text-white">{stats.average_reviews_per_note}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-[#46B1BD]" />
                  <h2 className="text-white font-semibold">Error Type Breakdown</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.error_breakdown).map(([type, count]) => {
                    const percent = stats.total_notes ? (count / stats.total_notes) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-[#94a3b8]">{type.replaceAll("_", " ")}</span>
                          <span className="text-white">{count}</span>
                        </div>
                        <div className="w-full h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                          <div className="h-full bg-[#46B1BD]" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass rounded-xl p-5">
                <h2 className="text-white font-semibold mb-4">Last 7 Days</h2>
                <div className="space-y-3">
                  {stats.last_7_days.map((day) => (
                    <div key={day.date} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#94a3b8]">{day.date}</span>
                        <span className="text-white">
                          {day.created} created, {day.reviewed} reviewed
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-2 bg-amber-400/80 rounded-full" style={{ width: `${(day.created / maxTrendValue) * 100}%` }} />
                        <div className="h-2 bg-[#46B1BD] rounded-full" style={{ width: `${(day.reviewed / maxTrendValue) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
