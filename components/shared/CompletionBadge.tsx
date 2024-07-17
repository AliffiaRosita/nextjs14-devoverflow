import { Hand, Check } from "lucide-react";
import { Badge } from "../ui/badge";

const CompletionBadge = ({ mark }: { mark: string }) => {
	const completionBadge = {
		style: "bg-amber-200 text-amber-800",
		icon: <Hand size="14" />,
		text: "Not Solved",
	};

	if (mark === "solved") {
		completionBadge.style = "bg-emerald-200 text-emerald-800";
		completionBadge.icon = <Check size="14" />;
		completionBadge.text = "Solved";
	}

	const {
		style: completionStyle,
		icon: completionIcon,
		text: completionText,
	} = completionBadge;

	return (
		<Badge
			className={`subtle-medium mb-5 ${completionStyle} rounded-md border-none px-4 py-2 capitalize`}
		>
			<div className="flex-center flex gap-3">
				{completionIcon}
				<span>{completionText}</span>
			</div>
		</Badge>
	);
};

export default CompletionBadge;
