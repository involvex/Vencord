/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface CustomCommand {
    id: string;
    name: string;
    description: string;
    type: string;
}

export interface AiFunSettings {
    [key: string]: any;
    aiModel: string;
    aiProvider: string;
    apiKey: string;
    customCommands: CustomCommand[];
    // Enhanced provider settings
    openaiApiKey: string;
    geminiApiKey: string;
    claudeApiKey: string;
    anthropicApiKey: string;
    cohereApiKey: string;
    // Enhanced model settings
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    // Image generation settings
    imageQuality: string;
    imageSize: string;
    imageStyle: string;
    // Advanced settings
    systemPrompt: string;
    enableStreaming: boolean;
    timeoutMs: number;
}

export const defaultSettings: AiFunSettings = {
    aiModel: "gpt-3.5-turbo",
    aiProvider: "openai",
    apiKey: "",
    customCommands: [
        {
            id: "aimeme-default",
            name: "aimeme",
            description: "Generates a meme based on your prompt.",
            type: "aimeme",
        },
        {
            id: "askai-default",
            name: "askai",
            description: "Ask the AI a question.",
            type: "askai",
        },
        {
            id: "aisummarize-default",
            name: "aisummarize",
            description: "Summarize text using AI.",
            type: "aisummarize",
        },
        {
            id: "aitranslate-default",
            name: "aitranslate",
            description: "Translate text using AI.",
            type: "aitranslate",
        },
        {
            id: "aicode-default",
            name: "aicode",
            description: "Generate code using AI.",
            type: "aicode",
        },
        {
            id: "aianalyze-default",
            name: "aianalyze",
            description: "Analyze text using AI.",
            type: "aianalyze",
        },
    ],
    // Enhanced provider settings
    openaiApiKey: "",
    geminiApiKey: "",
    claudeApiKey: "",
    anthropicApiKey: "",
    cohereApiKey: "",
    // Enhanced model settings
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    // Image generation settings
    imageQuality: "standard",
    imageSize: "1024x1024",
    imageStyle: "vivid",
    // Advanced settings
    systemPrompt: "You are a helpful AI assistant. Be concise and friendly.",
    enableStreaming: false,
    timeoutMs: 30000,
};
