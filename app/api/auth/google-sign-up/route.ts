import { googleSignUp } from "@/lib/actions/auth.action";
import { NewGoogleCreateUserParams } from "@/lib/actions/shared.types";
import { NextResponse } from "next/server";

interface RequestBody extends NewGoogleCreateUserParams {}

export const POST = async (request: Request) => {
    try {
        const body: RequestBody = await request.json()

        const newGoogleUser = await googleSignUp(body)

        return NextResponse.json(newGoogleUser, {status: 201})
    } catch (error: any) {
        console.log(error);

        if (error.message === 'Email already exist') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
};
