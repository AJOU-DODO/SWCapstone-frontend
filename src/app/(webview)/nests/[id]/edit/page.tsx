import { NestUpdateClient } from "@/components/webview/nest-editor/NestUpdateClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NestEditPage({ params }: Props) {
  const { id } = await params;
  return <NestUpdateClient nestId={id} />;
}
