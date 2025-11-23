/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "@components/settings/tabs/plugins/components/styles.css";

import { BooleanSetting } from "@components/settings/tabs/plugins/components/BooleanSetting";
import {
    ComponentSettingProps,
    SettingProps,
} from "@components/settings/tabs/plugins/components/Common";
import { ComponentSetting } from "@components/settings/tabs/plugins/components/ComponentSetting";
import { NumberSetting } from "@components/settings/tabs/plugins/components/NumberSetting";
import { SelectSetting } from "@components/settings/tabs/plugins/components/SelectSetting";
import { SliderSetting } from "@components/settings/tabs/plugins/components/SliderSetting";
import { TextSetting } from "@components/settings/tabs/plugins/components/TextSetting";
import { OptionType } from "@utils/types";
import { ComponentType } from "react";

export const OptionComponentMap: Record<
    OptionType,
    ComponentType<SettingProps<any> | ComponentSettingProps<any>>
> = {
    [OptionType.STRING]: TextSetting,
    [OptionType.NUMBER]: NumberSetting,
    [OptionType.BIGINT]: NumberSetting,
    [OptionType.BOOLEAN]: BooleanSetting,
    [OptionType.SELECT]: SelectSetting,
    [OptionType.SLIDER]: SliderSetting,
    [OptionType.COMPONENT]: ComponentSetting,
    [OptionType.CUSTOM]: () => null,
};
