import Image from "next/image";
export default function VnrebBrand({compact=false, light=false, className=""}) {
  return <div className={`vnrebBrand ${compact?"compact":""} ${light?"light":""} ${className}`}>
    <Image
      src="/brand/vnreb-logo-premium.png"
      alt="VNREB.JSC"
      width={compact?154:214}
      height={compact?80:108}
      priority
    />
  </div>;
}
