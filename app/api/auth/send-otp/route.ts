import { sendOTP } from '@/lib/actions/auth.action';
import { NewCreateUserParams } from '@/lib/actions/shared.types';
import { NextResponse } from 'next/server';

interface RequestBody extends NewCreateUserParams {}

export const POST = async (request: Request) => {
    try {
        const body: RequestBody = await request.json();

        await sendOTP(body.email);

        return NextResponse.json({message: 'OTP sent successfully'}, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
};
