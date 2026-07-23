"use client";
import { useMemo, useState } from "react";
import PlanningMap from "../components/PlanningMap";
import VnrebBrand from "../components/VnrebBrand";
import VnrebAiChat from "../components/VnrebAiChat";
import MotionRuntime from "../components/MotionRuntime";
import {
  ArrowRight, Bot, Building2, CheckCircle2, ChevronRight, Compass, FileCheck2, Play, Layers3, Radar,
  Heart, House, Map, MapPin, Menu, MessageCircleMore, Search, ShieldCheck,
  Sparkles, Star, TrendingUp, Users, X
} from "lucide-react";

const projects = [
  {id:1,name:"VNREB Riverside",location:"Quận 12, TP.HCM",type:"Căn hộ",price:3.2,area:"55–92 m²",score:94,legal:"Sở hữu lâu dài",tag:"Đang mở bán",theme:"blue"},
  {id:2,name:"Eco City Garden",location:"Thuận An, Bình Dương",type:"Nhà phố",price:4.8,area:"80–120 m²",score:91,legal:"Sổ riêng",tag:"Sắp hết hàng",theme:"green"},
  {id:3,name:"The Urban River",location:"TP. Thủ Đức",type:"Căn hộ",price:5.6,area:"68–110 m²",score:89,legal:"Sở hữu lâu dài",tag:"Mới ra mắt",theme:"purple"},
  {id:4,name:"Central Park Homes",location:"Tân Phú, TP.HCM",type:"Nhà riêng",price:6.9,area:"62–95 m²",score:87,legal:"Hoàn công",tag:"Pháp lý rõ",theme:"orange"},
  {id:5,name:"An Phú Residence",location:"Dĩ An, Bình Dương",type:"Đất nền",price:2.4,area:"70–100 m²",score:85,legal:"Sổ từng nền",tag:"Giá tốt",theme:"cyan"},
  {id:6,name:"West Gate City",location:"Đức Hòa, Tây Ninh",type:"Nhà phố",price:3.9,area:"75–105 m²",score:83,legal:"Hợp đồng mua bán",tag:"Tiềm năng",theme:"pink"}
];

const stories = [
  {title:"5 bước kiểm tra pháp lý trước khi xuống tiền",cat:"Pháp lý",time:"6 phút đọc"},
  {title:"Khu vực nào đang có hạ tầng tăng tốc?",cat:"Thị trường",time:"8 phút đọc"},
  {title:"Cách tính dòng tiền cho thuê thực tế",cat:"Đầu tư",time:"5 phút đọc"}
];

function Brand(){return <VnrebBrand compact/>}

function ProjectCard({p,favs,toggleFav}){
  return <article className="projectCard">
    <div className={`visual ${p.theme}`}>
      <div className="city"><i/><i/><i/><i/></div>
      <div className="projectTop">
        <span>{p.tag}</span>
        <button onClick={()=>toggleFav(p.id)} className={favs.includes(p.id)?"liked":""} aria-label="Lưu sản phẩm">
          <Heart size={17} fill={favs.includes(p.id)?"currentColor":"none"}/>
        </button>
      </div>
      <div className="score"><Sparkles size={13}/> AI {p.score}% phù hợp</div>
    </div>
    <div className="projectBody">
      <span className="location"><MapPin size={14}/>{p.location}</span>
      <h3>{p.name}</h3>
      <p>{p.type} · {p.area}</p>
      <div className="legal"><ShieldCheck size={14}/>{p.legal}</div>
      <div className="projectBottom">
        <strong>Từ {p.price.toFixed(1).replace(".",",")} tỷ</strong>
        <a href="#detail">Xem chi tiết <ChevronRight size={15}/></a>
      </div>
    </div>
  </article>
}

