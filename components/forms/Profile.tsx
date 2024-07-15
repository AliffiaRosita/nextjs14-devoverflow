"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { updateUser } from "@/lib/actions/user.action";
import { ProfileValidation } from "@/lib/validations";

import type { ClerkId } from "@/lib/actions/shared.types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props extends ClerkId {
	user: string;
	skills: string;
}
const Profile = ({ clerkId, user, skills }: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const parsedUser = JSON.parse(user);
	const parsedSkills = skills && JSON.parse(skills);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const groupedSkills = parsedUser?.skills?.map((skill: any) => skill.name);
	const [listSkills, setListSkills] = useState(parsedSkills);

	const form = useForm<z.infer<typeof ProfileValidation>>({
		resolver: zodResolver(ProfileValidation),
		defaultValues: {
			name: parsedUser?.name || "",
			username: parsedUser?.username || "",
			portfolioWebsite: parsedUser?.portfolioWebsite || "",
			location: parsedUser?.location || "",
			whatsapp: parsedUser?.whatsapp || "",
			googleMeet: parsedUser?.googleMeet || "",
			zoom: parsedUser?.zoom || "",
			skype: parsedUser?.skype || "",
			teams: parsedUser?.teams || "",
			skills: groupedSkills || [],
			bio: parsedUser?.bio || "",
		},
	});

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: any
	) => {
		const skillInput = e.target as HTMLInputElement;
		const skillValue = skillInput.value.trim();

		if (e.key === "Enter" && field.name === "skills") {
			e.preventDefault();

			if (skillValue !== "") {
				if (!field.value.includes(skillValue as never)) {
					form.setValue("skills", [...field.value, skillValue]);
					skillInput.value = "";
					form.clearErrors("skills");
				} else {
					form.trigger();
				}
			}
		} else {
			// Filter skills based on input value and skills already in the form
			const skillValueForm = form.getValues("skills");
			const filteredSkill = parsedSkills.filter((skill: any) => {
				return (
					skill.name.includes(skillValue) &&
					!skillValueForm.includes(skill.name)
				);
			});

			setListSkills(filteredSkill);
		}
	};

	const handleSkillRemove = (skill: string, field: any) => {
		const updatedSkills = field.value.filter((t: string) => t !== skill);
		form.setValue("skills", updatedSkills);

		// Mengembalikan skill yang dihapus ke daftar listSkills
		const filteredSkillAll = parsedSkills.filter(
			(s: any) => !updatedSkills.includes(s.name)
		);
		setListSkills(filteredSkillAll);
	};

	const handleSkillPress = (name: string) => {
		const lists = form.getValues("skills");
		// Only add the skill if it doesn't already exist in the list
		if (!lists.includes(name)) {
			const updatedSkills = [...lists, name];
			form.setValue("skills", updatedSkills);

			// Update the displayed list of skills
			setListSkills(
				parsedSkills.filter(
					(skill: any) => !updatedSkills.includes(skill.name)
				)
			);
		}
	};

	async function onSubmit(values: z.infer<typeof ProfileValidation>) {
		setIsSubmitting(true);

		try {
			await updateUser({
				clerkId,
				updateData: {
					name: values.name,
					username: values.username,
					portfolioWebsite: values.portfolioWebsite,
					location: values.location,
					bio: values.bio,
					whatsapp: values.whatsapp,
					googleMeet: values.googleMeet,
					zoom: values.zoom,
					skype: values.skype,
					teams: values.teams,
					onboarded: true,
				},
				skills: values.skills,
				path: pathname,
			});

			router.push("/home");
		} catch (error) {
			toast({
				title: "Error updating profile ⚠️",
				variant: "destructive",
			});

			console.log(error);
		} finally {
			setIsSubmitting(false);

			toast({
				title: "Profile updated successfully 🎉",
				variant: "default",
			});
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-9 flex w-full flex-col gap-9"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Name <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Your name"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Username{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Your username"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="skills"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Skills{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<>
									<Input
										type="text"
										className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
										placeholder="Add skills..."
										onKeyDown={(e) =>
											handleInputKeyDown(e, field)
										}
									/>
									<ul className="h-40 overflow-y-auto ">
										{listSkills?.map((skill: any) => (
											<li
												className=" border p-5"
												key={skill._id}
												onClick={() =>
													handleSkillPress(skill.name)
												}
											>
												{skill.name}
											</li>
										))}
									</ul>

									{field.value.length > 0 && (
										<div className="flex-start mt-2.5 gap-2.5">
											{field.value.map((skill: any) => {
												return (
													<Badge
														key={skill}
														className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none p-4 capitalize"
														onClick={() =>
															handleSkillRemove(
																skill,
																field
															)
														}
													>
														{skill}
														<Image
															src="/assets/icons/close.svg"
															alt="Close icon"
															width={12}
															height={12}
															className="cursor-pointer object-contain invert-0 dark:invert"
														/>
													</Badge>
												);
											})}
										</div>
									)}
								</>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Add up to 3 skills to describe what your
								interest is about
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="whatsapp"
					render={({ field }) => (
						<FormItem className="space-y-3.5">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Whatsapp
							</FormLabel>
							<FormControl>
								{/* <Input
									placeholder="phone number"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/> */}
								<PhoneInput
									inputClass=" !w-full no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{parsedUser.onboarded && (
					<>
						<FormField
							control={form.control}
							name="portfolioWebsite"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Portfolio Link
									</FormLabel>
									<FormControl>
										<Input
											type="url"
											placeholder="Your portfolio url"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Location
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Your location"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Bio
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Tell us about yourself"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="googleMeet"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Google meet
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Your google meet account url"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="zoom"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Zoom
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Your zoom account url"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="skype"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Skype
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Your skype account url"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="teams"
							render={({ field }) => (
								<FormItem className="space-y-3.5">
									<FormLabel className="paragraph-semibold text-dark400_light800">
										Teams
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Your teams account url"
											className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}

				<div className="mt-7 flex justify-end">
					<Button
						type="submit"
						className="primary-gradient w-fit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default Profile;
