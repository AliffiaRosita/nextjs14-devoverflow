import { SignUp } from '@clerk/nextjs';
import Referral from './components/Referral';
import { URLProps } from '@/types';

export default function Page({ searchParams }: URLProps) {
    const { referral } = searchParams;

    return (
        <>
            <Referral referral={referral} />
            <SignUp />
        </>
    );
}
