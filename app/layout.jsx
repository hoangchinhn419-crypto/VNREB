import "./globals.css";
export const metadata = {
  title: "VNREB.JSC – Nền tảng bất động sản & AI",
  description: "Tìm kiếm, so sánh, kiểm tra quy hoạch và kết nối giao dịch bất động sản bằng AI."
};
export default function RootLayout({children}) {
  return <html lang="vi"><body>{children}</body></html>;
}
