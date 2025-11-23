/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ComponentSettingProps } from "@components/settings/tabs/plugins/components/Common";
import { PluginOptionComponent } from "@utils/types";

export function ComponentSetting({
    option,
    onChange,
}: ComponentSettingProps<PluginOptionComponent>) {
    return option.component({ setValue: onChange, option });
}
