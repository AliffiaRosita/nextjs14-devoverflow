import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="mb-12 mt-10">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-5 h-48 w-full" />
        <Skeleton className="mt-10 h-7 w-full" />
      </div>

      <div className="mt-10 flex gap-10">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            <Skeleton className="h-11 w-48 rounded-r-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
