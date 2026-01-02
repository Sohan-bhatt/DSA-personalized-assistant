const API = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000"

export function getUserId() {
  return localStorage.getItem("user_id") || "demo_user"
}

async function jsonFetch<T>(url: string, init: RequestInit) {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function signup(email: string, password: string) {
  return jsonFetch<{ token: string; user_id: string }>(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
}

export async function login(email: string, password: string) {
  return jsonFetch<{ token: string; user_id: string }>(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
}

export async function postChat(message: string) {
  const res = await fetch(`${API}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: getUserId(), message }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<{ reply: string; topic: string; confidence: number }>
}

export async function getReviseTopics() {
  return jsonFetch<{ topics: { topic: string; confidence: number }[] }>(
    `${API}/revise/topics?user_id=${getUserId()}`,
    { method: "GET" }
  )
}

export async function getReviseTopicDetail(topic: string) {
  return jsonFetch<{
    topic: string
    recents: { id: number; created_at: string; user_input: string; response: string }[]
    mistakes: { mistake: string; frequency: number }[]
  }>(`${API}/revise/topic/${encodeURIComponent(topic)}?user_id=${getUserId()}`, { method: "GET" })
}
