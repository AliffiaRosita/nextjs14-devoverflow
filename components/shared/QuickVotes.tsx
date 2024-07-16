"use client";

import { useState, useCallback, useMemo } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getFormattedNumber } from "@/lib/utils";
import {
  upvoteQuestion,
  downvoteQuestion,
} from "@/lib/actions/question.action";
import { toast } from "../ui/use-toast";

const QuickVotes = ({
  questionId,
  mongoUserId,
  upVotes,
  downVotes,
}: {
  questionId: string;
  mongoUserId?: string;
  upVotes: string[];
  downVotes: string[];
}) => {
  const [votesState, setVotesState] = useState({
    upVotesCount: upVotes.length,
    downVotesCount: downVotes.length,
    isUpVoted: !!mongoUserId && upVotes.includes(mongoUserId),
    isDownVoted: !!mongoUserId && downVotes.includes(mongoUserId),
  });

  const handleVote = useCallback(
    async (action: "upvote" | "downvote") => {
      if (!mongoUserId) {
        return toast({
          title: "Not signed in",
          description: "You need to be signed in to vote ⚠️",
        });
      }

      try {
        const question =
          action === "upvote"
            ? await upvoteQuestion({
                questionId,
                userId: mongoUserId,
                hasupVoted: votesState.isUpVoted,
                hasdownVoted: votesState.isDownVoted,
                path: "",
              })
            : await downvoteQuestion({
                questionId,
                userId: mongoUserId,
                hasupVoted: votesState.isUpVoted,
                hasdownVoted: votesState.isDownVoted,
                path: "",
              });

        const { upvotes, downvotes } = question;

        setVotesState({
          upVotesCount: upvotes.length,
          downVotesCount: downvotes.length,
          isUpVoted: !!mongoUserId && upvotes.includes(mongoUserId),
          isDownVoted: !!mongoUserId && downvotes.includes(mongoUserId),
        });

        toast({
          title: `${action === "upvote" ? "Upvote" : "Downvote"} ${!votesState.isUpVoted ? "added" : "removed"} 🎉`,
          variant: !votesState.isUpVoted ? "default" : "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to ${action} the question. Please try again later.`,
          variant: "destructive",
        });
      }
    },
    [votesState, mongoUserId, questionId]
  );

  const upVotesCountFormatted = useMemo(
    () => getFormattedNumber(votesState.upVotesCount),
    [votesState.upVotesCount]
  );
  const downVotesCountFormatted = useMemo(
    () => getFormattedNumber(votesState.downVotesCount),
    [votesState.downVotesCount]
  );

  return (
    <div className="relative">
      <div className="flex-center flex-wrap gap-3">
        <a
          className="small-medium text-dark400_light800 hover:cursor-pointer"
          onClick={() => handleVote("upvote")}
        >
          <div className="flex-center flex flex-wrap gap-1">
            <ThumbsUp
              color={!votesState.isUpVoted ? "#697C89" : "none"}
              fill={votesState.isUpVoted ? "#008DDA" : "none"}
              size={14}
            />
            {upVotesCountFormatted} Up
          </div>
        </a>

        <a
          className="small-medium text-dark400_light800 hover:cursor-pointer"
          onClick={() => handleVote("downvote")}
        >
          <div className="flex-center flex flex-wrap gap-1">
            <ThumbsDown
              color={!votesState.isDownVoted ? "#697C89" : "none"}
              fill={votesState.isDownVoted ? "#ef4444" : "none"}
              size={14}
            />
            {downVotesCountFormatted} Down
          </div>
        </a>
      </div>
    </div>
  );
};

export default QuickVotes;
