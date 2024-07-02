import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="mb-12 mt-10">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-5 h-48 w-full" />
        <Skeleton className="mt-10 h-10 w-full" />
      </div>
    </section>
  );
};

export default Loading;
