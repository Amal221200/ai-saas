import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Openai from 'openai';

const openai = new Openai({
    apiKey: process.env.OPENAI_API_KEY,
})

export const POST = async (request: NextRequest) => {

    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json("Not authenticated", {
                status: 401
            })
        }

        if (!openai.apiKey) {
            return NextResponse.json("OpenAI API Key not configured", {
                status: 500
            })
        };

        const body = await request.json();
        const { prompt, amount = 1, resolution = '512x512' } = body;

        if (!prompt) {
            return NextResponse.json("Prompt is required", {
                status: 400
            })
        }

        const response = await openai.images.generate({
            prompt,
            size: resolution,
            n: parseInt(amount, 10)
        })

        return NextResponse.json(response.data, {
            status: 201
        })

    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return NextResponse.json("Internal Error", {
            status: 500
        })
    }
}