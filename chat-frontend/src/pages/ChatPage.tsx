import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postChat } from "../api/client";

type Msg = { id: string; role: "user" | "assistant"; text: string };
const uid = () => crypto.randomUUID();

export default function ChatPage() {
  const nav = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([
    { id: uid(), role: "assistant", text: "Ask a DSA question. I’ll answer with intuition + mistakes + testcases." },
  ]);

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasHistory = messages.some((m) => m.role === "user");
  const isExpanded = isFocused && !isLoading;
  const textareaRows = useMemo(() => (isExpanded ? 4 : 1), [isExpanded]);

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    nav("/auth", { replace: true });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((p) => [...p, { id: uid(), role: "user", text }]);
    setInput("");
    setIsLoading(true);
    setIsFocused(false);

    try {
      const data = await postChat(text);
      setMessages((p) => [...p, { id: uid(), role: "assistant", text: data.reply }]);
    } catch {
      setMessages((p) => [...p, { id: uid(), role: "assistant", text: "Backend error. Is FastAPI running?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <div className="fixed left-4 top-4 z-20 flex gap-2">
        <button
          onClick={() => nav("/revise")}
          className="glass-card ripple-card border-white/10 bg-white/10 px-3 py-2 text-xs hover:border-white/30 transition"
        >
          Revise
        </button>
      </div>

      <div className="fixed right-4 top-4 z-20 flex gap-2">
        <button
          onClick={logout}
          className="glass-card ripple-card border-white/10 bg-white/10 px-3 py-2 text-xs hover:border-white/30 transition"
        >
          Logout
        </button>
      </div>

      {/* INPUT AREA */}
      <div className={hasHistory ? "sticky top-0 z-10" : "flex min-h-[55vh] items-center justify-center"}>
        <div className="w-full bg-gradient-to-b from-white/10 via-transparent to-transparent">
          <div className="mx-auto w-full px-4 py-5 md:w-3/5">
            <div className="glass-card ripple-card px-4 py-4">
              <div className="flex items-end gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={onKeyDown}
                  rows={textareaRows}
                  placeholder={isLoading ? "Generating..." : "Type a message..."}
                  disabled={isLoading}
                  className={[
                    "w-full resize-none rounded-xl bg-zinc-900/60 px-3 py-2",
                    "text-sm leading-6 outline-none placeholder:text-zinc-500 border border-white/10",
                    "focus:border-white/40 focus:bg-zinc-900/40 transition",
                    isLoading ? "opacity-60" : "",
                  ].join(" ")}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-semibold transition border",
                    isLoading || !input.trim()
                      ? "cursor-not-allowed border-white/10 bg-white/10 text-zinc-500"
                      : "border-white/20 bg-white text-zinc-900 hover:bg-white/90",
                  ].join(" ")}
                >
                  {isLoading ? "..." : "Send"}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1 text-xs text-zinc-400">
                <span>Enter to send • Shift+Enter for newline</span>
                <span className="text-emerald-300/80">
                  {isExpanded ? "Focused" : isLoading ? "Thinking..." : "Idle"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES (60% width => 20% margins each side on desktop) */}
      <div className="mx-auto w-full px-4 pb-12 md:w-3/5">
        <div className={hasHistory ? "pt-6 space-y-3" : "space-y-3"}>
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} />
          ))}
          {isLoading && <Bubble role="assistant" text="Thinking..." subtle />}
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, text, subtle }: { role: "user" | "assistant"; text: string; subtle?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={["flex", isUser ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 border ripple-card",
          isUser
            ? "bg-white text-zinc-900 border-white/70 shadow-md"
            : "glass-card border-white/10 text-zinc-50",
          subtle ? "opacity-70" : "opacity-100",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}
