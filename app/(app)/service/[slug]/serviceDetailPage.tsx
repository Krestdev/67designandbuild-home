"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import { useQuery } from "@tanstack/react-query";

const ServiceDetailPage = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["serviceQuery"],
    queryFn: () => serviceListQuery.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-4">Service Page</h1>
      {data ? <JsonViewer json={data} /> : null}
    </div>
  );
};

export default ServiceDetailPage;
