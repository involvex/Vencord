/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

declare module "stegcloak" {
    interface StegCloakMethods {
        hide(data: string, secret: string, cover?: string): string;
        reveal(stegData: string, secret: string): string;
    }

    interface StegCloakConstructor {
        new (encrypt?: boolean, passwordCheck?: boolean): StegCloakMethods;
    }

    const StegCloak: StegCloakConstructor;
    export default StegCloak;
}
