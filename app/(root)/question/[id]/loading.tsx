import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="mb-12 mt-10">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="mt-5 h-7 w-full" />
        <Skeleton className="mt-5 h-7 w-full" />

        <div className="mt-5 flex flex-1 flex-row gap-5">
          <Skeleton className="h-20 rounded-md" />

          <Skeleton className="h-20 rounded-md" />
        </div>
      </div>

      <div className="mt-10 flex gap-10">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            <Skeleton className="h-11 w-48 rounded-r-none" />
          </div>

          <div className="mt-5 flex w-full flex-col gap-6">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
