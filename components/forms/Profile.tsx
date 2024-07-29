'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { updateUser } from '@/lib/actions/user.action';
import { ProfileValidation } from '@/lib/validations';

import type { ClerkId } from '@/lib/actions/shared.types';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { deleteCookie } from '@/lib/actions/cookies.action';

interface Props extends ClerkId {
    user: string;
    skills: string;
    isOnboarding? : boolean;
}
interface Option {
    value: string;
    label: string;
}
const Profile = ({ clerkId, user, skills, isOnboarding = false }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const parsedUser = JSON.parse(user);
    const parsedSkills = skills && JSON.parse(skills);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [whatsappError, setWhatsappError] = useState<string>('');

    const existingSkill = parsedUser?.skills.map((item: any) => {
        return {
            value: item.name,
            label: item.name,
        };
    });
    const [selectedSkillOption, setSelectedSkillOption] = useState<
        MultiValue<Option>
    >(existingSkill || []);

    const [skillValidation, setSkillValidation] = useState<string>('');

    const skillOptions = parsedSkills.map((item: any) => {
        return {
            value: item.name,
            label: item.name,
        };
    });
    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            name: parsedUser?.name || '',
            username: parsedUser?.username || '',
            portfolioWebsite: parsedUser?.portfolioWebsite || '',
            location: parsedUser?.location || '',
            whatsapp: parsedUser?.whatsapp || '',
            googleMeet: parsedUser?.googleMeet || '',
            zoom: parsedUser?.zoom || '',
            skype: parsedUser?.skype || '',
            teams: parsedUser?.teams || '',
            // skills: groupedSkills || [],
            bio: parsedUser?.bio || '',
        },
    });

    const isPhoneNumberValid = (number: string) => {
        const trimmedNumber = number.replace(/\D/g, '');
        return trimmedNumber.length > 4;
    };

    const validatePhoneNumber = (number: string) => {
        if (!number || !isPhoneNumberValid(number)) {
            setWhatsappError('Whatsapp number is required');
        } else {
            setWhatsappError('');
        }
    };

    useEffect(() => {
        validatePhoneNumber(form.getValues('whatsapp'));
    }, [form.watch('whatsapp')]);

    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        setIsSubmitting(true);

        try {
            if (selectedSkillOption.length === 0) {
                setSkillValidation('Add at least 1 skill');
                setIsSubmitting(false);
            } else if (!isPhoneNumberValid(values.whatsapp)) {
                setWhatsappError('Whatsapp number is required')
                setIsSubmitting(false)
            } else {
                const skills = selectedSkillOption.map((item: Option) => {
                    return item.value;
                });
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
                    skills,
                    path: pathname,
                });
                setIsSubmitting(false);

                if (isOnboarding) {
                    sessionStorage.removeItem('referral');
                    await deleteCookie('referral');
                }

                toast({
                    title: 'Profile updated successfully 🎉',
                    variant: 'default',
                });

                router.push('/home');
            }
        } catch (error) {
            toast({
                title: 'Error updating profile ⚠️',
                variant: 'destructive',
            });

            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-9 flex w-full flex-col gap-9">
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
                            {/* {form.formState.errors.name && (
                                <span className="text-red-500">{form.formState.errors.name.message}</span>
                            )} */}
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                    rules={{ required: `Name can't be empty` }}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Username{' '}
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

                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light800">
                        Skills
                        <span className="text-primary-500">*</span>
                    </FormLabel>
                    <FormControl className="mt-3.5">
                        <CreatableSelect<Option, true>
                            defaultValue={selectedSkillOption}
                            onChange={setSelectedSkillOption}
                            isMulti
                            placeholder={'Select skill'}
                            options={skillOptions}
                        />
                    </FormControl>
                    <FormDescription className="body-regular mt-2.5 text-light-500">
                        Add skills to describe what your interest is about
                    </FormDescription>
                    <FormMessage className="text-red-500">
                        {skillValidation}
                    </FormMessage>
                </FormItem>

                <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Whatsapp
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                {/* <Input
									placeholder="phone number"
									className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
									{...field}
								/> */}
                                <PhoneInput
                                    country="in"
                                    prefix="+ "
                                    inputClass=" !w-full no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                                    {...field}
                                />
                            </FormControl>
                            {whatsappError && (
                                <FormMessage className="text-red-500">
                                    {whatsappError}
                                </FormMessage>
                            )}
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
                                    maxLength={100}
                                    placeholder="Tell us about yourself"
                                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {parsedUser?.onboarded && (
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
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Profile;
