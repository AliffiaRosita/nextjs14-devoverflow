'use client';

import { setCookies } from '@/lib/actions/cookies.action';
import { useEffect, useCallback, FC } from 'react';

interface ReferralProps {
    referral: string | undefined;
}

const ReferralHandler: FC<ReferralProps> = ({ referral }) => {
    const handleReferral = useCallback(async () => {
        if (!referral) return;

        try {
            sessionStorage.setItem('referral', referral);

            await setCookies({
                name: 'referral',
                value: referral,
                options: {
                    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                },
            });
        } catch (error) {
            console.error('Failed to set referral cookie:', error);
        }
    }, [referral]);

    useEffect(() => {
        handleReferral();
    }, [handleReferral]);

    return null;
};

export default ReferralHandler;
