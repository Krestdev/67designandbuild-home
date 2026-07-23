import ServiceDetailPage from "./serviceDetailPage";

interface props {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: props) => {
  const { id } = await params;

  return <ServiceDetailPage id={id} />;
};

export default Page;
