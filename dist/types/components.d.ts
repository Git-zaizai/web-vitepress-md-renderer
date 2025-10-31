import * as vue from 'vue';

interface Outline {
    level?: number | [number, number] | 'deep';
    label?: string;
}
type ORange = Outline | Outline['level'] | false;

type __VLS_Props = {
    externalLinkIcon?: boolean;
    hasSidebar?: boolean;
    hasAside?: boolean;
    leftAside?: boolean;
    hasLocalNav?: boolean;
    title?: string;
    range?: ORange;
    content: string;
    asidePaddingTop?: boolean;
};
declare var __VLS_1: {};
declare var __VLS_3: {};
declare var __VLS_5: {};
type __VLS_Slots = {} & {
    'doc-top'?: (props: typeof __VLS_1) => any;
} & {
    'doc-aside'?: (props: typeof __VLS_3) => any;
} & {
    'doc-before'?: (props: typeof __VLS_5) => any;
};
declare const __VLS_base: vue.DefineComponent<__VLS_Props, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    asidePaddingTop: boolean;
}, {}, {}, {}, string, vue.ComponentProvideOptions, false, {}, any>;
declare const __VLS_export$1: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default$1: typeof __VLS_export$1;

type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare const __VLS_export: vue.DefineComponent<{}, {}, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;
declare const _default: typeof __VLS_export;

export { _default as VPDocAside, _default$1 as VPDocView };
