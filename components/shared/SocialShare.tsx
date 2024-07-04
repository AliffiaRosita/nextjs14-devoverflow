"use client";
import Image from "next/image";
import { useState } from "react";
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

const SocialShare = ({ id }: { id: String }) => {
	const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const [show, setShow] = useState<boolean>(false);
	const shareUrl = `${baseUrl}/question/${id}`;
	const handleToggle = () => setShow(!show);
	return (
		<div className="relative">
			<div className="flex-center flex-wrap gap-1">
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
					Share
				</a>
			</div>
			{show && (
				<div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg">
					<div className="flex justify-around px-2">
						<FacebookShareButton url={shareUrl}>
							<FacebookIcon size={40} round />
						</FacebookShareButton>
						<TwitterShareButton url={shareUrl}>
							<TwitterIcon size={40} round />
						</TwitterShareButton>
						<LinkedinShareButton url={shareUrl}>
							<LinkedinIcon size={40} round />
						</LinkedinShareButton>
						<WhatsappShareButton url={shareUrl}>
							<WhatsappIcon size={40} round />
						</WhatsappShareButton>
					</div>
				</div>
			)}
		</div>
	);
};

export default SocialShare;
