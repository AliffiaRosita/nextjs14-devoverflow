import Link from 'next/link';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import RenderTag from '@/components/shared/RenderTag';
import SkillBadge from '@/components/shared/SkillBadge';

interface Skill {
    _id: string;
    name: string;
}

interface User {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
    skills: Skill[];
}

interface Props {
    user: User;
}

const ReferralUserCard = ({ user }: Props) => {
    return (
        <Link
            href={`/profile/${user.clerkId}`}
            className="shadow-light100_darknone w-full xs:w-[244px]">
            <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
                <Image
                    src={user.picture}
                    alt={`${user.name}'s profile picture`}
                    width={100}
                    height={100}
                    className="rounded-full"
                />
                <div className="mt-4 text-center">
                    <h3 className="h3-bold text-dark200_light900 line-clamp-1">
                        {user.name}
                    </h3>
                    <p className="body-regular text-dark500_light500 mt-2">
                        @{user.username}
                    </p>
                </div>

                <div className="mt-5 min-h-[56px]">
                    {user.skills.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {user.skills.slice(0, 3).map(skill => (
                                <RenderTag
                                    key={skill._id}
                                    _id={skill._id}
                                    name={skill.name}
                                    size="small"
                                />
                            ))}
                            {user.skills.length > 3 && (
                                <SkillBadge
                                    size="small"
                                    text={`+${user.skills.length - 3} Skills`}
                                />
                            )}
                        </div>
                    ) : (
                        <Badge className="text-dark500_light700">
                            No Skills yet
                        </Badge>
                    )}
                </div>
            </article>
        </Link>
    );
};

export default ReferralUserCard;
