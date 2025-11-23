/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button, Forms, SearchableSelect, TextInput } from "@webpack/common";

// Safe wrapper components to handle webpack component loading
const SafeButton = Button || ((props: any) => (
    <button {...props} style={{
        color: "var(--text-normal)",
        background: "var(--button-secondary-background)",
        border: "none",
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer"
    }}>
        {props.children}
    </button>
));

const SafeForms = Forms || {
    FormTitle: (props: any) => <h2 style={{ color: "var(--header-primary)", marginBottom: "16px", fontSize: "20px", fontWeight: "600" }} {...props}>{props.children}</h2>,
    FormText: (props: any) => <div style={{ color: "var(--text-normal)", marginBottom: "8px" }} {...props}>{props.children}</div>
};

import { useAiFunSettings } from "./index"; // Corrected import for the hook
import { CustomCommand } from "./types"; // Import from new types.ts

// Safe wrapper components to handle webpack component loading
const SafeSearchableSelect = SearchableSelect || ((props: any) => {
    const { onChange, value, options, placeholder, ...restProps } = props;

    return (
        <div style={{ color: "var(--text-danger)", fontSize: "12px", padding: "4px 0" }}>
            SearchableSelect not loaded - fallback mode
            {onChange && (
                <button
                    onClick={() => {
                        if (options && options.length > 0) {
                            onChange(options[0].value);
                        }
                    }}
                    style={{
                        marginLeft: "8px",
                        padding: "4px 8px",
                        background: "var(--background-accent)",
                        border: "1px solid var(--background-floating)",
                        borderRadius: "4px",
                        color: "var(--text-normal)",
                        cursor: "pointer"
                    }}
                >
                    Select {options?.[0]?.label || "first option"}
                </button>
            )}
        </div>
    );
});

