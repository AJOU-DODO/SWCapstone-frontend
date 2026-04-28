import { CategorySelector } from "@/components/webview/CategorySelector";
import { ContentEditor } from "@/components/webview/ContentEditor";
import { ImageUploader } from "@/components/webview/ImageUploader";
import { UnlockRadiusSelector } from "@/components/webview/UnlockRadiusSelector";

export default function Page() {
  return (
    <div className="flex-1 px-5 pt-5 pb-4 space-y-5">
      <section>
        <ImageUploader />
      </section>

      <div className="h-px bg-[#E0DDD3]" />

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
