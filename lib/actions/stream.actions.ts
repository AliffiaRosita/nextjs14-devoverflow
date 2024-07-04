"use server";

import { StreamClient, UserObjectRequest } from "@stream-io/node-sdk";
import { getUserById, updateUser } from "./user.action";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.NEXT_STREAM_SECRET_KEY;

export const streamTokenProvider = async (userId: string) => {
  try {
    const user = await getUserById({ userId });

    if (!user) throw new Error("User is not exist");
    if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
    if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

    const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

    const newUser: UserObjectRequest = {
      id: userId,
      role: "user",
      custom: {
        email: user.email,
        username: user.username,
      },
      name: user.name || user.username || user.id,
      image: user.pictures,
    };

    await streamClient.upsertUsers({
      users: {
        [newUser.id]: newUser,
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
