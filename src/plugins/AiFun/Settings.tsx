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
    ];

    const modelOptions =
        currentSettings.aiProvider === "openai"
            ? [
                  { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
                  { label: "GPT-4", value: "gpt-4" },
                  { label: "DALL-E", value: "dall-e-2" },
              ]
            : [
                  { label: "Gemini Pro", value: "gemini-pro" },
                  { label: "Gemini Vision Pro", value: "gemini-pro-vision" },
              ];

    const commandTypeOptions = [
        { label: "AI Meme (Image Generation)", value: "aimeme" },
        { label: "Ask AI (Text Generation)", value: "askai" },
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
            <Forms.FormTitle tag="h2">AI Model Configuration</Forms.FormTitle>
            <TextInput
                value={currentSettings.apiKey}
                onChange={(val: string) => (currentSettings.apiKey = val)}
                type="password"
                placeholder="Enter your AI API key"
            />
            <Forms.FormText>AI Provider</Forms.FormText>
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

            <Forms.FormTitle tag="h2">Custom Commands</Forms.FormTitle>
            {currentSettings.customCommands &&
                currentSettings.customCommands.map((cmd: CustomCommand) => (
                    <div
                        key={cmd.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            margin: "10px 0",
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
