import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function HirakuLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const showOnlyMemos = new URLSearchParams(location.search).get("view") === "memos";

  useEffect(() => {
    const stored = localStorage.getItem("hiraku_chat_logs");
    if (stored) {
      const parsedLogs = JSON.parse(stored);
      setLogs(parsedLogs);
      setFilteredLogs(parsedLogs);
    }
  }, []);

  const handleSearch = (term = searchTerm) => {
    if (!term.trim()) {
      setFilteredLogs(logs);
      return;
    }
    setFilteredLogs(
      logs.filter(
        (log) =>
          log.title?.toLowerCase().includes(term.toLowerCase()) ||
          log.tags?.some((tag) =>
            tag.toLowerCase().includes(term.toLowerCase())
          )
      )
    );
  };

  const handleDelete = (indexToDelete) => {
    const updatedLogs = logs.filter((_, index) => index !== indexToDelete);
    setLogs(updatedLogs);
    setFilteredLogs(updatedLogs);
    localStorage.setItem("hiraku_chat_logs", JSON.stringify(updatedLogs));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {showOnlyMemos ? "メモ一覧表示" : "保存されたログ一覧"}
      </h2>

      {!showOnlyMemos && (
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              const term = e.target.value;
              setSearchTerm(term);
              handleSearch(term);
            }}
            placeholder="タイトルやタグで検索"
            className="border px-4 py-2 rounded flex-1"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            検索
          </button>
        </div>
      )}

      <div className="space-y-4">
        {filteredLogs.length === 0 && <p className="text-gray-500">保存されたログはありません。</p>}

        {filteredLogs.map((log, index) => {
          if (showOnlyMemos) {
            const memoMessages = log.messages.filter((msg) => msg.note && msg.note.trim());
            if (memoMessages.length === 0) return null;
            return (
              <div key={index} className="border p-4 rounded shadow-sm bg-white">
                <div className="font-semibold text-lg mb-1">{log.title || "無題のログ"}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <ul className="list-disc ml-6 space-y-2">
                  {memoMessages.map((msg, idx) => (
                    <li key={idx}>
                      <div className="text-sm font-medium">💬 {msg.text}</div>
                      <div className="text-sm text-blue-800">📝 {msg.note}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          } else {
            return (
              <div key={index} className="border p-4 rounded shadow-sm bg-white">
                <div className="font-semibold text-lg">{log.title || "無題のログ"}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {log.tags && log.tags.length > 0 && (
                    <span>タグ: {log.tags.join(", ")}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to={`/HirakuOutput?index=${index}`}
                    className="text-blue-500 underline text-sm"
                  >
                    詳細を見る
                  </Link>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="mt-6">
        <Link to="/HirakuLogs" className="text-blue-500 underline mr-4">
          全ログを見る
        </Link>
        <Link to="/HirakuLogs?view=memos" className="text-blue-500 underline">
          メモ一覧を見る
        </Link>
      </div>

      <Link to="/" className="block mt-6 text-blue-500 underline">
        ← トップに戻る
      </Link>
    </div>
  );
}
