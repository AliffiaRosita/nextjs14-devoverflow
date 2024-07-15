import Link from "next/link";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";

import { getAllSkills } from "@/lib/actions/skill.action";

import { SkillsFilters } from "@/constants/filters";

import type { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Skills — TheSkillGuru",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
	const result = await getAllSkills({
		searchQuery: searchParams.q,
		filter: searchParams.filter,
		page: searchParams.page ? +searchParams.page : 1,
		clerkId: "",
	});

	return (
		<>
			<h1 className="h1-bold text-dark100_light900">All Skills</h1>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearchbar
					route="/skills"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for skills"
					otherClasses="flex-1"
				/>

				<Filter
					filters={SkillsFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
				/>
			</div>

			<section className="mt-12 flex flex-wrap gap-4">
				{result.skills.length > 0 ? (
					result.skills.map((tag: any) => (
						<Link
							href={`/skills/${tag._id}`}
							key={tag._id}
							className="shadow-light100_darknone"
						>
							<article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
								<div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
									<p className="paragraph-semibold text-dark300_light900">
										{tag.name}
									</p>
								</div>

								{tag.description && (
									<p className="small-regular text-dark500_light700 mt-4">
										{tag.description}
									</p>
								)}

								<p className="small-medium text-dark400_light500 mt-3.5">
									<span className="body-semibold primary-text-gradient mr-2.5">
										{tag.questions.length}+
									</span>{" "}
									Questions
								</p>
							</article>
						</Link>
					))
				) : (
					<NoResult
						title="No Skills Found"
						description="It appears that there are not skills found at the moment 😔. Post a Problem and kickstart the
                                    discussion with skills. our query could be the next big thing others learn from. Get
                                    involved! 💡"
						link="/post-problem"
						linkTitle="Post a Problem"
					/>
				)}
			</section>

			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	);
};

export default Page;
