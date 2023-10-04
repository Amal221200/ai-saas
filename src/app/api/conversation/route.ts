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
        const { messages } = body;

        if (!messages) {
            return NextResponse.json("Messages is required", {
                status: 400
            })
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages
        })

        return NextResponse.json(response.choices[0].message, {
            status: 201
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json("Internal Error", {
            status: 500
        })
    }
}