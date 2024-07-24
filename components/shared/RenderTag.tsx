import Link from "next/link";

import SkillBadge from "./SkillBadge";

interface Props {
    _id: string;
    name: string;
    totalQuestions?: number;
    showCount?: boolean;
    size?: 'normal' | 'small' ;
}

const RenderTag = ({ _id, name, totalQuestions, showCount, size = "small" }: Props) => {
    return (
        <Link prefetch={false} href={`/skills/${_id}`} className="flex justify-between gap-2">
            <SkillBadge size={size} text={name} />
            {showCount && (
                <p className="small-medium text-dark500_light700">
                    {totalQuestions}
                </p>
            )}
        </Link>
    );
};

export default RenderTag;
