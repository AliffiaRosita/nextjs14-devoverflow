"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import { UserResponse } from "@stream-io/video-react-sdk";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface VideoCallCardProps {
  title: string;
  date: string;
  createdBy: UserResponse | undefined;
  onClick: () => void;
}

const VideoCallCard = ({
  title,
  date,
  onClick,
  createdBy,
}: VideoCallCardProps) => {
  const avatarImg = useMemo(() => createdBy?.image ?? "", [createdBy]);
  const handleClick = useCallback(onClick, [onClick]);

  return (
    <section className="flex min-h-[200px] w-full flex-col justify-between rounded-[14px] bg-light-700 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-dark100_light900 text-2xl font-bold">
              {title}
            </h1>
            <p className="text-dark100_light900 text-base font-normal">
              {date}
            </p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        <div className="relative flex w-full max-sm:hidden">
          <Image
            src={avatarImg}
            alt="attendees"
            width={40}
            height={40}
            className="rounded-full"
            style={{ top: 0, left: 0 }}
          />
          <div className="flex-center ml-2 flex">By {createdBy?.name}</div>
        </div>
        <Button
          type="submit"
          className="bg-red-500 text-white"
          disabled={false}
          onClick={handleClick}
        >
          Join
        </Button>
      </article>
    </section>
  );
};

export default VideoCallCard;
