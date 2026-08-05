"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import FetchError from "@/components/errors";
import { faqListQuery } from "@/hooks/faq/faqListQuery";
import { faqQuery } from "@/hooks/faq/faqQuery";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["faqQuery"],
    queryFn: () => faqQuery.getBlobal(),
  });
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery({
    queryKey: ["faqListQuery"],
    queryFn: () => faqListQuery.get(),
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
      <h1 className="text-4xl font-bold mb-4">Faq Page</h1>
      {data ? <JsonViewer json={data} /> : null}
      {data2 ? <JsonViewer json={data2} /> : null}
    </div>
  );
};

export default Page;
