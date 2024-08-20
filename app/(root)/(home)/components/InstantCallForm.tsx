'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { uploadImage } from '@/lib/actions/file.action';
import { createQuestion } from '@/lib/actions/question.action';
import { InstantQuestionValidation } from '@/lib/validations';
import { Skill } from '@/lib/actions/shared.types';

interface Option {
    value: string;
    label: string;
}

interface InstantCallFormProps {
    skills: Skill[];
    mongoUserId: string;
}

const InstantCallForm: React.FC<InstantCallFormProps> = ({
    skills,
    mongoUserId,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm<z.infer<typeof InstantQuestionValidation>>({
        resolver: zodResolver(InstantQuestionValidation),
        defaultValues: {
            question: '',
        },
    });

    const [selectedSkillOption, setSelectedSkillOption] = useState<
        MultiValue<Option>
    >([]);
    const [skillValidation, setSkillValidation] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function handleSubmit(
        values: z.infer<typeof InstantQuestionValidation>,
    ) {
        if (!validateSubmission(values)) return;

        setIsSubmitting(true);

        try {
            const questionContent = await buildQuestionContent(values);
            const question = await submitQuestion(values, questionContent);

            setIsSubmitting(false);

            notifyUser('Question posted successfully 🎉', 'default');
            navigateToQuestion(question._id);
        } catch (error) {
            notifyUser('Error creating a problem ⚠️', 'destructive');
            console.error(error);
            setIsSubmitting(false);
        }
    }

    function validateSubmission(
        values: z.infer<typeof InstantQuestionValidation>,
    ) {
        if (!image && !values.question) {
            notifyUser(
                'Please add an image or type the problem! ⚠️',
                'destructive',
            );
            return false;
        }

        if (selectedSkillOption.length === 0) {
            setSkillValidation('Add at least 1 skill');
            return false;
        }

        return true;
    }

    async function buildQuestionContent(
        values: z.infer<typeof InstantQuestionValidation>,
    ) {
        if (!image) {
            return values.question || '';
        }

        const formData = new FormData();
        formData.append('file', image);

        const uploadedImage = await uploadImage(formData);
        const imageTag = uploadedImage?.data
            ? `<img src="${uploadedImage.data}" alt="problem image">`
            : '';

        return `<p>${values.question || ''}</p><p>${imageTag}</p>`;
    }

    async function submitQuestion(
        values: z.infer<typeof InstantQuestionValidation>,
        content: string,
    ) {
        const skills = selectedSkillOption.map((item: Option) => item.value);

        return await createQuestion({
            title: values.question || 'Can you help me with this problem?',
            content,
            skills,
            author: JSON.parse(mongoUserId),
            path: pathname,
            isInstant: true,
        });
    }

    function notifyUser(message: string, variant: 'default' | 'destructive') {
        toast({
            title: message,
            variant,
        });
    }

    function navigateToQuestion(questionId: string) {
        router.push(`/call/${questionId}`);
    }

    const skillOptions = skills?.map(item => ({
        value: item.name,
        label: item.name,
    })) as Option[];

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex w-full flex-col gap-9">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Title
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your problem's title here"
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
                        <ImageUpload onChange={setImage} />
                    </FormControl>
                    <FormDescription className="body-regular mt-2.5 text-light-500">
                        Describe what your problem is or upload Images related
                        to your problem.
                    </FormDescription>
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
                        need to press enter to add a skill.
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
