"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="flex top-0 left-0 p-4 z-50">
      <div className="flex font-bold text-xl items-center text-[#2B6340]">
        <Image
          src="/DODOLogo.png"
          alt="DODO 로고"
          width={80}
          height={80}/>
          DODO</div>
    </header>
  );
}