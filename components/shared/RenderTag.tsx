import Link from "next/link";

import { Badge } from "@/components/ui/badge";

interface Props {
    _id: string;
    name: string;
    totalQuestions?: number;
    showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
    return (
        <Link prefetch={false} href={`/skills/${_id}`} className="flex justify-between gap-2">
            <Badge className="subtle-semibold light:border-none rounded-md bg-cyan-200 px-4 py-2 uppercase text-cyan-600 dark:border-cyan-600 dark:bg-dark-300">
                {name}
            </Badge>
            {showCount && (
                <p className="small-medium text-dark500_light700">
                    {totalQuestions}
                </p>
            )}
        </Link>
    );
};

export default RenderTag;
