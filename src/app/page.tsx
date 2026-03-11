"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import { 
  Folder, 
  Brain,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Newspaper,
  ExternalLink
} from "lucide-react";

interface RevisionNote {
  id: string;
  content: string;
  error_type: string;
  created_at: string;
  review_count: string;
}

interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
  category: string;
  aiSummary?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [revisionNotes, setRevisionNotes] = useState<RevisionNote[]>([]);
  const [dailyAffairs, setDailyAffairs] = useState<NewsItem[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(true);
  const [loadingAffairs, setLoadingAffairs] = useState(true);

  const fetchRevisionNotes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/revision/pending`);
      if (res.ok) {
        const data = await res.json();
        setRevisionNotes(data.slice(0, 5));
      }
    } catch {
      console.log("Backend not connected - showing demo mode");
    } finally {
      setLoadingRevisions(false);
    }
  };

  const fetchDailyAffairs = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setDailyAffairs((data.news || []).slice(0, 4));
      }
    } catch {
      console.log("News feed unavailable");
    } finally {
      setLoadingAffairs(false);
    }
  };

  useEffect(() => {
    fetchRevisionNotes();
    fetchDailyAffairs();
  }, []);

  const getErrorIcon = (type: string) => {
    switch (type) {
      case "CONFUSION":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "MISTAKE":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "CONCEPT_MISUNDERSTANDING":
        return <Brain className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#46B1BD]" />;
    }
  };

  return (
    <div className="min-h-screen gradient-mesh">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#46B1BD] to-[#3a949c] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl text-white">UPSC Path</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setLoadingRevisions(true);
                setLoadingAffairs(true);
                fetchRevisionNotes();
                fetchDailyAffairs();
              }}
              className="p-2 hover:bg-[#1a1a24] rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-[#94a3b8]" />
            </button>
            <Link 
              href="/folders" 
              className="px-4 py-2 bg-[#46B1BD] hover:bg-[#5ec4ce] rounded-lg text-white transition-colors flex items-center gap-2 font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Start Learning
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              Your UPSC <span className="text-[#46B1BD]">Learning Partner</span>
            </h1>
<p className="text-[#94a3b8] text-lg max-w-2xl mx-auto mb-8">
              Smart notes, daily revision, and AI-powered learning assistance tailored for your exam preparation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => router.push("/folders")}
              className="glass rounded-2xl p-6 card-hover cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#46B1BD]/20 flex items-center justify-center mb-4">
                <Folder className="w-7 h-7 text-[#46B1BD]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">My Study Materials</h3>
              <p className="text-[#94a3b8]">
                Organize notes in folders. Create nested directories for different subjects and topics.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => router.push("/revision")}
              className="glass rounded-2xl p-6 card-hover cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Daily Revision</h3>
              <p className="text-[#94a3b8]">
                Review confusion points and mistakes identified during your study sessions.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push("/progress")}
              className="glass rounded-2xl p-6 card-hover cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-[#94a3b8]">
                See your revision count and track how well you understand each concept.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#46B1BD]" />
                <h2 className="text-2xl font-serif text-white">Pending Revisions</h2>
                {revisionNotes.length > 0 && (
                  <span className="px-3 py-1 bg-[#46B1BD]/20 text-[#46B1BD] rounded-full text-sm font-medium">
                    {revisionNotes.length} items
                  </span>
                )}
              </div>
              <Link 
                href="/revision" 
                className="text-[#46B1BD] hover:text-[#5ec4ce] transition-colors flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingRevisions ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-[#1a1a24] rounded w-1/4 mb-3"></div>
                    <div className="h-4 bg-[#1a1a24] rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : revisionNotes.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">All caught up!</h3>
                <p className="text-[#64748b]">
                  No pending revisions. Start studying to add confusion points.
                </p>
                <Link 
                  href="/folders" 
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#46B1BD] hover:bg-[#5ec4ce] rounded-lg text-white transition-colors"
                >
                  Start Learning <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {revisionNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass rounded-xl p-4 flex items-start gap-4 card-hover"
                  >
                    <div className="mt-1">
                      {getErrorIcon(note.error_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[#46B1BD] uppercase">
                          {note.error_type?.replace("_", " ")}
                        </span>
                        <span className="text-xs text-[#64748b]">
                          • Reviewed {note.review_count} times
                        </span>
                      </div>
                      <p className="text-white">{note.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-[#46B1BD]" />
                <h2 className="text-2xl font-serif text-white">Daily Editorials & Current Affairs</h2>
              </div>
              <button
                onClick={() => {
                  setLoadingAffairs(true);
                  fetchDailyAffairs();
                }}
                className="text-[#46B1BD] hover:text-[#5ec4ce] transition-colors flex items-center gap-1"
              >
                Refresh feed <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loadingAffairs ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-[#1a1a24] rounded w-2/3 mb-3"></div>
                    <div className="h-3 bg-[#1a1a24] rounded w-1/3 mb-4"></div>
                    <div className="h-3 bg-[#1a1a24] rounded w-full mb-2"></div>
                    <div className="h-3 bg-[#1a1a24] rounded w-4/5"></div>
                  </div>
                ))}
              </div>
            ) : dailyAffairs.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <Newspaper className="w-12 h-12 text-[#2a2a3a] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No daily affairs available</h3>
                <p className="text-[#64748b]">Try refreshing the feed.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {dailyAffairs.map((item, index) => (
                  <motion.a
                    key={`${item.title}-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="glass rounded-xl p-5 card-hover block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#46B1BD] uppercase">
                        {item.category}
                      </span>
                      <ExternalLink className="w-4 h-4 text-[#64748b]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{item.title}</h3>
                    <p className="text-[#64748b] text-xs mb-3">
                      {item.source} • {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p className="text-[#94a3b8] text-sm line-clamp-3">
                      {item.aiSummary || item.summary}
                    </p>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </main>

      <footer className="border-t border-[#2a2a3a] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[#64748b]">
          <p>UPSC Learning Path</p>
        </div>
      </footer>
    </div>
  );
}
