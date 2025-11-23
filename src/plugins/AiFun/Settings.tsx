/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Forms, SearchableSelect, TextInput } from "@webpack/common";

import { useAiFunSettings } from "./index"; // Corrected import for the hook
import { CustomCommand } from "./types"; // Import from new types.ts

export function AiFunSettingsPanel() {
    const currentSettings = useAiFunSettings();
    console.log("AiFunSettingsPanel rendered. Version: 20251123-1");

    const providerOptions = [
        { label: "OpenAI", value: "openai" },
        { label: "Google Gemini", value: "gemini" },
        { label: "Anthropic Claude", value: "claude" },
        { label: "Cohere", value: "cohere" },
    ];

    const modelOptions =
        currentSettings.aiProvider === "openai"
            ? [
                  { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
                  { label: "GPT-4", value: "gpt-4" },
                  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
                  { label: "GPT-4o", value: "gpt-4o" },
                  { label: "GPT-4o Mini", value: "gpt-4o-mini" },
                  { label: "DALL-E 2", value: "dall-e-2" },
                  { label: "DALL-E 3", value: "dall-e-3" },
              ]
            : currentSettings.aiProvider === "gemini"
              ? [
                    { label: "Gemini Pro", value: "gemini-pro" },
                    { label: "Gemini Pro Vision", value: "gemini-pro-vision" },
                    { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
                    { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
                ]
              : currentSettings.aiProvider === "claude"
                ? [
                      { label: "Claude 3 Opus", value: "claude-3-opus" },
                      { label: "Claude 3 Sonnet", value: "claude-3-sonnet" },
                      { label: "Claude 3 Haiku", value: "claude-3-haiku" },
                  ]
                : currentSettings.aiProvider === "cohere"
                  ? [
                        { label: "Command", value: "command" },
                        { label: "Command Light", value: "command-light" },
                        { label: "Command R", value: "command-r" },
                        { label: "Command R+", value: "command-r-plus" },
                    ]
                  : [{ label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" }];

    const commandTypeOptions = [
        { label: "AI Meme (Image Generation)", value: "aimeme" },
        { label: "Ask AI (Text Generation)", value: "askai" },
        { label: "AI Summarize", value: "aisummarize" },
        { label: "AI Translate", value: "aitranslate" },
        { label: "AI Code", value: "aicode" },
        { label: "AI Analyze", value: "aianalyze" },
    ];

    const imageQualityOptions = [
        { label: "Standard", value: "standard" },
        { label: "High", value: "hd" },
    ];

    const imageSizeOptions = [
        { label: "1024x1024", value: "1024x1024" },
        { label: "1792x1024", value: "1792x1024" },
        { label: "1024x1792", value: "1024x1792" },
    ];

    const imageStyleOptions = [
        { label: "Vivid", value: "vivid" },
        { label: "Natural", value: "natural" },
    ];

    const handleCustomCommandChange = (
        id: string,
        field: keyof CustomCommand,
        value: any,
    ) => {
        const cmds = currentSettings.customCommands ?? [];
        const newCmds = cmds.map((cmd: CustomCommand) =>
            cmd.id === id ? { ...cmd, [field]: value } : cmd,
        );
        currentSettings.customCommands = newCmds;
    };

    const addCustomCommand = () => {
        const newCommand = {
            id: Math.random().toString(36).substring(7),
            name: "",
            description: "",
            type: "askai",
        };
        const cmds = currentSettings.customCommands ?? [];
        currentSettings.customCommands = [...cmds, newCommand];
    };

    const deleteCustomCommand = (id: string) => {
        const cmds = currentSettings.customCommands ?? [];
        currentSettings.customCommands = cmds.filter(
            (cmd: CustomCommand) => cmd.id !== id,
        );
    };

    return (
        <div>
            <Forms.FormTitle tag="h2">
                AI Provider Configuration
            </Forms.FormTitle>

            <Forms.FormText>OpenAI API Key</Forms.FormText>
            <TextInput
                value={currentSettings.openaiApiKey}
                onChange={(val: string) => (currentSettings.openaiApiKey = val)}
                type="password"
                placeholder="Enter your OpenAI API key"
            />

            <Forms.FormText>Google Gemini API Key</Forms.FormText>
            <TextInput
                value={currentSettings.geminiApiKey}
                onChange={(val: string) => (currentSettings.geminiApiKey = val)}
                type="password"
                placeholder="Enter your Gemini API key"
            />

            <Forms.FormText>Anthropic Claude API Key</Forms.FormText>
            <TextInput
                value={currentSettings.claudeApiKey}
                onChange={(val: string) => (currentSettings.claudeApiKey = val)}
                type="password"
                placeholder="Enter your Claude API key"
            />

            <Forms.FormText>Cohere API Key</Forms.FormText>
            <TextInput
                value={currentSettings.cohereApiKey}
                onChange={(val: string) => (currentSettings.cohereApiKey = val)}
                type="password"
                placeholder="Enter your Cohere API key"
            />

            <Forms.FormText>Select AI Provider</Forms.FormText>
            <SearchableSelect
                options={providerOptions}
                onChange={(option: any) =>
                    (currentSettings.aiProvider = option.value)
                }
                value={providerOptions.find(
                    o => o.value === currentSettings.aiProvider,
                )}
                placeholder="Select AI Provider"
            />
            <Forms.FormText>AI Model</Forms.FormText>
            <SearchableSelect
                options={modelOptions}
                onChange={(option: any) =>
                    (currentSettings.aiModel = option.value)
                }
                value={modelOptions.find(
                    o => o.value === currentSettings.aiModel,
                )}
                placeholder="Select AI Model"
            />

            <Forms.FormTitle tag="h2">Model Parameters</Forms.FormTitle>
            <Forms.FormText>
                Temperature (0-2): {currentSettings.temperature}
            </Forms.FormText>
            <TextInput
                value={currentSettings.temperature.toString()}
                onChange={(val: string) =>
                    (currentSettings.temperature = parseFloat(val) || 0.7)
                }
                type="number"
                min="0"
                max="2"
                step="0.1"
            />

            <Forms.FormText>
                Max Tokens: {currentSettings.maxTokens}
            </Forms.FormText>
            <TextInput
                value={currentSettings.maxTokens.toString()}
                onChange={(val: string) =>
                    (currentSettings.maxTokens = parseInt(val) || 1000)
                }
                type="number"
                min="1"
                max="4000"
            />

            <Forms.FormText>Top P (0-1): {currentSettings.topP}</Forms.FormText>
            <TextInput
                value={currentSettings.topP.toString()}
                onChange={(val: string) =>
                    (currentSettings.topP = parseFloat(val) || 1.0)
                }
                type="number"
                min="0"
                max="1"
                step="0.1"
            />

            <Forms.FormTitle tag="h2">
                Image Generation Settings
            </Forms.FormTitle>
            <Forms.FormText>Image Quality</Forms.FormText>
            <SearchableSelect
                options={imageQualityOptions}
                onChange={(option: any) =>
                    (currentSettings.imageQuality = option.value)
                }
                value={imageQualityOptions.find(
                    o => o.value === currentSettings.imageQuality,
                )}
                placeholder="Select Image Quality"
            />

            <Forms.FormText>Image Size</Forms.FormText>
            <SearchableSelect
                options={imageSizeOptions}
                onChange={(option: any) =>
                    (currentSettings.imageSize = option.value)
                }
                value={imageSizeOptions.find(
                    o => o.value === currentSettings.imageSize,
                )}
                placeholder="Select Image Size"
            />

            <Forms.FormText>Image Style</Forms.FormText>
            <SearchableSelect
                options={imageStyleOptions}
                onChange={(option: any) =>
                    (currentSettings.imageStyle = option.value)
                }
                value={imageStyleOptions.find(
                    o => o.value === currentSettings.imageStyle,
                )}
                placeholder="Select Image Style"
            />

            <Forms.FormTitle tag="h2">Advanced Settings</Forms.FormTitle>
            <Forms.FormText>System Prompt</Forms.FormText>
            <TextInput
                value={currentSettings.systemPrompt}
                onChange={(val: string) => (currentSettings.systemPrompt = val)}
                placeholder="Enter system prompt for AI"
            />

            <Forms.FormText>
                Timeout (ms): {currentSettings.timeoutMs}
            </Forms.FormText>
            <TextInput
                value={currentSettings.timeoutMs.toString()}
                onChange={(val: string) =>
                    (currentSettings.timeoutMs = parseInt(val) || 30000)
                }
                type="number"
                min="5000"
                max="120000"
                step="5000"
            />

            <Forms.FormTitle tag="h2">Custom Commands</Forms.FormTitle>
            {currentSettings.customCommands &&
                currentSettings.customCommands.map((cmd: CustomCommand) => (
                    <div
                        key={cmd.id}
                        style={{
                            border: "1px solid var(--background-modifier-accent)",
                            padding: "10px",
                            margin: "10px 0",
                            borderRadius: "4px",
                        }}
                    >
                        <TextInput
                            value={cmd.name}
                            onChange={(val: string) =>
                                handleCustomCommandChange(cmd.id, "name", val)
                            }
                            placeholder="/mycommand"
                        />
                        <TextInput
                            value={cmd.description}
                            onChange={(val: string) =>
                                handleCustomCommandChange(
                                    cmd.id,
                                    "description",
                                    val,
                                )
                            }
                            placeholder="What does this command do?"
                        />
                        <Forms.FormText>Command Type</Forms.FormText>
                        <TextInput
                            value={cmd.type}
                            onChange={(value: string) =>
                                handleCustomCommandChange(cmd.id, "type", value)
                            }
                            placeholder={commandTypeOptions
                                .map(o => o.value)
                                .join(" or ")}
                        />
                        <Button
                            color={Button.Colors.RED}
                            onClick={() => deleteCustomCommand(cmd.id)}
                        >
                            Delete Command
                        </Button>
                    </div>
                ))}
            <Button color={Button.Colors.GREEN} onClick={addCustomCommand}>
                Add New Custom Command
            </Button>
        </div>
    );
}
