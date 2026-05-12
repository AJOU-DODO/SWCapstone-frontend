import type { Metadata } from "next";
import CategoryClient from "@/components/webview/category/CategoryClient";

export const metadata: Metadata = {
  title: "카테고리 선택",
};

export default function Page() {
  return <CategoryClient />;
}
