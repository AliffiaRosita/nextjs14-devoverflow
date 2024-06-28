import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetLiveCalls = (questionId: string | null) => {
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !questionId) return;

      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            // ongoing: true,
            "custom.questionId": questionId,
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [questionId, client]);

  return { liveCalls: calls, isLoading };
};
