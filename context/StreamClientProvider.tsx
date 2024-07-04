"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";

import { streamTokenProvider } from "@/lib/actions/stream.actions";
import { getStreamUserData } from "@/lib/actions/user.action";

import Loader from "@/components/shared/Loader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const createStreamUser = async () => {
      try {
        if (!isLoaded || !user) return;
        if (!API_KEY) throw new Error("Stream API key is missing");

        const streamUser = await getStreamUserData(user.id);

        if (!streamUser) throw new Error("Stream User is not exist");

        const client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: streamUser.id,
            name: streamUser.name,
            image: streamUser.image,
          },
          tokenProvider: async () => {
            return await streamTokenProvider(user.id);
          },
        });

        setVideoClient(client);
      } catch (error) {
        console.log(error);
      }
    };

    createStreamUser();
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
