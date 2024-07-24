'use client';

import { setCookies } from '@/lib/actions/cookies.action';
import { useEffect } from 'react';

export default function Referral({ referral }) {
    useEffect(() => {
        if (referral) {
            const saveReferral = async () => {
                await setCookies({
                    name: 'referral',
                    value: referral,
                    expires: new Date(Date.now() + 15 * 60 * 1000),
                });
            };
            saveReferral();
        }
    }, []);

    return <></>;
}
