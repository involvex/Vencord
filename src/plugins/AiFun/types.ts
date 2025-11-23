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
    ],
};
