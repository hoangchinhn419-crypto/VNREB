"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles, Building2, MapPinned} from "lucide-react";
import VnrebBrand from "../../components/VnrebBrand";

export default function LoginPage(){
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const [showPassword,setShowPassword]=useState(false);
 async function submit(e){
   e.preventDefault();setBusy(true);setMessage("");
   try{
     const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
     const d=await r.json();
     if(!r.ok){setMessage(d.error||"Không thể đăng nhập");setBusy(false);return}
     location.href=["SUPER_ADMIN","ADMIN"].includes(d.user.role)?"/quan-tri":"/tai-khoan";
   }catch{setMessage("Không kết nối được máy chủ. Vui lòng thử lại.");setBusy(false)}
 }
 return <main className="premiumAuth">
   <section className="premiumAuthVisual">
     <div className="visualOverlay"/>
     <div className="visualContent">
       <Link href="/" className="backHome"><ArrowLeft size={16}/> Trang chủ</Link>
       <VnrebBrand light/>
       <div className="visualBadge"><Sparkles size={14}/> VNREB INTELLIGENCE PLATFORM</div>
       <h1>Chào mừng trở lại hệ sinh thái bất động sản VNREB</h1>
       <p>Truy cập dữ liệu dự án, bản đồ, khách hàng và trợ lý AI trong một không gian vận hành thống nhất.</p>
       <div className="visualBenefits">
         <span><Building2/>Quản trị dự án và bảng hàng</span>
         <span><MapPinned/>Bản đồ và quy hoạch thông minh</span>
         <span><Sparkles/>Trợ lý AI hỗ trợ ra quyết định</span>
         <span><ShieldCheck/>Phiên đăng nhập bảo mật</span>
       </div>
       <div className="visualTrust"><b>VNREB.JSC</b><span>Kết nối giá trị · Kiến tạo thịnh vượng</span></div>
     </div>
   </section>
   <section className="premiumAuthPanel">
     <form className="premiumAuthCard loginCard" onSubmit={submit}>
       <div className="cardHeader">
         <span className="eyebrow">TÀI KHOẢN VNREB</span>
         <h2>Đăng nhập</h2>
         <p>Tiếp tục quản lý tài khoản và truy cập các công cụ thông minh.</p>
       </div>
       <label><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@domain.com" required/></label>
       <label><span>Mật khẩu</span><div className="passwordField"><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nhập mật khẩu" required/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff/>:<Eye/>}</button></div></label>
       <div className="loginOptions"><label><input type="checkbox"/> Ghi nhớ đăng nhập</label><a href="#">Quên mật khẩu?</a></div>
       <button className="premiumSubmit" disabled={busy}>{busy?"Đang đăng nhập...":"Đăng nhập hệ thống"}</button>
       {message&&<p className="authMessage error">{message}</p>}
       <div className="authSwitch">Chưa có tài khoản? <Link href="/dang-ky">Đăng ký ngay</Link></div>
       <div className="securityRow"><span><ShieldCheck/>Bảo mật an toàn</span><span><Sparkles/>AI hỗ trợ 24/7</span><span><Building2/>Dữ liệu tập trung</span></div>
     </form>
   </section>
 </main>
}
