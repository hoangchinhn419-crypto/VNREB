import Image from "next/image";

export default function VnrebBrand({compact=false, light=false, className=""}) {
  return (
    <div className={`vnrebBrand ${compact ? "compact" : ""} ${light ? "light" : ""} ${className}`}>
      <span className="brandSymbol">
        <Image
          src="/brand/vnreb-mark-better2.png"
          alt="VNREB mark"
          fill
          sizes={compact ? "44px" : "58px"}
          priority
        />
      </span>
      <span className="brandText">
        <b>VNREB<span>.JSC</span></b>
        {!compact && <small>VIETNAM NATIONAL REAL ESTATE BROKERAGE &amp; DEVELOPMENT</small>}
      </span>
    </div>
  );
}
