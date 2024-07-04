"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { getStreamUserData, updateUser } from "./user.action";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.NEXT_STREAM_SECRET_KEY;

export const streamTokenProvider = async (userId: string) => {
  try {
    const streamUser = await getStreamUserData(userId);
    if (!streamUser) throw new Error("Stream User is not exist");
    if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
    if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

    const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

    await streamClient.upsertUsers({
      users: {
        [streamUser.id]: streamUser,
      },
    });

    const streamToken = streamClient.createToken(userId);

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
