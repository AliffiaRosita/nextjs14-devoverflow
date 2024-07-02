import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="h1-bold text-dark100_light900">Onboarding</h1>
      <p className="base-medium text-dark100_light900 mt-3">
        Complete your profile now to use TheSkillGuru
      </p>

      <div className="background-light850_dark100 mt-9 flex flex-wrap gap-4 p-10">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </section>
  );
};

export default Loading;
