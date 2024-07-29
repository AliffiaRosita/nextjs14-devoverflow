'use server';
import { cookies } from 'next/headers';

type CookieOptions = {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
};

type CookieData = {
    name: string;
    value: string;
    options?: CookieOptions;
};

export async function setCookies(
    cookieData: CookieData | CookieData[],
): Promise<void> {
    try {
        if (!cookieData) throw new Error('Cookie data is not provided');

        const cookiesHandler = cookies();

        const setCookie = (data: CookieData) => {
            const { name, value, options } = data;
            cookiesHandler.set(name, value, options);
        };

        if (Array.isArray(cookieData)) {
            cookieData.forEach(setCookie);
        } else {
            setCookie(cookieData);
        }
    } catch (error) {
        console.error('Error setting cookies:', error);
        throw error;
    }
}

export async function deleteCookie(cookieName: string): Promise<void> {
    try {
        if (!cookieName) throw new Error('Cookie name not provided');

        cookies().delete(cookieName);
    } catch (error) {
        console.error('Error deleting cookie:', error);
        throw error;
    }
}
