/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { generateTextCss } from "@components/BaseText";
import { generateMarginCss } from "@components/margins";
import { createAndAppendStyle } from "@utils/css";

export function addVencordUiStyles() {
    createAndAppendStyle("vencord-text", document.head).textContent =
        generateTextCss();
    createAndAppendStyle("vencord-margins").textContent = generateMarginCss();
}
