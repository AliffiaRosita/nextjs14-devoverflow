import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

import RenderTag from "@/components/shared/RenderTag";
import Metric from "@/components/shared/Metric";
import EditDeleteAction from "@/components/shared/EditDeleteAction";

import { getFormattedNumber, getTimestamp } from "@/lib/utils";

import SocialShare from "../shared/SocialShare";
import ContactButton from "../shared/ContactButton";
import {
    faMicrosoft,
    faSkype,
    faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
interface QuestionProps {
    _id: string;
    title: string;
    skills: Array<{ _id: string; name: string }>;
    author: {
        _id: string;
        name: string;
        picture: string;
        clerkId: string;
        whatsapp?: string;
        zoom?: string;
        googleMeet?: string;
        skype?: string;
        teams: string;
    };
    upvotes: string[];
    views: number;
    answers: Array<object>;
    createdAt: Date;
    clerkId?: string | null;
}

const QuestionCard = ({
    _id,
    title,
    skills,
    author,
    upvotes,
    views,
    answers,
    createdAt,
    clerkId,
}: QuestionProps) => {
    const showActionButtons = clerkId && clerkId === author.clerkId;
    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
                        {getTimestamp(createdAt)}
                    </span>
                    <Link href={`/question/${_id}`}>
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2 flex-1">
                            {title}
                        </h3>
                    </Link>
                </div>

                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type="Question"
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <RenderTag
                        key={skill._id}
                        _id={skill._id}
                        name={skill.name}
                    />
                ))}
            </div>

            <div className=" mt-6 flex-col w-full flex-wrap ">
                <div className="flex justify-between gap-3 mt-3 max-sm:flex-wrap max-sm:justify-start">
                    <Metric
                        imgUrl={author.picture}
                        alt="user"
                        value={author.name}
                        title={` • asked ${getTimestamp(createdAt)}`}
                        href={`/profile/${author._id}`}
                        isAuthor
                        textStyles="body-medium text-dark400_light700"
                    />
                </div>

                <div className="flex items-center justify-between gap-3 mt-3 max-sm:flex-wrap max-sm:justify-start">
                    <div className=" flex gap-3">
                        <Metric
                            imgUrl="/assets/icons/like.svg"
                            alt="Upvotes"
                            value={getFormattedNumber(upvotes.length)}
                            title=" Votes"
                            textStyles="small-medium text-dark400_light800"
                        />
                        <Metric
                            imgUrl="/assets/icons/message.svg"
                            alt="Message"
                            value={getFormattedNumber(answers.length)}
                            title=" Answers"
                            textStyles="small-medium text-dark400_light800"
                        />
                        <Metric
                            imgUrl="/assets/icons/eye.svg"
                            alt="Eye"
                            value={getFormattedNumber(views)}
                            title=" Views"
                            textStyles="small-medium text-dark400_light800"
                        />
                        <SocialShare id={_id} />
                    </div>

                    <div className="flex gap-3">
                        {author?.whatsapp && (
                            <ContactButton
                                link={`https://wa.me/${author?.whatsapp}`}
                                color={"green"}
                                icon={faWhatsapp}
                                text={"Whatsapp"}
                            />
                        )}
                        {author?.googleMeet && (
                            <ContactButton
                                image={"/assets/images/gMeet.png"}
                                color={"lightBlue"}
                                text={"Google Meet"}
                                link={`${author?.googleMeet}`}
                            />
                        )}
                        {author?.zoom && (
                            <ContactButton
                                link={`${author?.zoom}`}
                                color={"blue"}
                                icon={faVideo}
                                text={"Zoom"}
                            />
                        )}
                        {author?.teams && (
                            <ContactButton
                                image={"/assets/images/teams.png"}
                                color={"purple"}
                                text={"Teams"}
                                link={`${author?.teams}`}
                            />
                        )}
                        {author?.skype && (
                            <ContactButton
                                link={`${author?.skype}`}
                                color={"lightBlue"}
                                icon={faSkype}
                                text={"Skype"}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
