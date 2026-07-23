"use client";
import {useEffect} from "react";

export default function MotionRuntime(){
  useEffect(()=>{
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealEls=[...document.querySelectorAll("[data-reveal]")];
    if(reduce){revealEls.forEach(el=>el.classList.add("is-visible"));return;}

    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("is-visible");io.unobserve(entry.target);}
      });
    },{threshold:.14,rootMargin:"0px 0px -8% 0px"});
    revealEls.forEach(el=>io.observe(el));

    const hero=document.querySelector(".heroV72Visual");
    const onMove=(e)=>{
      if(!hero||window.innerWidth<900)return;
      const r=hero.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      hero.style.setProperty("--mx",`${x*10}px`);
      hero.style.setProperty("--my",`${y*8}px`);
      hero.style.setProperty("--rx",`${y*-2.5}deg`);
      hero.style.setProperty("--ry",`${x*3.2}deg`);
    };
    const onLeave=()=>{if(hero){hero.style.setProperty("--mx","0px");hero.style.setProperty("--my","0px");hero.style.setProperty("--rx","0deg");hero.style.setProperty("--ry","0deg");}};
    hero?.addEventListener("mousemove",onMove);
    hero?.addEventListener("mouseleave",onLeave);

    const counters=[...document.querySelectorAll("[data-count]")];
    const cio=new IntersectionObserver((entries)=>{
      entries.forEach(({target,isIntersecting})=>{
        if(!isIntersecting)return;
        const end=Number(target.dataset.count||0);
        const suffix=target.dataset.suffix||"";
        const decimals=Number(target.dataset.decimals||0);
        const start=performance.now();
        const duration=1300;
        const tick=(now)=>{
          const p=Math.min(1,(now-start)/duration);
          const eased=1-Math.pow(1-p,3);
          const value=end*eased;
          target.textContent=value.toLocaleString("vi-VN",{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+suffix;
          if(p<1)requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(target);
      });
    },{threshold:.5});
    counters.forEach(el=>cio.observe(el));

    return ()=>{io.disconnect();cio.disconnect();hero?.removeEventListener("mousemove",onMove);hero?.removeEventListener("mouseleave",onLeave);};
  },[]);
  return null;
}
