"use client";

import * as z from 'zod';
import axios from 'axios';
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Heading from "@/components/Headng";
import Empty from '@/components/Empty';
import Loader from '@/components/Loader';

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Download, Music } from 'lucide-react';

const MusicPage = () => {
    const router = useRouter();
    const [music, setMusic] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });

    const { isSubmitting } = form.formState;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined);
            const response = await axios.post('/api/music', values);
            setMusic(response.data.audio)
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
            <Heading title="Music Generation" description="Turn your prompt into an music." icon={Music} iconColor="text-emerald-500" bgColor="bg-emerald-500/10" />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                            <FormField control={form.control} name='prompt'
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m-0 p-0'>
                                            <Input placeholder='Piano solo' className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isSubmitting} {...field} />
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
                            !music && !isSubmitting && (
                                <Empty label='No music started' />
                            )
                        }
                        {music && (
                            <audio controls className='w-full mt-8'>
                                <source src={music} />
                            </audio>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPage;