'use server';
import { cookies } from 'next/headers';

export async function setCookies(cookiesData) {
    try {
        if (!cookiesData) throw new Error('cookies data is not exist');

        if (typeof cookiesData === 'object' && !Array.isArray(cookiesData)) {
            cookies().set(cookiesData);
        }

        if (Array.isArray(cookiesData)) {
            cookiesData.forEach(cookie => {
                cookies().set(cookie);
            });
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
