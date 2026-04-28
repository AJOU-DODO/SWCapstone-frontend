import { CategorySelector } from "@/components/webview/CategorySelector";
import { ContentEditor } from "@/components/webview/ContentEditor";

export default function Page() {
  return (
    <div>
      <ContentEditor />
      <CategorySelector />
    </div>
  );
}
