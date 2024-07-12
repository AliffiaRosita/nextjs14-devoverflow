import { BADGE_CRITERIA } from "@/constants";

export interface FilterProps {
	name: string;
	value: string;
}

export interface ThemeOption {
	label: string;
	value: string;
	icon: string;
}

export interface SidebarLink {
	imgURL: string;
	route: string;
	label: string;
}

export interface Job {
	id?: string;
	employer_name?: string;
	employer_logo?: string | undefined;
	employer_website?: string;
	job_employment_type?: string;
	job_title?: string;
	job_description?: string;
	job_apply_link?: string;
	job_city?: string;
	job_state?: string;
	job_country?: string;
}

export interface Country {
	name: {
		common: string;
	};
}

export interface ParamsProps {
	params: { id: string };
}

export interface SearchParamsProps {
	searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
	params: { id: string };
	searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
	GOLD: number;
	SILVER: number;
	BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export interface UrlQueryParams {
	params: string;
	key: string;
	value: string | null;
}

export interface RemoveUrlQueryParams {
	params: string;
	keysToRemove: string[];
}

export interface BadgeParams {
	criteria: {
		type: keyof typeof BADGE_CRITERIA;
		count: number;
	}[];
}

export interface QuestionProps {
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
	mark: string;
}
