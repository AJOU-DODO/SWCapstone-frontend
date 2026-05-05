import type { Metadata } from "next";
import { NestEditorClient } from "@/components/webview/nest-editor/NestEditorClient";

export const metadata: Metadata = {
  title: "게시물 작성",
};

export default function Page() {
  return <NestEditorClient />;
}
