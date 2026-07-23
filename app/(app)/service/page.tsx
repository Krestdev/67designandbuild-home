"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import FetchError from "@/components/errors";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import { serviceQuery } from "@/hooks/service/serviceQuery";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const Page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["serviceQuery"],
    queryFn: () => serviceQuery.get(),
  });
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery({
    queryKey: ["serviceListQuery"],
    queryFn: () => serviceListQuery.get(),
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

  if (data2 === undefined) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        No services found
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-4">Service Page</h1>
      {data ? <JsonViewer json={data} /> : null}
      {data2.map((item) => (
        <div key={item.id}>
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <p>{item.title}</p>
          <Link href={`/service/${item.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default Page;
