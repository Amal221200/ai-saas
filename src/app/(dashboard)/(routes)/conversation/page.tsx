"use client";

import * as z from 'zod';
import axios from 'axios';
import { MessageSquareIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatCompletionMessage } from 'openai/resources/chat/index.mjs';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Heading from "@/components/Headng";
import Empty from '@/components/Empty';
import Loader from '@/components/Loader';
import UserAvatar from '@/components/UserAvatar';
import BotAvatar from '@/components/BotAvatar';

import { cn } from '@/lib/utils';
import { formSchema } from "./constants";

const ConversationPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        }
    })

    const { isSubmitting } = form.formState;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionMessage = {
                role: 'user',
                content: values.prompt
            }
            const newMessages = [...messages, userMessage];
            const response = await axios.post('/api/conversation', { messages: newMessages });
            if (response.status !== 201) {

            }
            setMessages((current) => [...current, userMessage, response.data]);
            form.reset();

        } catch (error) {
            // TODO: Open Premium Modal
            console.log(error);

        } finally {
            router.refresh()
        }
    }
    console.log(messages);


    return (
        <div>
            <Heading title="Conversation" description="Our most advanced conversation model" icon={MessageSquareIcon} iconColor="text-violet-500" bgColor="bg-violet-500/10" />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                            <FormField control={form.control} name='prompt'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m-0 p-0'>
                                            <Input placeholder='How do I calculate the radius of the circle?' className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isSubmitting} {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            <Button type='submit' className='col-span-12 lg:col-span-2 w-full' disabled={isSubmitting}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className='space-y-4 mt-4'>
                    <div className='flex flex-col-reverse gap-y-4'>
                        {
                            isSubmitting ? (
                                <div className='flex items-center justify-center p-8 rounded-lg w-full bg-muted'>
                                    <Loader />
                                </div>
                            ): <></>
                        }

                        {
                            messages.length === 0 && !isSubmitting && (
                                <Empty label='No conversation started' />
                            )
                        }

                        {
                            messages.map((message, ind) => {
                                // Some problem with the role condition
                                return (
                                    <div key={ind}
                                        className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg',
                                            message.role === 'user' ? 'bg-muted' : 'bg-white border border-black/10')}>
                                        {message.role === 'user' ? <BotAvatar /> : <UserAvatar />}
                                        <p className='text-sm'>
                                            {message?.content}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;