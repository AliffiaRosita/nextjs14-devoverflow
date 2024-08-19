'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { URLProps } from '@/types';
import ReferralHandler from './components/ReferralHandler';
import FormText from '../../components/input';
import Button from '../../components/button';
import GoogleButton from '../../components/googleButton';
import ClickableText from '../../components/clickableText';

export default function Page({ searchParams }: URLProps) {
    const { referral } = searchParams;

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        const isValidPassword = password.length >= 8;
        setIsFormValid(isValidEmail && isValidPassword);
    }, [email, password]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseUrl}/api/auth/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to sign up');
            }

            await response.json();

            router.push(`/verify-account?email=${encodeURIComponent(email)}`);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <>
            <ReferralHandler referral={referral} />

            <div className="w-full max-w-md p-3">
                <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-5 shadow-lg dark:border-gray-700">
                    <p className="text-center text-lg font-bold">
                        Create your account
                    </p>
                    <p className="mb-10 text-center text-sm text-gray-500">
                        Welcome! Please fill in the details to get started.
                    </p>

                    {error && (
                        <div className="mb-4 relative border rounded-lg bg-red-100 p-2 border-red-300 text-center text-sm text-red-600">
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="text-sm absolute top-1 right-0 p-1 text-red-600 hover:text-red-800">
                                x
                            </button>
                        </div>
                    )}

                    <FormText
                        placeholder="Your email address"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <FormText
                        placeholder="Your password"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <Button
                        id="btn"
                        buttonName={loading ? 'Signing up...' : 'Sign up'}
                        onClick={handleSignUp}
                        disabled={!isFormValid || loading}
                    />

                    <p className="my-3 text-center text-sm text-gray-500">or</p>

                    <GoogleButton
                        id="btn"
                        buttonName="Sign up with Google"
                        onClick={() => {}}
                    />

                    <div className="flex flex-wrap justify-center">
                        <p className="mr-2 text-sm text-gray-500">
                            {`Already have an account?`}
                        </p>
                        <ClickableText
                            id="to-sign-in"
                            text="Sign in"
                            href="/sign-in"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
