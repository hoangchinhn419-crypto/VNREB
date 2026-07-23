"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, Layers3, LocateFixed, MapPin, Search, X } from "lucide-react";

const properties = [
  {id:"P1",name:"VNREB Riverside",price:"Từ 3,2 tỷ",lng:106.6504,lat:10.8536},
  {id:"P2",name:"Eco City Garden",price:"Từ 4,8 tỷ",lng:106.6637,lat:10.8488},
  {id:"P3",name:"The Urban River",price:"Từ 5,6 tỷ",lng:106.6438,lat:10.8570}
];

const fallbackStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors"
    }
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }]
};

export default function PlanningMap({compact=false}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady,setMapReady]=useState(false);
  const [planningVisible,setPlanningVisible]=useState(true);
  const [propertyVisible,setPropertyVisible]=useState(true);
  const [satelliteMode,setSatelliteMode]=useState(false);
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const styleUrl = process.env.NEXT_PUBLIC_VIETMAP_STYLE_URL;
  const style = useMemo(()=>styleUrl || fallbackStyle,[styleUrl]);

  useEffect(()=>{
    if(!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center:[106.6515,10.8520],
      zoom:13.2,
      pitch: compact ? 0 : 18,
      bearing: compact ? 0 : -8,
      attributionControl:true
    });
    mapRef.current=map;
    map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),"top-right");
    map.addControl(new maplibregl.ScaleControl({maxWidth:120,unit:"metric"}),"bottom-left");

    map.on("load",async()=>{
      setMapReady(true);
      map.addSource("planning",{type:"geojson",data:"/data/planning-sample.geojson"});
      map.addLayer({
        id:"planning-fill",
        type:"fill",
        source:"planning",
        paint:{
          "fill-color":["coalesce",["get","color"],"#a855f7"],
          "fill-opacity":0.42
        }
      });
      map.addLayer({
        id:"planning-line",
        type:"line",
        source:"planning",
        paint:{
          "line-color":["coalesce",["get","color"],"#7e22ce"],
          "line-width":2.5
        }
      });
      map.on("click","planning-fill",e=>{
        const f=e.features?.[0];
        if(!f) return;
        const p=f.properties||{};
        setSelected({
          type:"planning",
          title:p.name,
          subtitle:`${p.category} · Độ tin cậy ${p.confidence}%`,
          source:p.source,
          updatedAt:p.updatedAt,
          note:p.note
        });
      });
      map.on("mouseenter","planning-fill",()=>map.getCanvas().style.cursor="pointer");
      map.on("mouseleave","planning-fill",()=>map.getCanvas().style.cursor="");

      properties.forEach(p=>{
        const el=document.createElement("button");
        el.className="vreb-marker";
        el.innerHTML="<span>V</span>";
        el.addEventListener("click",()=>{
          setSelected({type:"property",title:p.name,subtitle:p.price,note:"Sản phẩm minh họa đang mở bán trên VNREB."});
        });
        const marker=new maplibregl.Marker({element:el}).setLngLat([p.lng,p.lat]).addTo(map);
        marker.getElement().dataset.vrebProperty="1";
      });
    });

    return ()=>{map.remove();mapRef.current=null};
  },[style,compact]);

  function togglePlanning(){
    const next=!planningVisible;
    setPlanningVisible(next);
    const map=mapRef.current;
    if(map?.getLayer("planning-fill")) {
      map.setLayoutProperty("planning-fill","visibility",next?"visible":"none");
      map.setLayoutProperty("planning-line","visibility",next?"visible":"none");
    }
  }

  function toggleProperties(){
    const next=!propertyVisible;
    setPropertyVisible(next);
    document.querySelectorAll("[data-vreb-property='1']").forEach(el=>{
      el.style.display=next?"grid":"none";
    });
  }

  function locate(){
    navigator.geolocation?.getCurrentPosition(
      pos=>mapRef.current?.flyTo({center:[pos.coords.longitude,pos.coords.latitude],zoom:15,essential:true}),
      ()=>alert("Không lấy được vị trí. Hãy cấp quyền định vị cho trình duyệt.")
    );
  }

  async function searchLocation(e){
    e.preventDefault();
    const text=query.trim();
    if(!text) return;
    const places={
      "quận 12":[106.6540,10.8610],
      "tan phu":[106.6280,10.7910],
      "tân phú":[106.6280,10.7910],
      "thu duc":[106.7530,10.8500],
      "thủ đức":[106.7530,10.8500],
      "thuan an":[106.7080,10.9300],
      "thuận an":[106.7080,10.9300]
    };
    const hit=Object.entries(places).find(([k])=>text.toLowerCase().includes(k));
    if(hit){
      mapRef.current?.flyTo({center:hit[1],zoom:13.5,essential:true});
      return;
    }
    alert("Bản V5 đang có tìm kiếm mẫu cho Quận 12, Tân Phú, Thủ Đức và Thuận An. Khi thêm VietMap API sẽ tìm kiếm đầy đủ địa chỉ Việt Nam.");
  }

  return <div className={`planningMapShell ${compact?"compact":""}`}>
    <div className="mapToolbar">
      <form onSubmit={searchLocation}><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm Quận 12, Thủ Đức, Thuận An..."/><button>Tìm</button></form>
      <div className="mapActions">
        <button className={planningVisible?"active":""} onClick={togglePlanning}><Layers3 size={16}/> Quy hoạch</button>
        <button className={propertyVisible?"active":""} onClick={toggleProperties}><MapPin size={16}/> Sản phẩm</button>
        <button onClick={locate}><LocateFixed size={16}/> Vị trí</button>
      </div>
    </div>
    <div ref={containerRef} className="realMap"/>
    {!mapReady&&<div className="mapLoading">Đang tải bản đồ...</div>}
    <div className="mapLegend">
      <b>Chú giải</b>
      <span><i style={{background:"#a855f7"}}/>Dân cư chỉnh trang</span>
      <span><i style={{background:"#f59e0b"}}/>Đất hỗn hợp</span>
      <span><i style={{background:"#ef4444"}}/>Giao thông dự kiến</span>
    </div>
    <div className="mapDisclaimer">Lớp quy hoạch hiện tại là dữ liệu minh họa để kiểm thử giao diện, không thay thế thông tin của cơ quan có thẩm quyền.</div>
    {selected&&<aside className="mapDetailCard">
      <button className="close" onClick={()=>setSelected(null)}><X size={17}/></button>
      <span className="detailType">{selected.type==="planning"?"THÔNG TIN QUY HOẠCH":"SẢN PHẨM VNREB"}</span>
      <h3>{selected.title}</h3>
      <p>{selected.subtitle}</p>
      {selected.source&&<div><b>Nguồn</b><span>{selected.source}</span></div>}
      {selected.updatedAt&&<div><b>Cập nhật</b><span>{selected.updatedAt}</span></div>}
      <small>{selected.note}</small>
      <button className="detailButton">Xem báo cáo chi tiết</button>
    </aside>}
  </div>
}
