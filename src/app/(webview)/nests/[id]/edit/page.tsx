import dynamic from "next/dynamic";

const NestUpdateClient = dynamic(
  () =>
    import("@/components/webview/nest-editor/NestUpdateClient").then(
      (mod) => mod.NestUpdateClient,
    ),
  { ssr: false },
);

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NestEditPage({ params }: Props) {
  const { id } = await params;
  return <NestUpdateClient nestId={id} />;
}
