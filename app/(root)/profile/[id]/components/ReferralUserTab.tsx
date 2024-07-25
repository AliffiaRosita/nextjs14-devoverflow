import Link from 'next/link';

import Pagination from '@/components/shared/Pagination';

import { getReferralUsers } from '@/lib/actions/user.action';

import type { UserId } from '@/lib/actions/shared.types';
import type { SearchParamsProps } from '@/types';
import UserCard from '@/components/cards/UserCard';
import { Button } from '@/components/ui/button';
import { NoResultText } from '@/components/shared/NoResult';

interface Props extends SearchParamsProps, UserId {
    clerkId?: string | null;
}

const ReferralUserTab = async ({ searchParams, userId, clerkId }: Props) => {
    const result = await getReferralUsers({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
        clerkId: clerkId || '',
    });

    return (
        <>
            <div className="mt-12 flex flex-wrap gap-4">
                {result.users.length > 0 ? (
                    result.users.map((user: any) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            className="xs:w-[244px]"
                        />
                    ))
                ) : (
                    <div className="mt-10 flex w-full flex-col items-center justify-center">
                        <NoResultText
                            title="No Referral Users Found"
                            description="Your referral list is currently empty. 🚀 Invite others to join and impact more lives! Share your referral link and start inviting now! 💡"
                        />
                    </div>
                )}
            </div>

            {result.users.length > 12 && (
                <div className="flex-center flex">
                    <Link href={'/referral'}>
                        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
                            See All Users
                        </Button>
                    </Link>
                </div>
            )}

            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                />
            </div>
        </>
    );
};

export default ReferralUserTab;
