import { googleSignIn } from '@/lib/actions/auth.action';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
    try {
        const { googleId, email } = await request.json();

        if (!googleId || !email) {
            return NextResponse.json(
                { error: 'googleId and email are required' },
                { status: 400 },
            );
        }

        const { data, accessToken, refreshToken } = await googleSignIn(
            googleId,
            email,
        );

        return NextResponse.json(
            {
                message: 'Google sign in successful',
                user: data,
                accessToken,
                refreshToken,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.log(error);

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
};
