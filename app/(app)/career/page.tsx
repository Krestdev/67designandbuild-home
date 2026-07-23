"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import FetchError from "@/components/errors";
import { careerListQuery } from "@/hooks/career/careerListQuery";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["careerListQuery"],
    queryFn: () => careerListQuery.getBlobal(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return <FetchError error={error} />;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-4">Career Page</h1>
      {data ? <JsonViewer json={data} /> : null}
    </div>
  );
};

export default Page;
