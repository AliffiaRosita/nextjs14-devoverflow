import { streamTokenProvider } from "@/lib/actions/stream.actions";
import { getStreamUserData } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const useInitializeChatClient = () => {
	const { user } = useUser();
	const [chatClient, setChatClient] = useState<StreamChat | null>(null);

	useEffect(() => {
		if (!user?.id) return;

		const client = StreamChat.getInstance(
			process.env.NEXT_PUBLIC_STREAM_API_KEY || ""
		);

		const createStreamUser = async () => {
			try {
				const streamUser = await getStreamUserData({ userId: user.id });

				if (!streamUser) throw new Error("Stream User is not exist");

				client
					.connectUser(
						{
							id: streamUser.id,
							name: streamUser.name,
							image: streamUser.image,
						},
						async () => {
							return await streamTokenProvider(user.id);
						}
					)
					.catch((error) =>
						console.error("Failed to connect user", error)
					)
					.then(() => setChatClient(client));
			} catch (error) {
				console.log(error);
			}
		};

		createStreamUser();

		return () => {
			setChatClient(null);
			client
				.disconnectUser()
				.catch((error) =>
					console.error("Failed to disconnect user", error)
				)
				.then(() => console.log("Connection closed"));
		};
	}, [user]);

	return chatClient;
};

export default useInitializeChatClient;
