"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import FetchError from "@/components/errors";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import { sectorQuery } from "@/hooks/sector/sectorQuery";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sectorQuery"],
    queryFn: () => sectorQuery.get(),
  });
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery({
    queryKey: ["sectorListQuery"],
    queryFn: () => sectorListQuery.getBlobal(),
  });

  if (isLoading || isLoading2) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Loading...
      </div>
    );
  }

  if (error || error2) {
    return <FetchError error={error || error2} />;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-4">Secetor Page</h1>
      {data ? <JsonViewer json={data} /> : null}
      {data2 ? <JsonViewer json={data2} /> : null}
    </div>
  );
};

export default Page;
