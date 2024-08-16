import { signIn } from '@/lib/actions/auth.action';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 },
            );
        }

        const { data, accessToken, refreshToken } = await signIn(
            email,
            password,
        );

        return NextResponse.json(
            {
                message: 'Sign in successful',
                user: data,
                accessToken,
                refreshToken,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.log(error);

        if (error.message === 'User not found') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        if (error.message === 'Email is not verified') {
            return NextResponse.json(
                { error: 'Email is not verified' },
                { status: 401 },
            );
        }

        if (error.message === 'Wrong email or password') {
            return NextResponse.json(
                { error: 'Wrong email or password' },
                { status: 401 },
            );
        }

        if (
            error.message ===
            'You have too many failed login attempts. Try again later!'
        ) {
            return NextResponse.json(
                {
                    error: 'You have too many failed login attempts. Try again later!',
                },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
};
