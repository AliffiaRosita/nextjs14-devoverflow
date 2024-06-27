"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { getUserById, updateUser } from "./user.action";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.NEXT_STREAM_SECRET_KEY;

export const streamTokenProvider = async (userId: string) => {
  try {
    const user = await getUserById({ userId });

    if (!user) throw new Error("User is not exist");
    if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
    if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

    if (user?.streamToken) return user.streamToken;

    const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const streamToken = streamClient.createToken(userId, issuedAt);

    await updateUser({
      clerkId: userId,
      updateData: {
        streamToken,
      },
      path: "",
    });

    return streamToken;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get token");
  }
};
