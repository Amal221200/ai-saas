import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Openai from 'openai';
import { ChatCompletionMessage } from 'openai/resources/chat/index.mjs';
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit';

const openai = new Openai({
    apiKey: process.env.OPENAI_API_KEY,
})

const instructionMessage: ChatCompletionMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanation."
}

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
        const { messages } = body;

        if (!messages) {
            return NextResponse.json("Messages is required", {
                status: 400
            })
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return NextResponse.json("Free trial has expired", {
                status: 403
            })
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [instructionMessage, ...messages]
        });

        await increaseApiLimit()

        return NextResponse.json(response.choices[0].message, {
            status: 201
        })

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return NextResponse.json("Internal Error", {
            status: 500
        })
    }
}