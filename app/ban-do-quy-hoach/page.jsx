import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import PlanningMap from "../../components/PlanningMap";

export const metadata = {
  title: "Bản đồ quy hoạch | VNREB.JCV",
  description: "Tra cứu vị trí, sản phẩm và lớp quy hoạch trên bản đồ tương tác VNREB."
};

export default function PlanningMapPage(){
  return <main className="mapPage">
    <header className="mapPageHeader">
      <Link href="/"><ArrowLeft size={16}/> Trang chủ</Link>
      <div>
        <span><Sparkles size={14}/> VNREB PLANNING INTELLIGENCE</span>
        <h1>Bản đồ bất động sản và quy hoạch</h1>
        <p>Kéo, phóng to, định vị, bật tắt lớp dữ liệu và bấm vào vùng màu để xem thông tin.</p>
      </div>
      <div className="sourceBadge"><ShieldCheck size={17}/><span><b>Dữ liệu có nguồn</b><small>Ghi rõ ngày cập nhật</small></span></div>
    </header>
    <PlanningMap/>
  </main>
}
