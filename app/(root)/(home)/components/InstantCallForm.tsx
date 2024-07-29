'use client';
import ImageUpload from '@/components/shared/ImageUpload';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { createQuestion } from '@/lib/actions/question.action';
import {
    InstantQuestionValidation,
    ProfileValidation,
} from '@/lib/validations';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod';
interface Option {
    value: string;
    label: string;
}

const InstantCallForm = ({ skills, mongoUserId }) => {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm<z.infer<typeof InstantQuestionValidation>>({
        resolver: zodResolver(InstantQuestionValidation),
        defaultValues: {
            question: '',
            // skill: [],
        },
    });

    const [selectedSkillOption, setSelectedSkillOption] = useState<
        MultiValue<Option>
    >([]);
    const [skillValidation, setSkillValidation] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof InstantQuestionValidation>) {
        setIsSubmitting(true);
        try {
            if (selectedSkillOption.length === 0) {
                setSkillValidation('Add at least 1 skill');
                setIsSubmitting(false);
            } else {
                const skills = selectedSkillOption.map((item: Option) => {
                    return item.value;
                });
                const question = await createQuestion({
                    title: values.question,
                    content: values.question,
                    skills,
                    author: JSON.parse(mongoUserId),
                    path: pathname,
                    isInstant: true,
                });

                setIsSubmitting(false);

                toast({
                    title: `Question posted successfully 🎉`,
                    variant: 'default',
                });

                router.push(`/call/${question._id}?instant=true`);
            }
        } catch (error) {
            toast({
                title: `Error creating a question ⚠️`,
                variant: 'destructive',
            });

            console.error(error);
        }
    }

    const skillOptions = skills?.map((item: any) => {
        return {
            value: item.name,
            label: item.name,
        };
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-9">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Problem
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your problem here"
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
                        Image
                    </FormLabel>
                    <FormControl className="mt-3.5">
                        <ImageUpload />
                    </FormControl>
                    <FormDescription className="body-regular mt-2.5 text-light-500">
                        Describe what your problem is or upload Images related
                        to your problem.{' '}
                    </FormDescription>
                    <FormMessage className="text-red-500">
                        {skillValidation}
                    </FormMessage>
                </FormItem>

                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light800">
                        Skills
                        <span className="text-primary-500">*</span>
                    </FormLabel>
                    <FormControl className="text-dark400_light800 mt-3.5">
                        <CreatableSelect<Option, true>
                            defaultValue={selectedSkillOption}
                            onChange={setSelectedSkillOption}
                            isMulti
                            placeholder="Select skill"
                            options={skillOptions}
                        />
                    </FormControl>
                    <FormDescription className="body-regular mt-2.5 text-light-500">
                        Add skills to describe what your problem is about. You
                        need to press enter to add a skill.{' '}
                    </FormDescription>
                    <FormMessage className="text-red-500">
                        {skillValidation}
                    </FormMessage>
                </FormItem>

                <div className="mt-7 flex justify-end">
                    <Button
                        type="submit"
                        className="primary-gradient w-fit"
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default InstantCallForm;
