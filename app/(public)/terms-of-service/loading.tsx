import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-4xl font-bold">
            Terms of Service
          </h1>
          <div className="flex flex-wrap gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-60 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
