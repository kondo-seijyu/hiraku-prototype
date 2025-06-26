import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function HirakuOutput() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const index = queryParams.get("index");

  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState(null);
  const [showShareLink, setShowShareLink] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hiraku_chat_logs");
    if (stored) {
      const parsed = JSON.parse(stored);
      setLogs(parsed);
      if (index !== null) {
        setLog(parsed[parseInt(index, 10)]);
      }
    }
  }, [index]);

  const downloadJSON = () => {
    if (!log) return;
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(log));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${log.title || "log"}.json`);
    dlAnchorElem.click();
  };

  const downloadMarkdown = () => {
    if (!log) return;
    const md = log.messages
      .map(
        (msg) =>
          `### 💬 ${msg.from === "user" ? "ユーザー" : "AI"}：${msg.text}\n` +
          (msg.note ? `📝 メモ：${msg.note}\n` : "")
      )
      .join("\n");
    const blob = new Blob([`## ログ：${log.title || "無題"}\n\n${md}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${log.title || "log"}.md`;
    a.click();
  };

  const downloadMemosOnly = () => {
    if (!log) return;
    const memoParts = log.messages
      .filter((msg) => msg.note)
      .map(
        (msg) =>
          `### 💬 ${msg.from === "user" ? "ユーザー" : "AI"}：${msg.text}\n` +
          `📝 メモ：${msg.note}\n`
      )
      .join("\n");
    const blob = new Blob([
      `## メモのみ抜粋：${log.title || "無題"}（${new Date(
        log.timestamp
      ).toLocaleDateString()}）\n\n${memoParts}`,
    ], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `メモのみ_${log.title || "log"}.md`;
    a.click();
  };

  const handleDelete = () => {
    if (window.confirm("このログを削除しますか？")) {
      const updatedLogs = logs.filter((_, i) => i !== parseInt(index, 10));
      localStorage.setItem("hiraku_chat_logs", JSON.stringify(updatedLogs));
      window.location.href = "/HirakuLogs";
    }
  };

  const handleShareClick = () => {
    const dummyLink = `https://hiraku.app/shared/log-${index}`;
    navigator.clipboard.writeText(dummyLink);
    setShowShareLink(true);
    setTimeout(() => setShowShareLink(false), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/HirakuLogs" className="text-blue-500 underline">
        ← ログ一覧に戻る
      </Link>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={downloadJSON}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          ログをダウンロード（JSON）
        </button>

        <button
          onClick={downloadMarkdown}
          className="bg-yellow-400 text-black px-4 py-2 rounded"
        >
          ログをダウンロード（Markdown）
        </button>

        <button
          onClick={downloadMemosOnly}
          className="bg-yellow-300 text-black px-4 py-2 rounded"
        >
          メモのみダウンロード
        </button>

        <button
          onClick={handleShareClick}
          className="bg-purple-200 text-purple-800 px-4 py-2 rounded"
        >
          🔗 共有リンクを生成
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-200 text-red-800 px-4 py-2 rounded"
        >
          このログを削除
        </button>

        <button
          onClick={() => {
            localStorage.setItem("resumed_log_messages", JSON.stringify(log.messages));
            window.location.href = `/HirakuChat?index=${index}`;
          }}
          className="bg-blue-200 text-blue-800 px-4 py-2 rounded"
        >
          この会話から再開する
        </button>
      </div>

      {
        showShareLink && (
          <div className="mt-2 text-sm text-green-600">
            リンクをコピーしました：<br />
            <code className="bg-gray-100 px-2 py-1 inline-block rounded">
              https://hiraku.app/shared/log-{index}
            </code>
          </div>
        )
      }

      <h2 className="text-xl font-bold mt-6 mb-4">保存された会話ログ</h2>

      <div className="bg-gray-100 p-4 rounded-lg space-y-2">
        {log &&
          log.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs relative ${msg.from === "ai"
                  ? msg.note
                    ? "bg-yellow-100"
                    : "bg-white"
                  : msg.note
                    ? "bg-yellow-300 text-white"
                    : "bg-blue-500 text-white"
                  }`}
              >
                <div>{msg.text}</div>
                {msg.timestamp && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                )}
                {msg.note && (
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="inline-block text-xs text-gray-500">
                      💡 メモ:
                    </span>
                    <br />
                    {msg.note}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div >
  );
}
