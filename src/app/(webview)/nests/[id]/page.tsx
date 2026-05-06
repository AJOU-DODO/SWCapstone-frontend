import { NestDetailClient } from "@/components/webview/nest-detail/NestDetailClient";

interface Props {
  params: { id: string };
}
export default async function Page({ params }: Props) {
  const { id } = await params;

  return <NestDetailClient nestId={id} />;
}
