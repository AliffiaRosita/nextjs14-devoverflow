"use client";

import { usePathname, useRouter } from "next/navigation";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
	type: string;
	itemId: string;
}
const EditDeleteAction = ({ type, itemId }: Props) => {
	const pathname = usePathname();
	const router = useRouter();

	const handleEdit = () => {
		if (type === "Question") {
			router.push(`/question/edit/${JSON.parse(itemId)}`);
		} else if (type === "Answer") {
			router.push(`/edit-answer/${JSON.parse(itemId)}`);
		}
	};

	const handleDelete = async () => {
		if (type === "Question") {
			await deleteQuestion({
				questionId: JSON.parse(itemId),
				path: pathname,
				isQuestionPath: pathname === `/question/${JSON.parse(itemId)}`,
			});
		} else if (type === "Answer") {
			await deleteAnswer({
				answerId: JSON.parse(itemId),
				path: pathname,
			});
		}
	};

	return (
		<div className="flex items-center justify-end gap-3 max-sm:w-full">
			<Button
				className="primary-gradient min-h-[20px] px-4 py-3 !text-light-900"
				onClick={handleEdit}
			>
				{/* <Image
					src="/assets/icons/edit.svg"
					alt="Edit"
					width={14}
					height={14}
					className="cursor-pointer"
					onClick={handleEdit}
				/> */}
				<FontAwesomeIcon
					color="white"
					width={14}
					height={14}
					icon={faEdit}
				/>
			</Button>

			<Button
				className="min-h-[20px] bg-red-500 px-4  !text-light-900"
				onClick={handleDelete}
			>
				<FontAwesomeIcon
					color="white"
					width={14}
					height={14}
					icon={faTrash}
				/>
			</Button>
			{/* <Image
				src="/assets/icons/trash.svg"
				alt="Delete"
				width={14}
				height={14}
				className="cursor-pointer"
				onClick={handleDelete}
			/> */}
		</div>
	);
};

export default EditDeleteAction;
