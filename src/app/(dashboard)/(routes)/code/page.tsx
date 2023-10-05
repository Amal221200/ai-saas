"use client";

import * as z from 'zod';
import axios from 'axios';
import { Code } from "lucide-react";
import { ChatCompletionMessage } from 'openai/resources/chat/index.mjs';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown'

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

const CodePage = () => {
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
            const response = await axios.post('/api/code', { messages: newMessages });
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


    return (
        <div>
            <Heading title="Code Generation" description="Generate code using descriptive model" icon={Code} iconColor="text-green-700" bgColor="bg-green-700/10" />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                            <FormField control={form.control} name='prompt'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m-0 p-0'>
                                            <Input placeholder='Simple toggle button using react hooks' className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isSubmitting} {...field} />
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
                            ) : <></>
                        }

                        {
                            messages.length === 0 && !isSubmitting && (
                                <Empty label='No code generated' />
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
                                        <ReactMarkdown components={{
                                            
                                            pre: ({ node, ...props }) => (
                                                <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                    <pre {...props} className='prose-code:bg-transparent' >
                                                        {/* <code className='bg-none' /> */}
                                                    </pre>
                                                </div>
                                            ),
                                            code: (({ node, ...props }) => (
                                                <code {...props} className="bg-black/10 p-1 rounded-lg" />
                                            )),
                                            // code: (({node, ...props})=> (

                                            //     <code {...props} className="bg-black/10 p-2 rounded-lg" />
                                            // )),
                                        }} className="text-sm leading-7 overflow-hidden">
                                            {message?.content || ""}
                                        </ReactMarkdown>
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

export default CodePage;