import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';

import RenderTag from '@/components/shared/RenderTag';
import Metric from '@/components/shared/Metric';
import EditDeleteAction from '@/components/shared/EditDeleteAction';

import { getFormattedNumber, getTimestamp } from '@/lib/utils';

import SocialShare from '../shared/SocialShare';
import IconButton from '../shared/IconButton';
import QuickVotes from '../shared/QuickVotes';
import CompletionBadge from '../shared/CompletionBadge';

import { faSkype, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
    faVideo,
    //   faPhoneAlt,
    faVideoCamera,
    faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { QuestionProps } from '@/types';
import { useRouter } from 'next/navigation';
import { ShowMore } from '../shared/ShowMore';

const QuestionCard = ({
    _id,
    title,
    content,
    skills,
    author,
    upvotes,
    downvotes,
    views,
    shares,
    answers,
    createdAt,
    clerkId,
    mongoUserId,
    mark,
}: QuestionProps) => {
    const isUserAuthor = clerkId && clerkId === author.clerkId;

    const router = useRouter();

    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <SignedIn>
                {isUserAuthor && (
                    <EditDeleteAction
                        type="Question"
                        itemId={JSON.stringify(_id)}
                    />
                )}
            </SignedIn>

            <div className="mt-2 flex flex-col-reverse items-start justify-between sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
                        {getTimestamp(createdAt)}
                    </span>
                    <Link prefetch={false} href={`/question/${_id}`}>
                        <h3 className="sm:h3-semibold base-semibold line-clamp-2 flex-1 text-primary-500 hover:text-blue-500">
                            {title}
                        </h3>
                    </Link>
                </div>
                <div className="flex justify-end">
                    <CompletionBadge mark={mark} />
                </div>
            </div>

            <div>
                <ShowMore
                    text={content}
                    maxLength={35}
                    link={`/question/${_id}`}
                />
            </div>

            <div className="mt-3.5 flex flex-wrap gap-2">
                {skills.map(skill => (
                    <RenderTag
                        key={skill._id}
                        _id={skill._id}
                        name={skill.name}
                    />
                ))}
            </div>

            <div className=" mt-6 w-full flex-col flex-wrap ">
                <div className="mt-3 flex justify-between gap-3 max-sm:flex-wrap">
                    <Metric
                        imgUrl={author.picture}
                        alt="user"
                        value={author.name}
                        title={` • asked ${getTimestamp(createdAt)}`}
                        href={`/profile/${author.clerkId}`}
                        isAuthor
                        textStyles="body-medium text-dark400_light700"
                    />
                    {mark !== 'solved' && (
                        <div className="flex gap-3">
                            <IconButton
                                onClick={() => {
                                    router.push(`/call/${_id}`);
                                }}
                                type="button"
                                color={'blue'}
                                icon={faVideoCamera}
                                text={'Video Call'}
                            />
                            {/* <IconButton
                            onClick={() => {}}
                            type="button"
                            color={"green"}
                            icon={faPhoneAlt}
                            text={"Voice Call"}
                        /> */}
                            <IconButton
                                onClick={() => {
                                    router.push(
                                        `/message${!isUserAuthor ? `?userId=${author.clerkId}` : ''}`,
                                    );
                                }}
                                type="button"
                                color={'red'}
                                icon={faMessage}
                                text={'Message'}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-6 max-sm:flex-wrap max-sm:justify-start">
                    <div className=" flex gap-3">
                        <QuickVotes
                            questionId={_id}
                            mongoUserId={mongoUserId}
                            upVotes={upvotes}
                            downVotes={downvotes}
                        />

                        <Metric
                            href={`/question/${_id}`}
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
                        <SocialShare id={_id} shares={shares} />
                    </div>

                    <div className="flex gap-3">
                        {author?.whatsapp && (
                            <IconButton
                                link={`https://wa.me/${author?.whatsapp}`}
                                color={'green'}
                                icon={faWhatsapp}
                                text={'Whatsapp'}
                            />
                        )}
                        {author?.googleMeet && (
                            <IconButton
                                image={'/assets/images/gMeet.png'}
                                color={'lightBlue'}
                                text={'Google Meet'}
                                link={`${author?.googleMeet}`}
                            />
                        )}
                        {author?.zoom && (
                            <IconButton
                                link={`${author?.zoom}`}
                                color={'blue'}
                                icon={faVideo}
                                text={'Zoom'}
                            />
                        )}
                        {author?.teams && (
                            <IconButton
                                image={'/assets/images/teams.png'}
                                color={'purple'}
                                text={'Teams'}
                                link={`${author?.teams}`}
                            />
                        )}
                        {author?.skype && (
                            <IconButton
                                link={`${author?.skype}`}
                                color={'lightBlue'}
                                icon={faSkype}
                                text={'Skype'}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
