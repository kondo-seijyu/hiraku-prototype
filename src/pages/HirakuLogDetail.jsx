import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function HirakuLogDetail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const index = parseInt(params.get("index"), 10);

  const logs = JSON.parse(localStorage.getItem("hiraku_chat_logs") || "[]");
  const log = logs[index];

  if (!log) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p>ログが見つかりません。</p>
        <Link to="/HirakuLogs" className="text-blue-500 underline">← 一覧に戻る</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Link to="/HirakuLogs" className="text-blue-500 underline">← 一覧に戻る</Link>
      <h2 className="text-2xl font-bold">{log.title}</h2>
      <div className="space-y-2">
        {log.messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.from === "user" ? "text-right text-blue-800" : "text-left text-gray-800"}`}>
            <div>{msg.text}</div>
            <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}