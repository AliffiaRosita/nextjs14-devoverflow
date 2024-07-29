'use client';

import { useCallback, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
interface ReferralLinkProps {
    username: string;
}

const ReferralLink = ({ username }: ReferralLinkProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL;

    const referralLink = useMemo(
        () => `${baseUrl}/${signUpUrl}?referral=${username}`,
        [username, baseUrl, signUpUrl],
    );

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: 'Referral Link Copied',
            variant: 'default',
        });
    }, [referralLink]);

    return (
        <Button
            className="rounded-md bg-dark-500 px-4 py-2.5 text-white"
            onClick={handleCopyLink}>
            Copy Referral Link
        </Button>
    );
};

export default ReferralLink;
