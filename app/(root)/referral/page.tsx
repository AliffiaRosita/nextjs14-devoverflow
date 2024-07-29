import { auth } from '@clerk/nextjs/server';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';

import { UserFilters } from '@/constants/filters';

import type { SearchParamsProps } from '@/types';
import type { Metadata } from 'next';
import { getReferralUsers } from '@/lib/actions/user.action';
import UserCard from '@/components/cards/UserCard';

export const metadata: Metadata = {
    title: 'Referral Users — TheUserGuru',
};

const Page = async ({ searchParams }: SearchParamsProps) => {
    const { userId: clerkId } = auth();

    const result = await getReferralUsers({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
        clerkId: clerkId || '',
        pageSize: 9
    });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">
                All Referral Users
            </h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/referral"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for referral users"
                    otherClasses="flex-1"
                />

                <Filter
                    filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <section className="mt-12 flex flex-wrap gap-4">
                {result.users.length > 0 ? (
                    result.users.map((user: any) => (
                        <UserCard key={user._id} user={user} />
                    ))
                ) : (
                    <NoResult
                        title="No Referral Users Found"
                        description="Your referral list is currently empty. 🚀 Invite others to join and impact more lives! Share your referral link and start inviting now! 💡"
                        link="/sign-up"
                        linkTitle="Sign Up"
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
