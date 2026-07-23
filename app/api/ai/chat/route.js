import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;

function rateLimit(key) {
  const now = Date.now();
  const current = limiter.get(key);
  if (!current || current.resetAt < now) {
    limiter.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => ["user", "assistant"].includes(m?.role) && typeof m?.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 3000) }))
    .filter((m) => m.content.length > 0);
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Chưa cấu hình OPENAI_API_KEY trên máy chủ." }, { status: 503 });
    }

    const forwarded = request.headers.get("x-forwarded-for") || "unknown";
    const clientIp = forwarded.split(",")[0].trim();
    if (!rateLimit(clientIp)) {
      return NextResponse.json({ error: "Anh/chị gửi quá nhanh. Vui lòng đợi một phút." }, { status: 429 });
    }

    const body = await request.json();
    const messages = cleanMessages(body.messages);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Nội dung câu hỏi chưa hợp lệ." }, { status: 400 });
    }

    const projectContext = Array.isArray(body?.context?.availableProjects)
      ? body.context.availableProjects.slice(0, 20).join("\n- ")
      : "Chưa có dữ liệu sản phẩm được truyền từ hệ thống.";

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      store: false,
      input: [
        {
          role: "developer",
          content: `Bạn là Trợ lý VNREB AI của Công ty Cổ phần Phát triển Môi giới Bất động sản Việt Nam.\n\nNhiệm vụ:\n- Tư vấn khách hàng bằng tiếng Việt tự nhiên, rõ ràng, lịch sự.\n- Hỏi thêm ngân sách, khu vực, mục tiêu mua ở/đầu tư và thời gian dự kiến khi thiếu dữ liệu.\n- Chỉ sử dụng danh sách sản phẩm được cung cấp; không tự bịa dự án, giá, pháp lý hoặc quy hoạch.\n- Với giá, quy hoạch, pháp lý, hợp đồng, thanh toán và quyết định đầu tư: luôn nêu đây là thông tin tham khảo và cần chuyên viên/người có thẩm quyền xác minh.\n- Không khẳng định lợi nhuận chắc chắn.\n- Câu trả lời nên ngắn gọn, có bước hành động tiếp theo.\n\nSản phẩm hiện có:\n- ${projectContext}`
        },
        ...messages
      ],
      max_output_tokens: 700
    });

    const answer = response.output_text?.trim();
    if (!answer) throw new Error("OpenAI không trả về nội dung");

    return NextResponse.json({
      answer,
      model: response.model,
      requestId: response._request_id || null
    });
  } catch (error) {
    console.error("VNREB AI error:", error);
    const status = Number(error?.status) || 500;
    const safeMessage = status === 401
      ? "OPENAI_API_KEY không hợp lệ."
      : status === 429
        ? "Tài khoản OpenAI đang hết hạn mức hoặc bị giới hạn tốc độ."
        : "Trợ lý AI đang tạm gián đoạn. Vui lòng thử lại sau.";
    return NextResponse.json({ error: safeMessage }, { status: status >= 400 && status < 600 ? status : 500 });
  }
}
