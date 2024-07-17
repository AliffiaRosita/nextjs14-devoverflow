"use client";

import { shareQuestion } from "@/lib/actions/interaction.action";
import Image from "next/image";
import { useCallback, useState } from "react";
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { toast } from "../ui/use-toast";

const SocialShare = ({ id, shares }: { id: String, shares: number }) => {
	const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const [show, setShow] = useState<boolean>(false);
	const [shareCount, setShareCount] = useState<number>(shares);
	const shareUrl = `${baseUrl}/question/${id}`;
	const handleToggle = () => setShow(!show);

	const handleShare = useCallback(
		async () => {
		  try {
			const shareCount = await shareQuestion(id);

			setShareCount(shareCount);
	
			toast({
			  title: `Question shared successfully 🎉`,
			});

		  } catch (error) {
			toast({
			  title: "Error",
			  description: `Failed to share the question. Please try again later.`,
			  variant: "destructive",
			});
		  }
		},
		[id]
	  );

	return (
		<div className="relative">
			<div className="flex-center flex-wrap gap-1 text-center">
				<Image
					src={"/assets/icons/link.svg"}
					alt={"share"}
					width={16}
					height={16}
					className="object-contain"
				/>
				<a
					className="small-medium text-dark400_light800 hover:cursor-pointer"
					onClick={handleToggle}
				>
					<p>
						{shareCount}
						<span className="max-[405px]:hidden"> Share</span>
					</p>
				</a>
			</div>
			{show && (
				<div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg">
					<div className="flex justify-around px-2">
						<FacebookShareButton url={shareUrl} onClick={handleShare}>
							<FacebookIcon size={40} round />
						</FacebookShareButton>
						<TwitterShareButton url={shareUrl} onClick={handleShare}>
							<TwitterIcon size={40} round />
						</TwitterShareButton>
						<LinkedinShareButton url={shareUrl} onClick={handleShare}>
							<LinkedinIcon size={40} round />
						</LinkedinShareButton>
						<WhatsappShareButton url={shareUrl} onClick={handleShare}>
							<WhatsappIcon size={40} round />
						</WhatsappShareButton>
					</div>
				</div>
			)}
		</div>
	);
};

export default SocialShare;
