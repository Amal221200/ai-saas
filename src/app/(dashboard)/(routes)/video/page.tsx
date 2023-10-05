"use client";

import * as z from 'zod';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Heading from "@/components/Headng";
import Empty from '@/components/Empty';
import Loader from '@/components/Loader';

import { formSchema } from "./constants";
import { Video } from 'lucide-react';

const VideoPage = () => {
    const router = useRouter();
    const [video, setVideo] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        }
    });

    const { isSubmitting } = form.formState;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined);
            const response = await axios.post('/api/video', values);
            setVideo(response.data[0])
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
            <Heading title="Video Generation" description="Turn your prompt into a video." icon={Video} iconColor="text-orange-700" bgColor="bg-orange-700/10" />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                            <FormField control={form.control} name='prompt'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m-0 p-0'>
                                            <Input placeholder='Clown fish swimming around a coral reef.' className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isSubmitting} {...field} />
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
                            isSubmitting && (
                                <div className='p-20'>
                                    <Loader />
                                </div>
                            )
                        }

                        {
                            !video && !isSubmitting && (
                                <Empty label='No video started' />
                            )
                        }
                        {video && (
                            <video controls className='w-full mt-8 aspect-video rounded-lg border bg-black'>
                                <source src={video} />
                            </video>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPage;