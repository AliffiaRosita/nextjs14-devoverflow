'use client';

import { setCookies } from '@/lib/actions/cookies.action';
import { useEffect } from 'react';

interface ReferralProps {
    referral: string | undefined;
}
export default function Referral({ referral }: ReferralProps) {
    useEffect(() => {
        if (referral) {
            const saveReferral = async () => {
                sessionStorage.setItem('referral', referral);

                await setCookies({
                    name: 'referral',
                    value: referral,
                    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                });
            };
            saveReferral();
        }
    }, []);

    return <></>;
}
