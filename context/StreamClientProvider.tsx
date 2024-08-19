'use client';

import { ReactNode, useMemo } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';

import Loader from '@/components/shared/Loader';
import { StreamUserProps } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ streamUser, streamToken, children }: { streamUser: StreamUserProps, streamToken: string, children: ReactNode }) => {
 
	const videoClient = useMemo(() => {
        if (!API_KEY) return null;

        return new StreamVideoClient({
            apiKey: API_KEY,
            user: {
                id: streamUser.id,
                name: streamUser.name,
                image: streamUser.image,
            },
            token: streamToken,
        });
    }, []);

    if (!videoClient) return <Loader />;


    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
