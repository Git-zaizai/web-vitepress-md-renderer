
export type Awaitable<T> = T | PromiseLike<T>;

type DeepPartial<T> = T extends Record<string, any>
  ? T extends Date | RegExp | Function | ReadonlyMap<any, any> | ReadonlySet<any> | ReadonlyArray<any>
    ? T
    : { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * SFC block extracted from markdown
 */
export interface SfcBlock {
  /**
   * The type of the block
   */
  type: string;
  /**
   * The content, including open-tag and close-tag
   */
  content: string;
  /**
   * The content that stripped open-tag and close-tag off
   */
  contentStripped: string;
  /**
   * The open-tag
   */
  tagOpen: string;
  /**
   * The close-tag
   */
  tagClose: string;
}

export interface MarkdownSfcBlocks {
  /**
   * The `<template>` block
   */
  template: SfcBlock | null;
  /**
   * The common `<script>` block
   */
  script: SfcBlock | null;
  /**
   * The `<script setup>` block
   */
  scriptSetup: SfcBlock | null;
  /**
   * All `<script>` blocks.
   *
   * By default, SFC only allows one `<script>` block and one `<script setup>` block.
   * However, some tools may support different types of `<script>`s, so we keep all of them here.
   */
  scripts: SfcBlock[];
  /**
   * All `<style>` blocks.
   */
  styles: SfcBlock[];
  /**
   * All custom blocks.
   */
  customBlocks: SfcBlock[];
}

export interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number;
  /**
   * The title of the header
   */
  title: string;
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string;
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string;
  /**
   * The children of the header
   */
  children: Header[];
}

export interface SiteData<ThemeConfig = any> {
  base: string;
  cleanUrls?: boolean;
  lang: string;
  dir: string;
  title: string;
  titleTemplate?: string | boolean;
  description: string;
  themeConfig: ThemeConfig;
  scrollOffset: number | string | string[] | { selector: string | string[]; padding: number };
  locales: LocaleConfig<ThemeConfig>;
  localeIndex?: string;
  contentProps?: Record<string, any>;
  router: {
    prefetchLinks: boolean;
  };
  additionalConfig?: AdditionalConfigDict<ThemeConfig> | AdditionalConfigLoader<ThemeConfig>;
}

export interface SSGContext extends SSRContext {
  content: string;
  /** @experimental */
  vpSocialIcons: Set<string>;
}

export interface LocaleSpecificConfig<ThemeConfig = any> {
  lang?: string;
  dir?: string;
  title?: string;
  titleTemplate?: string | boolean;
  description?: string;
  head?: HeadConfig[];
  themeConfig?: DeepPartial<ThemeConfig>;
}

export type LocaleConfig<ThemeConfig = any> = Record<
  string,
  LocaleSpecificConfig<ThemeConfig> & { label: string; link?: string }
>;

export type AdditionalConfig<ThemeConfig = any> = LocaleSpecificConfig<ThemeConfig>;

export type AdditionalConfigDict<ThemeConfig = any> = Record<string, AdditionalConfig<ThemeConfig>>;

export type AdditionalConfigLoader<ThemeConfig = any> = (relativePath: string) => AdditionalConfig<ThemeConfig>[];

// Manually declaring all properties as rollup-plugin-dts
// is unable to merge augmented module declarations
export interface MarkdownEnv {
  /**
   * The raw Markdown content without frontmatter
   * 原始 Markdown 内容（不包含 frontmatter）
   */
  content?: string;
  /**
   * The excerpt that extracted by `@mdit-vue/plugin-frontmatter`
   *
   * - Would be the rendered HTML when `renderExcerpt` is enabled
   * - Would be the raw Markdown when `renderExcerpt` is disabled
   */
  /**
   * 通过 @mdit-vue/plugin-frontmatter 提取的摘要内容
   * - 当启用 renderExcerpt 时返回渲染后的 HTML
   * - 未启用时保留原始 Markdown 格式
   */
  excerpt?: string;
  /**
   * The frontmatter that extracted by `@mdit-vue/plugin-frontmatter`
   */
  /**
   * 通过 @mdit-vue/plugin-frontmatter 提取的 frontmatter 数据
   */
  frontmatter?: Record<string, unknown>;
  /**
   * The headers that extracted by `@mdit-vue/plugin-headers`
   */
  /**
   * 通过 @mdit-vue/plugin-headers 提取的标题层级结构
   */
  headers?: Header[];
  /**
   * SFC blocks that extracted by `@mdit-vue/plugin-sfc`
   */
  /**
   * 通过 @mdit-vue/plugin-sfc 提取的 SFC 代码块
   */
  sfcBlocks?: MarkdownSfcBlocks;
  /**
   * The title that extracted by `@mdit-vue/plugin-title`
   */
  /**
   * 通过 @mdit-vue/plugin-title 提取的页面标题
   */
  title?: string;
  path: string;
  relativePath: string;
  /**
   * 是否启用无后缀的干净 URL
   */
  cleanUrls: boolean;
  /**
   * 收集到的所有链接（用于存在性校验）
   */
  links?: string[];
  /**
   * 包含的文件列表（用于监听文件变化）
   */
  includes?: string[];
  realPath?: string;
  localeIndex?: string;
}
