"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { gaEvent } from "@/app/lib/gtag";

export default function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    gaEvent("page_view", {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}
