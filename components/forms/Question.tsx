"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";

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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

import { useTheme } from "@/context/ThemeProvider";

import { QuestionValidation } from "@/lib/validations";
import { editQuestion, createQuestion } from "@/lib/actions/question.action";

interface Props {
    type: string;
    mongoUserId: string;
    questionDetails?: string;
}

const Question = ({ type, mongoUserId, questionDetails }: Props) => {
    const { mode } = useTheme();
    const editorRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const parsedQuestionDetails =
        questionDetails && JSON.parse(questionDetails || "");

    const groupedSkills = parsedQuestionDetails?.skills?.map(
        (skill: any) => skill.name
    );

    const form = useForm<z.infer<typeof QuestionValidation>>({
        resolver: zodResolver(QuestionValidation),
        defaultValues: {
            title: parsedQuestionDetails?.title || "",
            explanation: parsedQuestionDetails?.content || "",
            skills: groupedSkills || [],
        },
    });

    async function onSubmit(values: z.infer<typeof QuestionValidation>) {
        setIsSubmitting(true);

        try {
            if (type === "Edit") {
                await editQuestion({
                    questionId: parsedQuestionDetails._id,
                    title: values.title,
                    content: values.explanation,
                    path: pathname,
                });
                router.push(`/question/${parsedQuestionDetails._id}`);
            } else {
                await createQuestion({
                    title: values.title,
                    content: values.explanation,
                    skills: values.skills,
                    author: JSON.parse(mongoUserId),
                    path: pathname,
                });

                // navigate to home page
                router.push("/");
            }
        } catch (error) {
            toast({
                title: `Error ${type === "Edit" ? "editing" : "posting"} question ⚠️`,
                variant: "destructive",
            });

            console.error(error);
        } finally {
            setIsSubmitting(false);

            toast({
                title: `Question ${
                    type === "Edit" ? "edited" : "posted"
                } successfully 🎉`,
                variant: "default",
            });
        }
    }

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        field: any
    ) => {
        if (e.key === "Enter" && field.name === "skills") {
            e.preventDefault();

            const skillInput = e.target as HTMLInputElement;
            const skillValue = skillInput.value.trim();

            if (skillValue !== "") {
                // if (skillValue.length > 15) {
                //     return form.setError("skills", {
                //         type: "required",
                //         message: "Skill must be less than 15 characters.",
                //     });
                // }

                if (!field.value.includes(skillValue as never)) {
                    form.setValue("skills", [...field.value, skillValue]);
                    skillInput.value = "";
                    form.clearErrors("skills");
                } else {
                    form.trigger();
                }
            }
        }
    };

    const handleSkillRemove = (skill: string, field: any) => {
        form.setValue(
            "skills",
            field.value.filter((t: string) => t !== skill)
        );
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-10"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Question Title{" "}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you&apos;re asking a
                                question to another person.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Detailed explanation of your problem{" "}
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Editor
                                    apiKey={
                                        process.env.NEXT_PUBLIC_TINY_MCE_API_KEY
                                    }
                                    onInit={(evt, editor) => {
                                        // @ts-ignore
                                        editorRef.current = editor;
                                    }}
                                    onBlur={field.onBlur}
                                    onEditorChange={(content) =>
                                        field.onChange(content)
                                    }
                                    initialValue={
                                        parsedQuestionDetails?.content || ""
                                    }
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        plugins: [
                                            "advlist",
                                            "autolink",
                                            "lists",
                                            "link",
                                            "image",
                                            "charmap",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "codesample",
                                            "fullscreen",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                            "wordcount",
                                        ],
                                        toolbar:
                                            "undo redo | " +
                                            "codesample | bold italic forecolor | alignleft aligncenter |" +
                                            "alignright alignjustify | bullist numlist outdent indent",
                                        content_style:
                                            "body { font-family:Inter; font-size:16px }",
                                        skin:
                                            mode === "dark"
                                                ? "oxide-dark"
                                                : "oxide",
                                        content_css:
                                            mode === "dark" ? "dark" : "light",
                                    }}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Introduces the problem and expand on what you
                                put in the title. Minimum 20 characters.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
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
                                        disabled={type === "Edit"}
                                        className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                        placeholder="Add skills..."
                                        onKeyDown={(e) =>
                                            handleInputKeyDown(e, field)
                                        }
                                    />

                                    {field.value.length > 0 && (
                                        <div className="flex-start mt-2.5 gap-2.5">
                                            {field.value.map((skill: any) => (
                                                <Badge
                                                    key={skill}
                                                    className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                                                    onClick={() =>
                                                        type !== "Edit"
                                                            ? handleSkillRemove(
                                                                  skill,
                                                                  field
                                                              )
                                                            : () => {}
                                                    }
                                                >
                                                    {skill}
                                                    {type !== "Edit" && (
                                                        <Image
                                                            src="/assets/icons/close.svg"
                                                            alt="Close icon"
                                                            width={12}
                                                            height={12}
                                                            className="cursor-pointer object-contain invert-0 dark:invert"
                                                        />
                                                    )}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </>
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 3 skills to describe what your
                                question is about. You need to press enter to
                                add a skill.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="primary-gradient w-fit !text-light-900"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>{type === "Edit" ? "Editing..." : "Posting..."}</>
                    ) : (
                        <>
                            {type === "Edit"
                                ? "Edit Question"
                                : "Post a Problem"}
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default Question;
