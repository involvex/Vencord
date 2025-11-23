/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    ApplicationCommandInputType,
    ApplicationCommandOptionType,
    registerCommand,
    sendBotMessage,
    unregisterCommand,
    VencordCommand,
} from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import {
    CommandArgument,
    CommandContext,
    CommandOption,
} from "@vencord/discord-types";

import { askAI, generateMeme } from "./AIService";
import { AiFunSettingsPanel } from "./Settings";
import { CustomCommand, defaultSettings } from "./types";

const settings = definePluginSettings(defaultSettings);
export const useAiFunSettings = settings.use;

// Updated executeAiMeme to use AIService
const executeAiMeme = async (
    commandName: string,
    args: CommandArgument[],
    ctx: CommandContext,
) => {
    const prompt = args.find(arg => arg.name === "prompt")?.value as string;
    const user = args.find(arg => arg.name === "user")?.value as string; // This will be the user ID as a string

    try {
        await sendBotMessage(ctx.channel.id, {
            content: `Generating meme for "${prompt}"${user ? ` about <@${user}>` : ""}...`,
        });
        const { apiKey, aiModel, aiProvider } = settings.store;
        const imageUrl = await generateMeme(
            prompt,
            user,
            apiKey ?? "",
            aiModel ?? "",
            aiProvider ?? "",
        );
        await sendBotMessage(ctx.channel.id, {
            content: imageUrl, // Discord will embed the image from the URL
        });
    } catch (error: any) {
        console.error(`[AiFun] Error executing /${commandName}:`, error);
        await sendBotMessage(ctx.channel.id, {
            content: `Failed to generate meme: ${error.message}`,
        });
    }
};

// Updated executeAskAi to use AIService
const executeAskAi = async (
    commandName: string,
    args: CommandArgument[],
    ctx: CommandContext,
) => {
    const prompt = args.find(arg => arg.name === "prompt")?.value as string;

    try {
        await sendBotMessage(ctx.channel.id, {
            content: `Thinking about "${prompt}"...`,
        });
        const { apiKey, aiModel, aiProvider } = settings.store;
        const aiResponse = await askAI(
            prompt,
            apiKey ?? "",
            aiModel ?? "",
            aiProvider ?? "",
        );
        await sendBotMessage(ctx.channel.id, {
            content: aiResponse,
        });
    } catch (error: any) {
        console.error(`[AiFun] Error executing /${commandName}:`, error);
        await sendBotMessage(ctx.channel.id, {
            content: `Failed to get AI response: ${error.message}`,
        });
    }
};

export default definePlugin({
    name: "AiFun",
    description:
        "AI-powered commands for memes and general queries, with configurable AI models and API keys.",
    authors: [Devs.Ven],
    settings,

    onStart() {
        try {
            console.log(
                "[AiFun] Plugin started. Version: 20251123-1. Registering commands...",
            );
            // Load custom commands from settings and register them
            const customCommands = settings.store
                .customCommands as unknown as CustomCommand[];
            if (customCommands) {
                customCommands.forEach((cmd: CustomCommand) => {
                    const commandOptions: CommandOption[] = [];

                    if (cmd.type === "aimeme") {
                        commandOptions.push(
                            {
                                name: "prompt",
                                description:
                                    "The prompt for the meme generation.",
                                type: ApplicationCommandOptionType.STRING,
                                required: true,
                            },
                            {
                                name: "user",
                                description:
                                    "Optional: Tag a user to create a meme about their profile picture.",
                                type: ApplicationCommandOptionType.USER,
                                required: false,
                            },
                        );
                    } else if (cmd.type === "askai") {
                        commandOptions.push({
                            name: "prompt",
                            description: "The question or prompt for the AI.",
                            type: ApplicationCommandOptionType.STRING,
                            required: true,
                        });
                    }

                    const vencordCommand: VencordCommand = {
                        name: cmd.name,
                        description: cmd.description,
                        inputType: ApplicationCommandInputType.BUILT_IN,
                        options: commandOptions,
                        execute: async (args, ctx) => {
                            if (cmd.type === "aimeme") {
                                await executeAiMeme(cmd.name, args, ctx);
                            } else if (cmd.type === "askai") {
                                await executeAskAi(cmd.name, args, ctx);
                            }
                        },
                    };
                    registerCommand(vencordCommand, "AiFun");
                    console.log(`[AiFun] Registered command: /${cmd.name}`);
                });
            }
        } catch (error: any) {
            console.error("[AiFun] Error in onStart:", error);
        }
    },

    onStop() {
        try {
            console.log("[AiFun] Plugin stopping, unregistering commands...");
            // Unregister commands when the plugin stops
            const customCommands = settings.store
                .customCommands as unknown as CustomCommand[];
            if (customCommands) {
                customCommands.forEach((cmd: CustomCommand) => {
                    unregisterCommand(cmd.name);
                    console.log(`[AiFun] Unregistered command: /${cmd.name}`);
                });
            }
        } catch (error: any) {
            console.error("[AiFun] Error in onStop:", error);
        }
    },

    settingsAboutComponent: AiFunSettingsPanel,
});
