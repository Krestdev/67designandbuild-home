import ServiceDetailPage from "./serviceDetailPage";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ServiceDetailPage slug={slug} />;
}
