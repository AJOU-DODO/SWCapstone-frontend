import { CategorySelector } from "@/components/webview/CategorySelector";
import { ContentEditor } from "@/components/webview/ContentEditor";
import { UnlockRadiusSelector } from "@/components/webview/UnlockRadiusSelector";

export default function Page() {
  return (
    <div>
      <section className="space-y-3">
        <CategorySelector />
        <UnlockRadiusSelector />
      </section>

      <section>
        <ContentEditor />
      </section>
    </div>
  );
}
