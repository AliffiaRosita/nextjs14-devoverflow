'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getReferralUsers } from '@/lib/actions/user.action';
import ReferralUserCard from './ReferralUserCard';
import { NoResultText } from '@/components/shared/NoResult';
import ClientPagination from '@/components/shared/ClientPagination';
import Loader from '@/components/shared/Loader';

interface Props {
    clerkId?: string | null;
}

const ReferralUserTab = ({ clerkId }: Props) => {
    const [page, setPage] = useState(1);
    const [referralData, setReferralData] = useState<{
        users: any[];
        isNext: boolean;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReferralUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getReferralUsers({
                clerkId: clerkId || '',
                pageSize: 8,
                page,
            });
            setReferralData(data);
        } catch (error) {
            console.error('Error fetching referral users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clerkId, page]);

    useEffect(() => {
        fetchReferralUsers();
    }, [fetchReferralUsers]);

    const renderUserCards = useMemo(() => {
        if (!referralData) return null;

        if (referralData.users.length === 0) {
            return (
                <div className="mt-10 flex w-full flex-col items-center justify-center">
                    <NoResultText
                        title="No Referral Users Found"
                        description="Your referral list is currently empty. 🚀 Invite others to join and impact more lives! Share your referral link and start inviting now! 💡"
                    />
                </div>
            );
        }

        return referralData.users.map(user => (
            <ReferralUserCard key={user._id} user={user} />
        ));
    }, [referralData]);

    const handlePageChange = useCallback((nextPageNumber: number) => {
        setPage(nextPageNumber);
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <div className="mt-12 flex flex-wrap gap-4">{renderUserCards}</div>

            <div className="mt-10">
                <ClientPagination
                    pageNumber={page}
                    isNext={referralData?.isNext ?? false}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default ReferralUserTab;
