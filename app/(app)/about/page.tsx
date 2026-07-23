"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import FetchError from "@/components/errors";
import { aboutQuery } from "@/hooks/about/aboutQuery";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutQuery.getBlobal(),
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
      <h1 className="text-4xl font-bold mb-4">About Page</h1>
      {data ? <JsonViewer json={data} /> : null}
    </div>
  );
};

export default Page;
