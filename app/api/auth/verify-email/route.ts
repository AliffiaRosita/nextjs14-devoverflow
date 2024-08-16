import { verifyEmail } from '@/lib/actions/auth.action';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
    try {
        const { email, otp } = await request.json();

        const isVerified = await verifyEmail(email, otp);
        if (isVerified) {
            return NextResponse.json(
                { message: 'Email verified successfully' },
                { status: 200 },
            );
        } else {
            return NextResponse.json(
                { error: 'Invalid OTP' },
                { status: 400 },
            );
        }
    } catch (error: any) {
        console.log(error);

        if (error.message === 'Invalid OTP') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
};