const SafeTextInput = TextInput || ((props: any) => {
    const { onChange, value, type, placeholder, ...restProps } = props;

    return (
        <input
            {...restProps}
            value={value || ""}
            type={type || "text"}
            placeholder={placeholder || ""}
            onChange={e => {
                if (onChange) {
                    onChange(e.target.value);
                }
            }}
            style={{
                background: "var(--background-secondary)",
                border: "1px solid var(--background-tertiary)",
                color: "var(--text-normal)",
                padding: "8px",
                borderRadius: "4px",
                width: "100%"
            }}
        />
    );
});

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
                { label: "GPT-4.5 Preview", value: "gpt-4.5-preview" },
                { label: "DALL-E 2", value: "dall-e-2" },
                { label: "DALL-E 3", value: "dall-e-3" },
            ]
            : currentSettings.aiProvider === "gemini"
                ? [
                    { label: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
                    {
                        label: "Gemini Flash Latest",
                        value: "gemini-flash-latest",
                    },
                    { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
                    { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
                    { label: "Gemini Pro", value: "gemini-pro" },
                    { label: "Gemini Pro Vision", value: "gemini-pro-vision" },
                ]
                : currentSettings.aiProvider === "claude"
                    ? [
                        {
                            label: "Claude 3.5 Sonnet",
                            value: "claude-3-5-sonnet",
                        },
                        { label: "Claude 3 Opus", value: "claude-3-opus" },
                        { label: "Claude 3 Sonnet", value: "claude-3-sonnet" },
                        { label: "Claude 3 Haiku", value: "claude-3-haiku" },
                    ]
                    : currentSettings.aiProvider === "cohere"
                        ? [
                            { label: "Command R+", value: "command-r-plus" },
                            { label: "Command R", value: "command-r" },
                            { label: "Command", value: "command" },
                            { label: "Command Light", value: "command-light" },
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
            cmd.id === id ? { ...cmd, [field]: value ?? "" } : cmd,
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
            <SafeForms.FormTitle>
                AI Provider Configuration
            </SafeForms.FormTitle>

            <SafeForms.FormText>OpenAI API Key</SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.openaiApiKey}
                onChange={(val: string) => (currentSettings.openaiApiKey = val)}
                type="password"
                placeholder="Enter your OpenAI API key"
            />

            <SafeForms.FormText>Google Gemini API Key</SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.geminiApiKey}
                onChange={(val: string) => (currentSettings.geminiApiKey = val)}
                type="password"
                placeholder="Enter your Gemini API key"
            />

            <SafeForms.FormText>Anthropic Claude API Key</SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.claudeApiKey}
                onChange={(val: string) => (currentSettings.claudeApiKey = val)}
                type="password"
                placeholder="Enter your Claude API key"
            />

            <SafeForms.FormText>Cohere API Key</SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.cohereApiKey}
                onChange={(val: string) => (currentSettings.cohereApiKey = val)}
                type="password"
                placeholder="Enter your Cohere API key"
            />

            <SafeForms.FormText>Select AI Provider</SafeForms.FormText>
            <SafeSearchableSelect
                options={providerOptions}
                onChange={(val: any) => {
                    const provider = typeof val === "string" ? val : val.value;
                    console.log("[AiFun] Switching provider to", provider);
                    currentSettings.aiProvider = provider;
                    // Set default model based on new provider
                    if (provider === "openai") {
                        currentSettings.aiModel = "gpt-3.5-turbo";
                    } else if (provider === "gemini") {
                        currentSettings.aiModel = "gemini-2.5-pro";
                    } else if (provider === "claude") {
                        currentSettings.aiModel = "claude-3-5-sonnet";
                    } else if (provider === "cohere") {
                        currentSettings.aiModel = "command-r-plus";
                    }
                    console.log("[AiFun] Set model to", currentSettings.aiModel);
                }}
                value={providerOptions.find(
                    o => o.value === currentSettings.aiProvider,
                )}
                placeholder="Select AI Provider"
                maxVisibleItems={5}
                closeOnSelect={true}
            />
            <SafeForms.FormText>AI Model</SafeForms.FormText>
            <SafeSearchableSelect
                options={modelOptions}
                onChange={(val: any) =>
                    (currentSettings.aiModel = typeof val === "string" ? val : val.value)
                }
                value={
                    modelOptions.find(
                        o => o.value === currentSettings.aiModel,
                    ) || modelOptions[0]
                }
                placeholder="Select AI Model"
                maxVisibleItems={5}
                closeOnSelect={true}
            />

            <SafeForms.FormTitle>Model Parameters</SafeForms.FormTitle>
            <SafeForms.FormText>
                Temperature (0-2): {currentSettings.temperature ?? 0.7}
            </SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.temperature?.toString() || "0.7"}
                onChange={(val: string) =>
                    (currentSettings.temperature = parseFloat(val) || 0.7)
                }
                type="number"
                min="0"
                max="2"
                step="0.1"
            />

            <SafeForms.FormText>
                Max Tokens: {currentSettings.maxTokens ?? 1000}
            </SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.maxTokens?.toString() || "1000"}
                onChange={(val: string) =>
                    (currentSettings.maxTokens = parseInt(val) || 1000)
                }
                type="number"
                min="1"
                max="4000"
            />

            <SafeForms.FormText>
                Top P (0-1): {currentSettings.topP ?? 1.0}
            </SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.topP?.toString() || "1.0"}
                onChange={(val: string) =>
                    (currentSettings.topP = parseFloat(val) || 1.0)
                }
                type="number"
                min="0"
                max="1"
                step="0.1"
            />

            <SafeForms.FormTitle>
                Image Generation Settings
            </SafeForms.FormTitle>
            <SafeForms.FormText>Image Quality</SafeForms.FormText>
            <SafeSearchableSelect
                options={imageQualityOptions}
                onChange={(val: any) =>
                    (currentSettings.imageQuality = typeof val === "string" ? val : val.value)
                }
                value={imageQualityOptions.find(
                    o => o.value === currentSettings.imageQuality,
                )}
                placeholder="Select Image Quality"
                maxVisibleItems={5}
                closeOnSelect={true}
            />

            <SafeForms.FormText>Image Size</SafeForms.FormText>
            <SafeSearchableSelect
                options={imageSizeOptions}
                onChange={(val: any) =>
                    (currentSettings.imageSize = typeof val === "string" ? val : val.value)
                }
                value={imageSizeOptions.find(
                    o => o.value === currentSettings.imageSize,
                )}
                placeholder="Select Image Size"
                maxVisibleItems={5}
                closeOnSelect={true}
            />

            <SafeForms.FormText>Image Style</SafeForms.FormText>
            <SafeSearchableSelect
                options={imageStyleOptions}
                onChange={(val: any) =>
                    (currentSettings.imageStyle = typeof val === "string" ? val : val.value)
                }
                value={imageStyleOptions.find(
                    o => o.value === currentSettings.imageStyle,
                )}
                placeholder="Select Image Style"
                maxVisibleItems={5}
                closeOnSelect={true}
            />

            <SafeForms.FormTitle>
                Advanced Settings
            </SafeForms.FormTitle>
            <SafeForms.FormText>System Prompt</SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.systemPrompt}
                onChange={(val: string) => (currentSettings.systemPrompt = val)}
                placeholder="Enter system prompt for AI"
            />

            <SafeForms.FormText>
                Timeout (ms): {currentSettings.timeoutMs ?? 30000}
            </SafeForms.FormText>
            <SafeTextInput
                value={currentSettings.timeoutMs?.toString() || "30000"}
                onChange={(val: string) =>
                    (currentSettings.timeoutMs = parseInt(val) || 30000)
                }
                type="number"
                min="5000"
                max="120000"
                step="5000"
            />

            <SafeForms.FormTitle>
                Custom Commands
            </SafeForms.FormTitle>
            {
                currentSettings.customCommands?.map((cmd: CustomCommand) => (
                    <div
                        key={cmd.id}
                        style={{
                            border: "1px solid var(--background-modifier-accent)",
                            padding: "10px",
                            margin: "10px 0",
                            borderRadius: "4px",
                        }}
                    >
                        <SafeTextInput
                            value={cmd.name}
                            onChange={(val: string) =>
                                handleCustomCommandChange(cmd.id, "name", val)
                            }
                            placeholder="/mycommand"
                        />
                        <SafeTextInput
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
                        <SafeForms.FormText>Command Type</SafeForms.FormText>
                        <SafeTextInput
                            value={cmd.type}
                            onChange={(value: string) =>
                                handleCustomCommandChange(cmd.id, "type", value)
                            }
                            placeholder={commandTypeOptions
                                .map(o => o.value)
                                .join(" or ")}
                        />
                        <SafeButton
                            onClick={() => deleteCustomCommand(cmd.id)}
                        >
                            Delete Command
                        </SafeButton>
                    </div>
                ))
            }
            <SafeButton onClick={addCustomCommand}>
                Add New Custom Command
            </SafeButton>
        </div >
    );
}
