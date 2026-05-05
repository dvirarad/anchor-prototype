"use client";
import { useEffect, useState } from "react";
import AnchorPrototype from "@/components/AnchorPrototype";
import DesktopAnchorPrototype from "@/components/DesktopAnchorPrototype";

const DESKTOP_BREAKPOINT = 1024;

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return <AnchorPrototype />;
  return isDesktop ? <DesktopAnchorPrototype /> : <AnchorPrototype />;
}
