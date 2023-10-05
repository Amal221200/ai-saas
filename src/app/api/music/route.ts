import Replicate from 'replicate';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY
})

export const POST = async (request: NextRequest) => {

    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json("Not authenticated", {
                status: 401
            })
        }

        if (!replicate.auth) {
            return NextResponse.json("OpenAI API Key not configured", {
                status: 500
            })
        };

        const body = await request.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json("Prompt is required", {
                status: 400
            })
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return NextResponse.json("Free trial has expired", {
                status: 403
            })
        }

        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt
                }
            }
        );

        await increaseApiLimit();

        return NextResponse.json(response, {
            status: 201
        })

    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return NextResponse.json("Internal Error", {
            status: 500
        })
    }
}