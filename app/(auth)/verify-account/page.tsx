'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type Timeout = ReturnType<typeof setTimeout>

export default function Page() {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendOTPLoading, setResendOTPLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendAvailable, setResendAvailable] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        let countdown: Timeout;

        if (timer > 0 && !resendAvailable) {
            countdown = setTimeout(() => setTimer(timer - 1), 1000);
        } else if (timer === 0) {
            setResendAvailable(true);
            setTimer(30);
        }

        return () => clearTimeout(countdown);
    }, [timer, resendAvailable]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const value = e.target.value;
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                const nextInput = document.getElementById(
                    `otp-input-${index + 1}`,
                );
                nextInput?.focus();
            }
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    const handleVerify = async () => {
        setVerifyLoading(true);
        setError('');

        try {
            const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to verify');
            }

            alert('OTP verified successfully!');
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendOTPLoading(true);
        setError('');

        try {
            const response = await fetch(`${baseUrl}/api/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to resend');
            }

            setResendAvailable(false); // Disable the resend button
            setTimer(30); // Start the countdown again
            alert('OTP resent successfully!');
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setResendOTPLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-3">
            <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-5 shadow-lg dark:border-gray-700">
                <p className="text-center text-lg font-bold">
                    Verify Your Email
                </p>
                <p className="text-center text-sm text-gray-500">
                    We sent a verification code to{' '}
                    <span className="font-semibold">{email}</span>.
                </p>
                <p className="mb-10 text-center text-sm text-gray-500">
                    Please enter the code below.
                </p>

                {error && (
                    <p className="mb-4 text-center text-red-500">{error}</p>
                )}

                <div className="flex justify-between mb-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleInputChange(e, index)}
                            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={!isOtpComplete || verifyLoading}
                    className={`w-full py-2 px-4 text-white text-sm font-medium rounded-lg ${isOtpComplete ? 'bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`}>
                    {verifyLoading ? 'Verifying...' : 'Verify'}
                </button>

                <button
                    onClick={handleResendOtp}
                    disabled={resendOTPLoading || !resendAvailable}
                    className={`w-full mt-4 py-2 px-4 text-blue-600 text-sm font-medium rounded-lg border border-blue-600 ${!resendAvailable && 'cursor-not-allowed'}`}>
                    {resendOTPLoading
                        ? 'Resending...'
                        : resendAvailable
                          ? 'Resend OTP'
                          : `Resend OTP in ${timer}s`}
                </button>
            </div>
        </div>
    );
}
