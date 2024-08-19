'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const VideoCallError = ({
    message = 'Something went wrong!',
}: {
    message?: string;
}) => {
    const router = useRouter();

    const handleGoBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <div className="flex-center flex flex-col gap-2">
            <div>
                <p className="text-light400_light500 h3-semibold mt-1 font-bold capitalize">
                    {message}
                </p>
            </div>
            <Button
                className="rounded-md bg-red-500 px-4 py-2.5 text-white"
                onClick={handleGoBack}>
                <ArrowLeft size={20} />
                Go Back
            </Button>
        </div>
    );
};

export default VideoCallError;
