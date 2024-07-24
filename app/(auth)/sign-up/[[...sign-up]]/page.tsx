import { SignUp } from '@clerk/nextjs';
import Referral from './Referral';

export default function Page({ searchParams }) {
    const { referral } = searchParams;

    return (
        <>
            <Referral referral={referral} />
            <SignUp />
        </>
    );
}
