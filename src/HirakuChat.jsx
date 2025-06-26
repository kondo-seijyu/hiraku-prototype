import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function HirakuChat() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const index = queryParams.get("index");

  const [messages, setMessages] = useState(() => {
    const resumed = localStorage.getItem("resumed_log_messages");
    if (resumed) {
      localStorage.removeItem("resumed_log_messages");
      return JSON.parse(resumed);
    }
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            from: "ai",
            text: "こんにちは。どんなことに取り組んでいますか？",
            timestamp: Date.now(),
          },
        ];
  });

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seen_hiraku_tutorial");
    if (!seen) {
      setShowTutorial(true);
    }

    // 再開時に index がある場合、そのログ情報を読み込む
    if (index !== null) {
      const logs = JSON.parse(localStorage.getItem("hiraku_chat_logs") || "[]");
      const currentLog = logs[parseInt(index, 10)];
      if (currentLog) {
        setTitle(currentLog.title || "");
        setTags(currentLog.tags ? currentLog.tags.join(",") : "");
      }
    }
  }, [index]);

  const handleCloseTutorial = () => {
    localStorage.setItem("seen_hiraku_tutorial", "true");
    setShowTutorial(false);
  };

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      from: "user",
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: "それは面白そうですね。もう少し詳しく聞かせてください。",
          timestamp: Date.now(),
        },
      ]);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: "具体的には、どのような課題や目標を持っていますか？",
            timestamp: Date.now(),
          },
        ]);
      }, 1000);
    }, 1000);
  };

  const [input, setInput] = useState("");

  const handleSave = () => {
    if (!title.trim()) return alert("タイトルを入力してください");
    const savedLogs = JSON.parse(localStorage.getItem("hiraku_chat_logs") || "[]");
    const newLog = { title, tags: tags.split(",").map(t => t.trim()), messages, timestamp: Date.now() };
    localStorage.setItem("hiraku_chat_logs", JSON.stringify([...savedLogs, newLog]));
    alert("会話を保存しました");
    setTitle("");
    setTags("");
  };

  const handleOverwrite = () => {
    if (index === null) return alert("再開中のログが検出されませんでした。");
    const logs = JSON.parse(localStorage.getItem("hiraku_chat_logs") || "[]");
    const updatedLog = {
      title,
      tags: tags.split(",").map(t => t.trim()),
      messages,
      timestamp: Date.now(),
    };
    logs[parseInt(index, 10)] = updatedLog;
    localStorage.setItem("hiraku_chat_logs", JSON.stringify(logs));
    alert("上書き保存しました");
  };

  const clearLog = () => {
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("hiraku_chat_log");
    setMessages([
      {
        from: "ai",
        text: "こんにちは。どんなことに取り組んでいますか？",
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">ようこそ、Hirakuへ</h2>
            <p className="text-sm text-gray-700 mb-4">
              このツールでは、Chat形式で思考を深めながら、あとで振り返れるように保存ができます。
              <br />・Shift+Enterで送信<br />・会話にメモやタグを付けて分類できます
            </p>
            <button
              onClick={handleCloseTutorial}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              はじめる
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg w-full max-w-2xl h-[400px] overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === "ai"
                ? "bg-gray-200 text-gray-800"
                : "bg-blue-500 text-white"
              }`}
            >
              <div>{msg.text}</div>
              {msg.timestamp && (
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 w-full max-w-2xl flex flex-col items-center space-y-2">
        <div className="w-full text-sm text-gray-500 text-right pr-1">
          Shift + Enter で送信
        </div>
        <div className="flex w-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 border rounded-l px-4 py-2"
            placeholder="メッセージを入力…"
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 rounded-r"
          >
            送信
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col space-y-2 items-center w-full max-w-2xl">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="保存するタイトルを入力"
          className="border px-4 py-2 rounded w-full"
        />

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="タグをカンマ区切りで入力（例：アイデア,振り返り）"
          className="border px-4 py-2 rounded w-full"
        />

        <button
          onClick={handleSave}
          className="bg-gray-200 text-black px-4 py-2 rounded w-full"
        >
          この会話を保存する（タイトル付き）
        </button>

        {Number.isInteger(Number(index)) && (
          <button
            onClick={handleOverwrite}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            このログに上書き保存
          </button>
        )}

        <Link to="/HirakuLogs" className="w-full">
          <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded w-full">
            保存されたログを見る
          </button>
        </Link>

        <button
          onClick={clearLog}
          className="bg-red-100 text-red-800 px-4 py-2 rounded w-full"
        >
          ログを削除
        </button>
      </div>
    </div>
  );
}
