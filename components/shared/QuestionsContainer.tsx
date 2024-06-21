"use client";
import React, { useState } from "react";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import LiveVideoCall from "./LiveVideoCall";
import { QuestionProps } from "@/types";

const QuestionsContainer = ({
  questions,
  clerkId,
}: {
  questions: QuestionProps[];
  clerkId: string;
  handleClick: () => void;
}) => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const [isVideoCallModalOpen, setIsVideoCallModalOpen] =
    useState<boolean>(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<null | string>(
    null
  );

  const startRoom = async () => {
    if (!client || !selectedQuestionId) return;
    const newCall = client.call("default", selectedQuestionId!);
    await newCall.getOrCreate({
      data: {
        starts_at: new Date().toISOString(),
      },
    });
    router.push(`/call/${selectedQuestionId}`);
    setSelectedQuestionId(null);
  };

  if (!clerkId || !questions?.length) {
    return null;
  }

  return (
    <>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              clerkId={clerkId}
              title={question.title}
              skills={question.skills}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={new Date(question.createdAt)}
              handleOpenVideoCallModal={() => {
                setIsVideoCallModalOpen(true);
                setSelectedQuestionId(question._id);
              }}
            />
          ))
        ) : (
          <NoResult
            title="No Questions Found"
            description="Be the first to break the silence! 🚀 Post a Problem and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/post-problem"
            linkTitle="Post a Problem"
          />
        )}
      </div>

      <Modal
        isOpen={isVideoCallModalOpen}
        onClose={() => {
          setIsVideoCallModalOpen(false);
          setSelectedQuestionId(null);
        }}
        title="Start a Video Call"
        className="text-center"
      >
        <LiveVideoCall id={selectedQuestionId} handleClick={startRoom} />
      </Modal>
    </>
  );
};

export default QuestionsContainer;
