"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MAX_FREE_COUNT } from "@/constants";
import { Zap } from "lucide-react";


interface FreeCounterProps {
    apiLimitCount: number
}

const FreeCounter: React.FC<FreeCounterProps> = ({ apiLimitCount = 0 }) => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    const percentageProgress = useMemo(() => (apiLimitCount / MAX_FREE_COUNT) * 100, [apiLimitCount])

    if (!mounted) {
        return null;
    }
    return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6 text-center">
                    <div className="text-white text-sm mb-4 space-y-2">
                        <p>
                            {apiLimitCount} / {MAX_FREE_COUNT} Free Generations
                        </p>
                        <Progress value={percentageProgress} className="w-full" />
                    </div>
                    <Button className="w-full" type={'button'} variant={'premium'} >
                        Upgrade <Zap className="ml-3 w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default FreeCounter;