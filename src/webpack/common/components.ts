/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { TextCompat } from "@components/BaseText";
import { ButtonCompat } from "@components/Button";
import { Divider } from "@components/Divider";
import { FormSwitchCompat } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { LazyComponent } from "@utils/lazyReact";
import * as t from "@vencord/discord-types";
import { filters, mapMangledModuleLazy, waitFor } from "@webpack";

import { waitForComponent } from "./internal";

export const Forms = {
    // TODO: Stop using this and use Heading/Paragraph directly
    FormTitle: Heading,
    FormText: Paragraph,
    /** @deprecated don't use this */
    FormSection: "section" as never, // Backwards compat since Vesktop uses this
    /** @deprecated use `@components/Divider` */
    FormDivider: Divider as never, // Backwards compat since Vesktop uses this
};

// TODO: Stop using this and use Paragraph/Span directly
export const Text = TextCompat;
export const Button = ButtonCompat;
/** @deprecated Use FormSwitch from Vencord */
export const Switch = FormSwitchCompat as never;

export const Card = waitForComponent<any>(
    "Card",
    filters.componentByCode(".editable),", ".outline:"),
);
export const Checkbox = waitForComponent<any>(
    "Checkbox",
    filters.componentByCode(".checkboxWrapperDisabled:"),
);

const Tooltips = mapMangledModuleLazy(".tooltipTop,bottom:", {
    Tooltip: filters.componentByCode("this.renderTooltip()]"),
    TooltipContainer: filters.componentByCode('="div"'),
}) as any;

export const Tooltip = LazyComponent(() => (Tooltips as any).Tooltip);
export const TooltipContainer = LazyComponent(() => (Tooltips as any).TooltipContainer);

export const TextInput = waitForComponent<any>(
    "TextInput",
    filters.componentByCode("#{intl::MAXIMUM_LENGTH_ERROR}", '"input"'),
);
export const TextArea = waitForComponent<any>(
    "TextArea",
    filters.componentByCode("this.getPaddingRight()},id:"),
);
export const Select = waitForComponent<any>(
    "Select",
    filters.componentByCode('"Select"', ".newOptionLabel"),
);
export const SearchableSelect = waitForComponent<any>(
    "SearchableSelect",
    filters.componentByCode('"SearchableSelect"'),
);
export const Slider = waitForComponent<any>(
    "Slider",
    filters.componentByCode('"markDash".concat('),
);
export const Popout = waitForComponent<any>(
    "Popout",
    filters.componentByCode("ref:this.ref,", "renderPopout:this.renderPopout,"),
);
export const Dialog = waitForComponent<any>(
    "Dialog",
    filters.componentByCode('role:"dialog",tabIndex:-1'),
);
export const TabBar = waitForComponent(
    "TabBar",
    filters.componentByCode("ref:this.tabBarRef,className:"),
);
export const Paginator = waitForComponent<any>(
    "Paginator",
    filters.componentByCode('rel:"prev",children:'),
);
export const Clickable = waitForComponent<any>(
    "Clickable",
    filters.componentByCode("this.context?this.renderNonInteractive():"),
);
export const Avatar = waitForComponent<any>(
    "Avatar",
    filters.componentByCode(".size-1.375*"),
);

export const ColorPicker = waitForComponent<any>(
    "ColorPicker",
    filters.componentByCode(
        "#{intl::USER_SETTINGS_PROFILE_COLOR_SELECT_COLOR}",
        "showEyeDropper",
    ),
);

export const UserSummaryItem = waitForComponent(
    "UserSummaryItem",
    filters.componentByCode(
        "defaultRenderUser",
        "showDefaultAvatarsForNullUsers",
    ),
);

export let createScroller: (
    scrollbarClassName: string,
    fadeClassName: string,
    customThemeClassName: string,
) => t.ScrollerThin;
export let createListScroller: (
    scrollBarClassName: string,
    fadeClassName: string,
    someOtherClassIdkMan: string,
    resizeObserverClass: typeof ResizeObserver,
) => t.ListScrollerThin;
export let scrollerClasses: Record<string, string>;
export let listScrollerClasses: Record<string, string>;

waitFor(
    filters.byCode('="ltr",orientation:', "customTheme:", "forwardRef"),
    m => (createScroller = m),
);
waitFor(
    filters.byCode("getScrollerNode:", "resizeObserver:", "sectionHeight:"),
    m => (createListScroller = m),
);
waitFor(["thin", "auto", "customTheme"], m => (scrollerClasses = m));
waitFor(
    m => m.thin && m.auto && !m.customTheme,
    m => (listScrollerClasses = m),
);

export const ScrollerNone = LazyComponent(() =>
    (createScroller as any)(
        scrollerClasses.none,
        scrollerClasses.fade,
        scrollerClasses.customTheme,
    ),
);
export const ScrollerThin = LazyComponent(() =>
    (createScroller as any)(
        scrollerClasses.thin,
        scrollerClasses.fade,
        scrollerClasses.customTheme,
    ),
);
export const ScrollerAuto = LazyComponent(() =>
    (createScroller as any)(
        scrollerClasses.auto,
        scrollerClasses.fade,
        scrollerClasses.customTheme,
    ),
);

export const ListScrollerNone = LazyComponent(() =>
    (createListScroller as any)(
        listScrollerClasses.none,
        listScrollerClasses.fade,
        "",
        ResizeObserver,
    ),
);
export const ListScrollerThin = LazyComponent(() =>
    (createListScroller as any)(
        listScrollerClasses.thin,
        listScrollerClasses.fade,
        "",
        ResizeObserver,
    ),
);
export const ListScrollerAuto = LazyComponent(() =>
    (createListScroller as any)(
        listScrollerClasses.auto,
        listScrollerClasses.fade,
        "",
        ResizeObserver,
    ),
);

export const FocusLock = waitForComponent<any>(
    "FocusLock",
    filters.componentByCode(".containerRef,{keyboardModeEnabled:"),
);

export let useToken: any;
waitFor(
    m => {
        if (typeof m !== "function") {
            return false;
        }

        const str = String(m);
        return str.includes(".resolve({theme:null") && !str.includes("useMemo");
    },
    m => (useToken = m),
);

export const MaskedLink = waitForComponent<any>(
    "MaskedLink",
    filters.componentByCode("MASKED_LINK)"),
);
export const Timestamp = waitForComponent<any>(
    "Timestamp",
    filters.componentByCode("#{intl::MESSAGE_EDITED_TIMESTAMP_A11Y_LABEL}"),
);
export const Flex = waitForComponent<any>("Flex", [
    "Justify",
    "Align",
    "Wrap",
]);
export const OAuth2AuthorizeModal = waitForComponent(
    "OAuth2AuthorizeModal",
    filters.componentByCode(".authorize,children:", ".contentBackground"),
);

export const Animations = mapMangledModuleLazy(".assign({colorNames:", {
    Transition: filters.componentByCode('["items","children"]', ",null,"),
    animated: filters.byProps("div", "text"),
});
