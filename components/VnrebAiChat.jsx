"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, LoaderCircle, Sparkles, X } from "lucide-react";

const quickPrompts = [
  "Tìm bất động sản phù hợp ngân sách 3–5 tỷ",
  "So sánh mua để ở và mua đầu tư",
  "Cho tôi checklist kiểm tra pháp lý",
  "Giải thích cách kiểm tra quy hoạch"
];

export default function VnrebAiChat({ onSearchSuggestion }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào, tôi là Trợ lý VNREB AI. Tôi có thể tìm sản phẩm theo ngân sách, so sánh phương án đầu tư, giải thích dữ liệu dự án và chuẩn bị checklist pháp lý. Các kết luận quy hoạch, giá và pháp lý quan trọng vẫn cần chuyên viên VNREB xác minh."
    }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text = input) {
    const content = String(text || "").trim();
    if (!content || busy) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10),
          context: {
            page: "customer-home",
            availableProjects: [
              "VNREB Riverside - Quận 12 - từ 3,2 tỷ",
              "Eco City Garden - Thuận An - từ 4,8 tỷ",
              "The Urban River - TP. Thủ Đức - từ 5,6 tỷ",
              "An Phú Residence - Dĩ An - từ 2,4 tỷ"
            ]
          }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể kết nối trợ lý AI");
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Xin lỗi, trợ lý đang tạm gián đoạn. ${error.message || "Vui lòng thử lại."}`
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  function runQuick(prompt) {
    if (prompt.includes("3–5 tỷ")) onSearchSuggestion?.("3–5 tỷ");
    send(prompt);
  }

  return (
    <>
      <button className="aiFab" onClick={() => setOpen((v) => !v)} aria-label="Mở trợ lý VNREB AI">
        <Bot />
      </button>
      {open && (
        <section className="aiBox aiBoxLive" aria-label="Trợ lý VNREB AI">
          <div className="aiHead">
            <span><Sparkles /> Trợ lý VNREB AI <i>Online</i></span>
            <button onClick={() => setOpen(false)} aria-label="Đóng"><X /></button>
          </div>
          <div className="aiMessages" ref={scrollRef}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`aiMessage ${message.role}`}>
                <b>{message.role === "assistant" ? "VNREB AI" : "Anh/Chị"}</b>
                <p>{message.content}</p>
              </div>
            ))}
            {busy && <div className="aiMessage assistant loading"><LoaderCircle /> Đang phân tích...</div>}
          </div>
          <div className="aiQuickPrompts">
            {quickPrompts.map((prompt) => <button key={prompt} onClick={() => runQuick(prompt)}>{prompt}</button>)}
          </div>
          <form className="aiInput" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={1500} placeholder="Hỏi về dự án, đầu tư, pháp lý..." />
            <button disabled={busy || !input.trim()} aria-label="Gửi câu hỏi"><ArrowRight /></button>
          </form>
          <small className="aiLegalNote">AI cung cấp thông tin tham khảo; không thay thế xác nhận pháp lý, quy hoạch hoặc quyết định đầu tư.</small>
        </section>
      )}
    </>
  );
}