export default function Home(){
  const [menu,setMenu]=useState(false);
  const [query,setQuery]=useState("");
  const [type,setType]=useState("Tất cả");
  const [budget,setBudget]=useState("Tất cả");
  const [favs,setFavs]=useState([]);
  const [leadSent,setLeadSent]=useState(false);

  const filtered=useMemo(()=>projects.filter(p=>{
    const q=(p.name+p.location+p.type+p.legal).toLowerCase();
    const okQ=q.includes(query.toLowerCase());
    const okType=type==="Tất cả"||p.type===type;
    const okBudget=budget==="Tất cả"||(budget==="Dưới 3 tỷ"&&p.price<3)||(budget==="3–5 tỷ"&&p.price>=3&&p.price<=5)||(budget==="Trên 5 tỷ"&&p.price>5);
    return okQ&&okType&&okBudget;
  }),[query,type,budget]);

  const toggleFav=id=>setFavs(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);

  return <main>
    <MotionRuntime/>
    <header className="header">
      <nav className="container nav">
        <Brand/>
        <div className="navLinks">
          <a href="#projects">Dự án</a><a href="#map">Bản đồ</a><a href="#planning">Quy hoạch</a><a href="#knowledge">Kiến thức</a><a href="/ho-so-nang-luc">Về VNREB</a>
        </div>
        <div className="navActions">
          <button className="favBtn"><Heart size={17}/> {favs.length}</button>
          <a className="ghost" href="/dang-nhap">Đăng nhập</a>
          <a className="primary" href="/dang-ky">Tạo tài khoản</a>
        </div>
        <button className="menuBtn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      </nav>
      {menu&&<div className="mobileMenu"><a href="#projects">Dự án</a><a href="#map">Bản đồ</a><a href="#planning">Quy hoạch</a><a href="#knowledge">Kiến thức</a><a href="/ho-so-nang-luc">Về VNREB</a></div>}
    </header>

    <section className="hero heroV71">
      <div className="heroV71Aurora a"/><div className="heroV71Aurora b"/>
      <div className="container heroV71Grid">
        <div className="heroV71Copy" data-reveal>
          <div className="heroBadge"><Sparkles size={15}/> Nền tảng bất động sản vận hành bằng AI</div>
          <h1><span className="line">Tìm đúng bất động sản.</span><span className="line accent">Hiểu rõ trước khi quyết định.</span></h1>
          <p>Kết nối dữ liệu dự án, giá bán, quy hoạch, pháp lý và tư vấn chuyên gia trong một trải nghiệm thống nhất.</p>
          <div className="heroV71Pills">
            <span><Radar/>AI phân tích thị trường</span><span><Layers3/>Quy hoạch đa lớp</span><span><ShieldCheck/>Dữ liệu có nguồn</span>
          </div>
          <div className="searchBox heroV71Search">
            <div className="searchMain"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm dự án, khu vực, loại hình hoặc nhu cầu..."/></div>
            <select value={type} onChange={e=>setType(e.target.value)}><option>Tất cả</option><option>Căn hộ</option><option>Nhà phố</option><option>Nhà riêng</option><option>Đất nền</option></select>
            <select value={budget} onChange={e=>setBudget(e.target.value)}><option>Tất cả</option><option>Dưới 3 tỷ</option><option>3–5 tỷ</option><option>Trên 5 tỷ</option></select>
            <button><Search size={18}/> Tìm kiếm</button>
          </div>
          <div className="quickTags"><span>Tìm kiếm phổ biến:</span><button onClick={()=>setQuery("Quận 12")}>Quận 12</button><button onClick={()=>setBudget("3–5 tỷ")}>3–5 tỷ</button><button onClick={()=>setType("Nhà phố")}>Nhà phố</button></div>
        </div>

        <div className="heroV71Visual" data-reveal aria-label="Không gian đô thị AI VNREB">
          <div className="heroV71Media"/>
          <div className="scanLine"/>
          <div className="projectHotspot hs1"><i/><div><b>THE RIVUS</b><span>Từ 150 tỷ · Quận 2</span></div></div>
          <div className="projectHotspot hs2"><i/><div><b>THE BEVERLY</b><span>Từ 3,2 tỷ · Thủ Đức</span></div></div>
          <div className="projectHotspot hs3"><i/><div><b>THE MANHATTAN</b><span>Từ 5,8 tỷ · Thủ Đức</span></div></div>
          <div className="heroV71Mode"><span>Trải nghiệm dự án</span><div><button>2D</button><button className="active">3D</button><button><Play size={13}/> Video</button></div></div>
          <div className="heroV71Glass"><span>VNREB MARKET INTELLIGENCE</span><b>Dữ liệu dự án · Quy hoạch · AI tư vấn</b><small>Thông tin quan trọng được gắn nguồn và cần chuyên viên xác minh.</small></div>
        </div>

        <div className="heroV71Stats" data-reveal>
          <div><strong data-count="10000" data-suffix="+">0</strong><span>Dự án toàn quốc</span></div>
          <div><strong data-count="500000" data-suffix="+">0</strong><span>Bất động sản</span></div>
          <div><strong data-count="50" data-suffix="+">0</strong><span>Tỉnh thành</span></div>
          <div><strong data-count="1" data-suffix="M+">0</strong><span>Lượt phân tích AI</span></div>
          <div><strong data-count="99.9" data-suffix="%" data-decimals="1">0</strong><span>Dữ liệu chuẩn hóa</span></div>
        </div>
      </div>
    </section>

    <section id="projects" className="section container" data-reveal>
      <div className="sectionHead"><div><span className="eyebrow">DỰ ÁN NỔI BẬT</span><h2>Được AI chọn theo mục tiêu của bạn</h2><p>{filtered.length} lựa chọn đang phù hợp với bộ lọc.</p></div><button className="outline">Xem trên bản đồ <Map size={17}/></button></div>
      <div className="projectGrid">{filtered.map(p=><ProjectCard key={p.id} p={p} favs={favs} toggleFav={toggleFav}/>)}</div>
    </section>

    <section id="map" className="section container" data-reveal>
      <div className="sectionHead">
        <div><span className="eyebrow">BẢN ĐỒ THỊ TRƯỜNG & QUY HOẠCH</span><h2>Khám phá vị trí trên bản đồ thật</h2><p>Kéo, phóng to, định vị và bật tắt lớp quy hoạch trực tiếp.</p></div>
        <a href="/ban-do-quy-hoach" className="outline">Mở toàn màn hình <Map size={17}/></a>
      </div>
      <div className="homeRealMap"><PlanningMap compact/></div>
    </section>

    <section id="planning" className="section container" data-reveal>
      <div className="planningGrid">
        <div className="planningPreview">
          <div className="parcel"><span>Thửa 798</span></div>
          <div className="planningInfo"><span>Độ tin cậy</span><strong>82/100</strong><small>Nguồn cập nhật gần nhất: 07/2026</small></div>
        </div>
        <div className="planningCopy">
          <span className="eyebrow">VNREB PLANNING INTELLIGENCE</span>
          <h2>Kiểm tra quy hoạch trước khi xuống tiền</h2>
          <p>Nhập địa chỉ, tọa độ, số tờ hoặc số thửa. Hệ thống chồng lớp dữ liệu, giải thích bằng AI và tạo báo cáo để chuyên viên xác minh.</p>
          <div className="featureList"><div><FileCheck2/><span><b>Nguồn và ngày cập nhật</b><small>Biết rõ dữ liệu đến từ đâu</small></span></div><div><ShieldCheck/><span><b>Cảnh báo mức độ ảnh hưởng</b><small>Không chỉ hiển thị màu trên bản đồ</small></span></div><div><Bot/><span><b>AI giải thích dễ hiểu</b><small>Đưa ra các câu hỏi cần xác minh</small></span></div></div>
          <button className="primary large">Bắt đầu kiểm tra <ArrowRight size={17}/></button>
        </div>
      </div>
    </section>

    <section className="section soft" data-reveal>
      <div className="container">
        <div className="sectionHead"><div><span className="eyebrow">VÌ SAO CHỌN VNREB</span><h2>Một nền tảng, đầy đủ dữ liệu cần thiết</h2></div></div>
        <div className="benefits">
          <article><span><ShieldCheck/></span><h3>Dữ liệu có nguồn</h3><p>Mỗi thông tin quan trọng đều gắn nguồn, thời điểm cập nhật và mức độ tin cậy.</p></article>
          <article><span><TrendingUp/></span><h3>Phân tích đầu tư</h3><p>So sánh giá, thanh khoản, hạ tầng và khả năng tạo dòng tiền.</p></article>
          <article><span><Users/></span><h3>Chuyên viên đồng hành</h3><p>Kết nối đúng chuyên viên theo khu vực, phân khúc và nhu cầu.</p></article>
          <article><span><Bot/></span><h3>AI hỗ trợ 24/7</h3><p>Tư vấn, lọc sản phẩm, so sánh và chuẩn bị checklist giao dịch.</p></article>
        </div>
      </div>
    </section>

    <section id="knowledge" className="section container" data-reveal>
      <div className="sectionHead"><div><span className="eyebrow">KIẾN THỨC BẤT ĐỘNG SẢN</span><h2>Quyết định tốt hơn nhờ hiểu đúng</h2></div><a href="#">Xem tất cả <ChevronRight size={16}/></a></div>
      <div className="storyGrid">{stories.map((s,i)=><article key={s.title}><div className={`storyVisual s${i+1}`}><House/></div><div className="storyBody"><span>{s.cat}</span><h3>{s.title}</h3><small>{s.time}</small></div></article>)}</div>
    </section>

    <section className="section container">
      <div className="leadBox">
        <div><span className="eyebrow light">TƯ VẤN 1–1</span><h2>Nhận danh sách sản phẩm phù hợp trong hôm nay</h2><p>Chuyên viên VNREB sẽ liên hệ, xác minh nhu cầu và gửi lựa chọn phù hợp.</p></div>
        <form onSubmit={e=>{e.preventDefault();setLeadSent(true)}}><input required placeholder="Họ và tên"/><input required placeholder="Số điện thoại"/><select><option>Nhu cầu mua ở</option><option>Nhu cầu đầu tư</option><option>Cần bán bất động sản</option></select><button className="primary">Nhận tư vấn</button>{leadSent&&<small className="sent">✓ Đã ghi nhận yêu cầu tư vấn mẫu.</small>}</form>
      </div>
    </section>

    <footer>
      <div className="container footerGrid">
        <div><Brand/><p>Nền tảng kết nối dữ liệu, con người và công nghệ cho thị trường bất động sản Việt Nam.</p></div>
        <div><b>Khám phá</b><a>Dự án</a><a>Bản đồ</a><a>Quy hoạch</a><a>Kiến thức</a></div>
        <div><b>Dịch vụ</b><a>Tư vấn mua</a><a>Tư vấn bán</a><a>Phân tích đầu tư</a><a>Đối tác môi giới</a></div>
        <div><b>Liên hệ</b><a>Hotline: 0900 000 000</a><a>Email: hello@vnreb.vn</a><a>TP.HCM, Việt Nam</a></div>
      </div>
      <div className="container copyright">© 2026 VNREB.JSC · Thông tin trên website mang tính tham khảo.</div>
    </footer>

    <VnrebAiChat onSearchSuggestion={(value)=>{ if(value==="3–5 tỷ") setBudget("3–5 tỷ"); }} />
  </main>
}
