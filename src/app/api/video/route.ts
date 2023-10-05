import Replicate from 'replicate';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';


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
        const { prompt} = body;

        if (!prompt) {
            return NextResponse.json("Prompt is required", {
                status: 400
            })
        }



        const response  = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
              input: {
                prompt,
              }
            }
          );

        return NextResponse.json(response, {
            status: 201
        })

    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return NextResponse.json("Internal Error", {
            status: 500
        })
    }
}