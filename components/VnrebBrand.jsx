import Image from "next/image";
export default function VnrebBrand({compact=false}){return <div className="vnrebBrand"><Image src="/brand/vnreb-logo.png" alt="VNREB.JSC" width={compact?150:190} height={compact?76:96} priority/></div>}
