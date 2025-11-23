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

// OpenAI API endpoint for text generation
const OPENAI_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
// OpenAI API endpoint for image generation (DALL-E)
const OPENAI_IMAGE_GENERATION_URL =
    "https://api.openai.com/v1/images/generations";

export async function askAI(
    prompt: string,
    apiKey: string,
    aiModel: string,
    aiProvider: string,
): Promise<string> {
    if (!apiKey) {
        throw new Error("AI API Key not configured in AiFun settings.");
    }
    if (aiProvider !== "openai") {
        throw new Error(
            "Only OpenAI is currently supported for AskAI command.",
        );
    }
    if (!aiModel || !aiModel.startsWith("gpt")) {
        throw new Error(
            "Please select a GPT model for AskAI in AiFun settings.",
        );
    }

    try {
        const response = await fetch(OPENAI_COMPLETIONS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: aiModel,
                messages: [{ role: "user", content: prompt }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("[AiFun] OpenAI API Error:", errorData);
            throw new Error(
                `OpenAI API Error: ${errorData.error?.message || response.statusText}`,
            );
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
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
): Promise<string> {
    if (!apiKey) {
        throw new Error("AI API Key not configured in AiFun settings.");
    }
    if (aiProvider !== "openai") {
        throw new Error(
            "Only OpenAI is currently supported for AiMeme command.",
        );
    }
    if (!aiModel || !aiModel.startsWith("dall-e")) {
        // Check for DALL-E model
        throw new Error(
            "Please select a DALL-E model for AiMeme in AiFun settings.",
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
        const response = await fetch(OPENAI_IMAGE_GENERATION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: aiModel,
                prompt: imagePrompt,
                n: 1,
                size: "1024x1024",
            }),
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
