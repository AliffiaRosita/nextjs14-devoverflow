"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface MeetingCardProps {
  title: string;
  date: string;
}

const MeetingCard = ({ title, date }: MeetingCardProps) => {
  const avatarImages = [
    "/assets/images/avatar-1.jpeg",
    "/assets/images/avatar-2.jpeg",
    "/assets/images/avatar-3.png",
    "/assets/images/avatar-4.png",
    "/assets/images/avatar-5.png",
  ];

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
          {avatarImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="attendees"
              width={40}
              height={40}
              className={cn("rounded-full", { absolute: index > 0 })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-500 bg-dark-500">
            +5
          </div>
        </div>
      </article>
    </section>
  );
};

export default MeetingCard;
