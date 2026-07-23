"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft, Building2, Check, Eye, EyeOff, LockKeyhole, MapPinned, ShieldCheck, Sparkles} from "lucide-react";
import VnrebBrand from "../../components/VnrebBrand";

export default function RegisterPage(){
 const [form,setForm]=useState({fullName:"",email:"",phone:"",password:"",setupCode:""});
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const [showPassword,setShowPassword]=useState(false);
 const [accepted,setAccepted]=useState(false);
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 async function submit(e){
   e.preventDefault();
   if(!accepted){setMessage("Anh/chị cần đồng ý Điều khoản và Chính sách bảo mật.");return}
   setBusy(true);setMessage("");
   try{
     const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
     const d=await r.json();
     if(!r.ok){setMessage(d.error||"Không thể tạo tài khoản");setBusy(false);return}
     location.href=d.user.role==="SUPER_ADMIN"?"/quan-tri":"/tai-khoan";
   }catch{setMessage("Không kết nối được máy chủ. Vui lòng thử lại.");setBusy(false)}
 }
 return <main className="premiumAuth">
   <section className="premiumAuthVisual">
     <div className="visualOverlay"/>
     <div className="visualContent">
       <Link href="/" className="backHome"><ArrowLeft size={16}/> Trang chủ</Link>
       <VnrebBrand light/>
       <div className="visualBadge"><Sparkles size={14}/> VNREB AI REAL ESTATE NETWORK</div>
       <h1>Nền tảng giao dịch và quản trị bất động sản thông minh</h1>
       <p>Kết nối dữ liệu, bản đồ, quy hoạch, sản phẩm và chuyên gia trong một hệ sinh thái dẫn đầu ứng dụng AI tại Việt Nam.</p>
       <div className="visualBenefits">
         <span><Building2/>Quản lý tài sản và sản phẩm tập trung</span>
         <span><MapPinned/>Theo dõi vị trí và lớp quy hoạch</span>
         <span><Sparkles/>Nhận tư vấn AI 24/7</span>
         <span><ShieldCheck/>Bảo mật dữ liệu doanh nghiệp</span>
       </div>
       <div className="visualTrust"><b>VNREB.JSC</b><span>Kết nối giá trị · Kiến tạo thịnh vượng</span></div>
     </div>
   </section>

   <section className="premiumAuthPanel">
     <form className="premiumAuthCard" onSubmit={submit}>
       <div className="cardHeader">
         <span className="eyebrow">THAM GIA HỆ SINH THÁI VNREB</span>
         <h2>Tạo tài khoản</h2>
         <p>Khởi tạo hồ sơ để lưu sản phẩm, nhận tư vấn và theo dõi giao dịch.</p>
       </div>
       <div className="premiumFormGrid">
         <label><span>Họ và tên</span><input name="fullName" value={form.fullName} onChange={change} placeholder="Nguyễn Văn A" required/></label>
         <label><span>Số điện thoại</span><input name="phone" value={form.phone} onChange={change} placeholder="09xx xxx xxx"/></label>
       </div>
       <label><span>Email</span><input name="email" type="email" value={form.email} onChange={change} placeholder="email@domain.com" required/></label>
       <label><span>Mật khẩu</span><div className="passwordField"><input name="password" type={showPassword?"text":"password"} minLength={8} value={form.password} onChange={change} placeholder="Tối thiểu 8 ký tự" required/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff/>:<Eye/>}</button></div></label>
       <label><span>Mã quản trị <small>(chỉ dành cho người được cấp quyền)</small></span><div className="passwordField"><input name="setupCode" type="password" value={form.setupCode} onChange={change} placeholder="Có thể để trống"/><LockKeyhole/></div></label>
       <label className="termsCheck"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><i><Check/></i><span>Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a>.</span></label>
       <button className="premiumSubmit" disabled={busy}>{busy?"Đang tạo tài khoản...":"Tạo tài khoản ngay"}</button>
       {message&&<p className="authMessage error">{message}</p>}
       <div className="authSwitch">Đã có tài khoản? <Link href="/dang-nhap">Đăng nhập</Link></div>
       <div className="securityRow"><span><ShieldCheck/>Bảo mật an toàn</span><span><Sparkles/>AI hỗ trợ 24/7</span><span><Building2/>Dữ liệu tập trung</span></div>
     </form>
   </section>
 </main>
}
