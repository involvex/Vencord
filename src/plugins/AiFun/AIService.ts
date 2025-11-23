/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByPropsLazy } from "@webpack";
import { showToast, Toasts } from "@webpack/common";

// Lazy find necessary Discord modules
const UserUtils = findByPropsLazy("getUser", "getCurrentUser");
const IconUtils = findByPropsLazy("getUserAvatarURL");

export async function fetchUserAvatarUrl(
    userId: string,
): Promise<string | null> {
    try {
        const user = await UserUtils.getUser(userId); // Asynchronously fetch user data
        if (!user) {
            console.warn(`[AiFun] User with ID ${userId} not found.`);
            return null;
        }
        return IconUtils.getUserAvatarURL(user);
    } catch (error) {
        console.error(
            `[AiFun] Error fetching user avatar for ID ${userId}:`,
            error,
        );
        showToast(
            "[AiFun] Failed to fetch user avatar for meme generation.",
            Toasts.Type.FAILURE,
        );
        return null;
    }
}

// OpenAI API endpoints
const OPENAI_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_IMAGE_GENERATION_URL =
    "https://api.openai.com/v1/images/generations";

// Gemini API endpoints
const GEMINI_COMPLETIONS_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

// Claude API endpoints
const CLAUDE_COMPLETIONS_URL = "https://api.anthropic.com/v1/messages";

// Cohere API endpoints
const COHERE_COMPLETIONS_URL = "https://api.cohere.ai/v1/chat";

export async function askAI(
    prompt: string,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
    settings?: any,
): Promise<string> {
    const settingsObj = settings || {};
    const temperature = settingsObj.temperature || 0.7;
    const maxTokens = settingsObj.maxTokens || 1000;
    const topP = settingsObj.topP || 1.0;
    const systemPrompt =
        settingsObj.systemPrompt ||
        "You are a helpful AI assistant. Be concise and friendly.";
    const timeoutMs = settingsObj.timeoutMs || 30000;

    // Get appropriate API key based on provider
    let effectiveApiKey = apiKey;
    if (aiProvider === "openai") {
        effectiveApiKey = settingsObj.openaiApiKey || apiKey;
    } else if (aiProvider === "gemini") {
        effectiveApiKey = settingsObj.geminiApiKey || apiKey;
    } else if (aiProvider === "claude") {
        effectiveApiKey = settingsObj.claudeApiKey || apiKey;
    } else if (aiProvider === "cohere") {
        effectiveApiKey = settingsObj.cohereApiKey || apiKey;
    }

    if (!effectiveApiKey) {
        throw new Error(
            `API Key not configured for ${aiProvider} in AiFun settings.`,
        );
    }

    try {
        let response: Response;
        let requestBody: any;
        const headers: any = {
            "Content-Type": "application/json",
        };

        if (aiProvider === "openai") {
            headers.Authorization = `Bearer ${effectiveApiKey}`;
            requestBody = {
                model: aiModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
                temperature,
                max_tokens: maxTokens,
                top_p: topP,
            };
            response = await fetch(OPENAI_COMPLETIONS_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(timeoutMs),
            });
        } else if (aiProvider === "gemini") {
            const url = GEMINI_COMPLETIONS_URL.replace("{model}", aiModel);
            requestBody = {
                contents: [
                    { parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] },
                ],
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens,
                    topP,
                },
            };
            response = await fetch(`${url}?key=${effectiveApiKey}`, {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(timeoutMs),
            });
        } else if (aiProvider === "claude") {
            headers["x-api-key"] = effectiveApiKey;
            headers["anthropic-version"] = "2023-06-01";
            requestBody = {
                model: aiModel,
                max_tokens: maxTokens,
                temperature,
                messages: [
                    { role: "user", content: `${systemPrompt}\n\n${prompt}` },
                ],
            };
            response = await fetch(CLAUDE_COMPLETIONS_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(timeoutMs),
            });
        } else if (aiProvider === "cohere") {
            headers.Authorization = `Bearer ${effectiveApiKey}`;
            requestBody = {
                model: aiModel,
                message: `${systemPrompt}\n\n${prompt}`,
                temperature,
                max_tokens: maxTokens,
                p: topP,
            };
            response = await fetch(COHERE_COMPLETIONS_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(timeoutMs),
            });
        } else {
            throw new Error(`Unsupported AI provider: ${aiProvider}`);
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`[AiFun] ${aiProvider} API Error:`, errorData);
            throw new Error(
                `${aiProvider} API Error: ${errorData.error?.message || response.statusText}`,
            );
        }

        const data = await response.json();

        // Extract response based on provider
        if (aiProvider === "openai") {
            return data.choices[0].message.content.trim();
        } else if (aiProvider === "gemini") {
            return data.candidates[0].content.parts[0].text.trim();
        } else if (aiProvider === "claude") {
            return data.content[0].text.trim();
        } else if (aiProvider === "cohere") {
            return data.text.trim();
        }

        throw new Error(`Unknown response format for provider: ${aiProvider}`);
    } catch (error: any) {
        console.error("[AiFun] Error in askAI:", error);
        showToast(
            `[AiFun] Failed to get AI response: ${error.message}`,
            Toasts.Type.FAILURE,
        );
        throw error;
    }
}

