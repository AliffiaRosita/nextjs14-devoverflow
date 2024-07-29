import { SignUp } from '@clerk/nextjs';
import { URLProps } from '@/types';
import ReferralHandler from './components/ReferralHandler';

export default function Page({ searchParams }: URLProps) {
    const { referral } = searchParams;

    return (
        <>
            <ReferralHandler referral={referral} />
            <SignUp />
        </>
    );
}
