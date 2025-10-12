import OpenAI from "openai";
import { useCallback, useState } from "react";

export const useOpenAI = () => {
    const [openai, setOpenAI] = useState<OpenAI | null>(null);

    const getInstance = useCallback((): OpenAI => {
        if (openai) return openai;

        const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

        if (!apiKey) {
            throw new Error("EXPO_PUBLIC_OPENAI_API_KEY is not defined");
        }

        const openaiInstance = new OpenAI({ apiKey });
        setOpenAI(openaiInstance);

        return openaiInstance;
    }, [openai]);

    return { getInstance };
};
