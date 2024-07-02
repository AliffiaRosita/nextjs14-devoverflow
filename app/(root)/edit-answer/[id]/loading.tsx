import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="mt-10 flex gap-10">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            <Skeleton className="h-11 w-48 rounded-r-none" />
          </div>
        </div>
      </div>

      <div className="mb-12 mt-10">
        <Skeleton className="mt-5 h-48 w-full" />
      </div>
    </section>
  );
};

export default Loading;
