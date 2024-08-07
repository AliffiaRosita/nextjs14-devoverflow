import type { FilterProps } from "@/types";

export const UserFilters: FilterProps[] = [
    { name: "New Users", value: "new_users" },
    { name: "Old Users", value: "old_users" },
    { name: "Top Contributors", value: "top_contributors" },
];

export const QuestionFilters: FilterProps[] = [
    { name: "Most Recent", value: "most_recent" },
    { name: "Oldest", value: "oldest" },
    { name: "Most Voted", value: "most_voted" },
    { name: "Most Viewed", value: "most_viewed" },
    { name: "Most Answered", value: "most_answered" },
];

export const AnswerFilters: FilterProps[] = [
    { name: "Highest Upvotes", value: "highestUpvotes" },
    { name: "Lowest Upvotes", value: "lowestUpvotes" },
    { name: "Most Recent", value: "recent" },
    { name: "Oldest", value: "old" },
];

export const SkillsFilters: FilterProps[] = [
    { name: "Popular", value: "popular" },
    { name: "Recent", value: "recent" },
    { name: "Name", value: "name" },
    { name: "Old", value: "old" },
];

export const HomePageFilters: FilterProps[] = [
    { name: "Newest", value: "newest" },
    { name: "Recommended", value: "recommended" },
    { name: "Frequent", value: "frequent" },
    { name: "Unanswered", value: "unanswered" },
];

export const JobPageFilters: FilterProps[] = [
    { name: "Full-time", value: "fulltime" },
    { name: "Part-time", value: "parttime" },
    { name: "Contractor", value: "contractor" },
    { name: "Internship", value: "intern" },
];

export const GlobalSearchFilters: FilterProps[] = [
    { name: "Problem", value: "problem" },
    { name: "Solution", value: "solution" },
    { name: "User", value: "user" },
    { name: "Skill", value: "skill" },
];