export async function generateMeme(
    prompt: string,
    userId: string | undefined,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
    settings?: any,
): Promise<string> {
    const settingsObj = settings || {};
    const imageQuality = settingsObj.imageQuality || "standard";
    const imageSize = settingsObj.imageSize || "1024x1024";
    const imageStyle = settingsObj.imageStyle || "vivid";
    const timeoutMs = settingsObj.timeoutMs || 30000;

    // Get appropriate API key based on provider
    let effectiveApiKey = apiKey;
    if (aiProvider === "openai") {
        effectiveApiKey = settingsObj.openaiApiKey || apiKey;
    }

    if (!effectiveApiKey) {
        throw new Error(
            `API Key not configured for ${aiProvider} in AiFun settings.`,
        );
    }

    // Currently only OpenAI DALL-E supports image generation
    if (aiProvider !== "openai" || !aiModel.startsWith("dall-e")) {
        throw new Error(
            "Image generation is currently only supported with OpenAI DALL-E models.",
        );
    }

    let imagePrompt = prompt;
    if (userId) {
        const avatarUrl = await fetchUserAvatarUrl(userId);
        if (avatarUrl) {
            imagePrompt = `Create a meme image based on this theme: "${prompt}". Incorporate elements from the profile picture at this URL: ${avatarUrl}`;
        }
    }

    try {
        const requestBody: any = {
            model: aiModel,
            prompt: imagePrompt,
            n: 1,
            size: imageSize,
        };

        // Add quality and style parameters for DALL-E 3
        if (aiModel === "dall-e-3") {
            requestBody.quality = imageQuality;
            requestBody.style = imageStyle;
        }

        const response = await fetch(OPENAI_IMAGE_GENERATION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${effectiveApiKey}`,
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(timeoutMs),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[AiFun] OpenAI Image API Error:", errorData);
            throw new Error(
                `OpenAI Image API Error: ${errorData.error?.message || response.statusText}`,
            );
        }

        const data = await response.json();
        return data.data[0].url;
    } catch (error: any) {
        console.error("[AiFun] Error in generateMeme:", error);
        showToast(
            `[AiFun] Failed to generate meme: ${error.message}`,
            Toasts.Type.FAILURE,
        );
        throw error;
    }
}

// Additional AI command functions
export async function summarizeText(
    text: string,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
    settings?: any,
): Promise<string> {
    const prompt = `Please summarize the following text concisely while maintaining the key points:\n\n${text}`;
    return await askAI(prompt, apiKey, aiModel, aiProvider, settings);
}

export async function translateText(
    text: string,
    targetLanguage: string,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
    settings?: any,
): Promise<string> {
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text:\n\n${text}`;
    return await askAI(prompt, apiKey, aiModel, aiProvider, settings);
}

export async function generateCode(
    description: string,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
    language?: string,
    settings?: any,
): Promise<string> {
    const lang = language || "javascript";
    const prompt = `Generate ${lang} code for the following description. Provide only the code with minimal comments:\n\n${description}`;
    return await askAI(prompt, apiKey, aiModel, aiProvider, settings);
}

export async function analyzeText(
    text: string,
    analysisType: string,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
    settings?: any,
): Promise<string> {
    const prompt = `Analyze the following text for ${analysisType}. Provide detailed insights:\n\n${text}`;
    return await askAI(prompt, apiKey, aiModel, aiProvider, settings);
}
