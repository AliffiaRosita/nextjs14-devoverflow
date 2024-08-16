import { signUp } from "@/lib/actions/auth.action";
import { NewCreateUserParams } from "@/lib/actions/shared.types";
import { NextResponse } from "next/server";


interface RequestBody extends NewCreateUserParams {}

export const POST = async (request: Request) => {
    try {
        const body: RequestBody = await request.json();

        const newUser = await signUp(body);

        return NextResponse.json(newUser, { status: 201 });
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
