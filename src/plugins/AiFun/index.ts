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

import {
    analyzeText,
    askAI,
    generateCode,
    generateMeme,
    summarizeText,
    translateText,
} from "./AIService";
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
    const user = args.find(arg => arg.name === "user")?.value as string;

    try {
        await sendBotMessage(ctx.channel.id, {
            content: `Generating meme for "${prompt}"${user ? ` about <@${user}>` : ""}...`,
        });
        const currentSettings = settings.store;
        const imageUrl = await generateMeme(
            prompt,
            user,
            currentSettings.apiKey ?? "",
            currentSettings.aiModel ?? "",
            currentSettings.aiProvider ?? "",
            currentSettings,
        );
        await sendBotMessage(ctx.channel.id, {
            content: imageUrl,
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
        const currentSettings = settings.store;
        const aiResponse = await askAI(
            prompt,
            currentSettings.apiKey ?? "",
            currentSettings.aiModel ?? "",
            currentSettings.aiProvider ?? "",
            currentSettings,
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

// New command execution functions
const executeAiSummarize = async (
    commandName: string,
    args: CommandArgument[],
    ctx: CommandContext,
) => {
    const text = args.find(arg => arg.name === "text")?.value as string;

    try {
        await sendBotMessage(ctx.channel.id, {
            content: "Summarizing text...",
        });
        const currentSettings = settings.store;
        const summary = await summarizeText(
            text,
            currentSettings.apiKey ?? "",
            currentSettings.aiModel ?? "",
            currentSettings.aiProvider ?? "",
            currentSettings,
        );
        await sendBotMessage(ctx.channel.id, {
            content: summary,
        });
    } catch (error: any) {
        console.error(`[AiFun] Error executing /${commandName}:`, error);
        await sendBotMessage(ctx.channel.id, {
            content: `Failed to summarize text: ${error.message}`,
        });
    }
};

const executeAiTranslate = async (
    commandName: string,
    args: CommandArgument[],
    ctx: CommandContext,
) => {
    const text = args.find(arg => arg.name === "text")?.value as string;
    const language =
        (args.find(arg => arg.name === "language")?.value as string) ||
        "English";

    try {
        await sendBotMessage(ctx.channel.id, {
            content: `Translating text to ${language}...`,
        });
        const currentSettings = settings.store;
        const translation = await translateText(
            text,
            language,
            currentSettings.apiKey ?? "",
            currentSettings.aiModel ?? "",
            currentSettings.aiProvider ?? "",
            currentSettings,
        );
        await sendBotMessage(ctx.channel.id, {
            content: translation,
        });
    } catch (error: any) {
        console.error(`[AiFun] Error executing /${commandName}:`, error);
        await sendBotMessage(ctx.channel.id, {
            content: `Failed to translate text: ${error.message}`,
        });
    }
};

const executeAiCode = async (
    commandName: string,
    args: CommandArgument[],
    ctx: CommandContext,
) => {
    const description = args.find(arg => arg.name === "description")
        ?.value as string;
    const language = args.find(arg => arg.name === "language")
        ?.value as string;

    try {
        await sendBotMessage(ctx.channel.id, {
            content: "Generating code...",
        });
        const currentSettings = settings.store;
        const code = await generateCode(
            description,
            currentSettings.apiKey ?? "",
            currentSettings.aiModel ?? "",
            currentSettings.aiProvider ?? "",
            language,
            currentSettings,
        );
        await sendBotMessage(ctx.channel.id, {
            content: `\`\`\`${language || "javascript"}\n${code}\n\`\`\``,
        });
    } catch (error: any) {
        console.error(`[AiFun] Error executing /${commandName}:`, error);
        await sendBotMessage(ctx.channel.id, {
            content: `Failed to generate code: ${error.message}`,
        });
    }
};

const executeAiAnalyze = async (
    commandName: string,
    args: CommandArgument[],
    ctx: CommandContext,
) => {
    const text = args.find(arg => arg.name === "text")?.value as string;
    const analysisType =
        (args.find(arg => arg.name === "type")?.value as string) ||
        "general analysis";

    try {
        await sendBotMessage(ctx.channel.id, {
            content: `Analyzing text for ${analysisType}...`,
        });
        const currentSettings = settings.store;
        const analysis = await analyzeText(
            text,
            analysisType,
            currentSettings.apiKey ?? "",
            currentSettings.aiModel ?? "",
            currentSettings.aiProvider ?? "",
            currentSettings,
        );
        await sendBotMessage(ctx.channel.id, {
            content: analysis,
        });
    } catch (error: any) {
        console.error(`[AiFun] Error executing /${commandName}:`, error);
        await sendBotMessage(ctx.channel.id, {
            content: `Failed to analyze text: ${error.message}`,
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
                    } else if (cmd.type === "aisummarize") {
                        commandOptions.push({
                            name: "text",
                            description: "The text to summarize.",
                            type: ApplicationCommandOptionType.STRING,
                            required: true,
                        });
                    } else if (cmd.type === "aitranslate") {
                        commandOptions.push(
                            {
                                name: "text",
                                description: "The text to translate.",
                                type: ApplicationCommandOptionType.STRING,
                                required: true,
                            },
                            {
                                name: "language",
                                description:
                                    "Target language (default: English).",
                                type: ApplicationCommandOptionType.STRING,
                                required: false,
                            },
                        );
                    } else if (cmd.type === "aicode") {
                        commandOptions.push(
                            {
                                name: "description",
                                description:
                                    "Description of the code to generate.",
                                type: ApplicationCommandOptionType.STRING,
                                required: true,
                            },
                            {
                                name: "language",
                                description:
                                    "Programming language (default: javascript).",
                                type: ApplicationCommandOptionType.STRING,
                                required: false,
                            },
                        );
                    } else if (cmd.type === "aianalyze") {
                        commandOptions.push(
                            {
                                name: "text",
                                description: "The text to analyze.",
                                type: ApplicationCommandOptionType.STRING,
                                required: true,
                            },
                            {
                                name: "type",
                                description:
                                    "Type of analysis (default: general analysis).",
                                type: ApplicationCommandOptionType.STRING,
                                required: false,
                            },
                        );
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
                            } else if (cmd.type === "aisummarize") {
                                await executeAiSummarize(cmd.name, args, ctx);
                            } else if (cmd.type === "aitranslate") {
                                await executeAiTranslate(cmd.name, args, ctx);
                            } else if (cmd.type === "aicode") {
                                await executeAiCode(cmd.name, args, ctx);
                            } else if (cmd.type === "aianalyze") {
                                await executeAiAnalyze(cmd.name, args, ctx);
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
