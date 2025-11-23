// Test file to verify the UseSettings type fix
import { Settings, UseSettings } from "./src/api/Settings";

// This should compile without errors if the type fix is working
type SettingsPaths = UseSettings<Settings>;

// Test that the type produces the expected string paths
const testPaths: SettingsPaths[] = [
    "autoUpdate",
    "autoUpdateNotification",
    "plugins",
    "notifications",
    "cloud",
    "plugins.somePlugin",
    "plugins.somePlugin.enabled",
    "notifications.timeout",
    "cloud.url",
];

// This should work without TypeScript errors
function testUseSettingsFunction(paths?: SettingsPaths[]) {
    // This would normally be the actual useSettings function call
    return paths;
}

// Test that our type produces string literals, not 'never'
type StringLiteralTest = "autoUpdate" extends SettingsPaths ? true : false;
const stringLiteralWorks: StringLiteralTest = true;

// Test that nested object properties work
type PluginPathTest = "plugins.somePlugin" extends SettingsPaths ? true : false;
const pluginPathWorks: PluginPathTest = true;
