import { ComponentPluginOptions } from '@mdit-vue/plugin-component';
import { HeadersPluginOptions } from '@mdit-vue/plugin-headers';
import { TocPluginOptions } from '@mdit-vue/plugin-toc';
import { ThemeRegistrationAny, LanguageInput, ShikiTransformer } from '@shikijs/types';
import anchorPlugin from 'markdown-it-anchor';
import { Options as Options$1, MarkdownItAsync } from 'markdown-it-async';
import { BuiltinTheme, BuiltinLanguage, Highlighter } from 'shiki';
export { BundledLanguage, BundledLanguageInfo, BundledTheme, BundledThemeInfo, bundledLanguages, bundledLanguagesInfo, bundledThemes, bundledThemesInfo, createHighlighterCore } from 'shiki';

type Awaitable<T> = T | PromiseLike<T>;

interface ContainerOptions {
    infoLabel?: string;
    noteLabel?: string;
    tipLabel?: string;
    warningLabel?: string;
    dangerLabel?: string;
    detailsLabel?: string;
    importantLabel?: string;
    cautionLabel?: string;
}

interface Options {
    /**
     * Support native lazy loading for the `<img>` tag.
     * @default false
     */
    lazyLoading?: boolean;
}

type ThemeOptions = ThemeRegistrationAny | BuiltinTheme | {
    light: ThemeRegistrationAny | BuiltinTheme;
    dark: ThemeRegistrationAny | BuiltinTheme;
};
interface MarkdownOptions extends Options$1 {
    /**
     * 在应用插件前设置 markdown-it 实例
     * Setup markdown-it instance before applying plugins
     */
    preConfig?: (md: MarkdownItAsync) => Awaitable<void>;
    /**
     * 设置 markdown-it 实例
     * Setup markdown-it instance
     */
    config?: (md: MarkdownItAsync) => Awaitable<void>;
    /**
     * 禁用缓存（实验性功能）
     * Disable cache (experimental)
     */
    cache?: boolean;
    /**
     * 外部链接的属性配置
     * Attributes configuration for external links
     */
    externalLinks?: Record<string, string>;
    /**
     * 语法高亮的自定义主题
     * 您也可以传递一个包含 `light` 和 `dark` 主题的对象以支持双主题
     *
     * @example { theme: 'github-dark' }
     * @example { theme: { light: 'github-light', dark: 'github-dark' } }
     *
     * 您可以使用现有的主题
     * @see https://shiki.style/themes
     * 或者添加您自己的主题
     * @see https://shiki.style/guide/load-theme
     *
     * Custom theme for syntax highlighting.
     * You can also pass an object with `light` and `dark` themes to support dual themes.
     */
    theme?: ThemeOptions;
    /**
     * 用于语法高亮的自定义语言或预加载内置语言
     * @see https://shiki.style/languages
     *
     * Custom languages for syntax highlighting or pre-load built-in languages.
     */
    languages?: (LanguageInput | BuiltinLanguage)[];
    /**
     * 语法高亮的自定义语言别名
     * 将自定义语言名称映射到现有语言
     * 别名查找不区分大小写，语言名称中的下划线显示为空格
     *
     * @example
     *
     * 将 `my_lang` 映射为使用 Python 语法高亮
     * ```js
     * { 'my_lang': 'python' }
     * ```
     *
     * 在 markdown 中的使用：
     * ````md
     * ```My_Lang
     * # 这将被高亮显示为 Python 代码
     * # 并将显示 "My Lang" 作为语言标签
     * print("Hello, World!")
     * ```
     * ````
     * 加载自定义语言
     *
     * @see https://shiki.style/guide/load-lang#custom-language-aliases
     *
     * Custom language aliases for syntax highlighting.
     * Maps custom language names to existing languages.
     * Alias lookup is case-insensitive and underscores in language names are displayed as spaces.
     */
    languageAlias?: Record<string, string>;
    /**
     * 用于显示的自定义语言标签
     * 覆盖代码块中显示的默认语言标签
     * 键不区分大小写
     *
     * @example { 'vue': 'Vue SFC' }
     *
     * Custom language labels for display.
     * Overrides the default language label shown in code blocks.
     * Keys are case-insensitive.
     */
    languageLabel?: Record<string, string>;
    /**
     * 在代码块中显示行号
     * @default false
     *
     * Show line numbers in code blocks
     */
    lineNumbers?: boolean;
    /**
     * 当指定的语言不可用时的回退语言
     *
     * Fallback language when the specified language is not available.
     * 默认渲染的语法 txt
     */
    defaultHighlightLang?: string;
    /**
     * 应用于代码块的转换器 shiki的转换器
     * @see https://shiki.style/guide/transformers
     *
     * Transformers applied to code blocks
     */
    codeTransformers?: ShikiTransformer[];
    /**
     * 设置 Shiki 实例
     *
     * Setup Shiki instance
     */
    shikiSetup?: (shiki: Highlighter) => void | Promise<void>;
    /**
     * 代码块中复制按钮的提示文本
     * @default 'Copy Code'
     *
     * The tooltip text for the copy button in code blocks
     */
    codeCopyButtonTitle?: string;
    /**
     * 为 markdown-it 设计的标题锚点生成.
     * `markdown-it-anchor` 的选项
     * @see https://github.com/valeriangalliat/markdown-it-anchor
     *
     * Options for `markdown-it-anchor`
     */
    anchor?: anchorPlugin.AnchorOptions;
    /**
     * markdown-it-attrs 是一个用于扩展 Markdown 语法的插件，它允许你直接在 Markdown 中为元素添加 HTML 属性（如类名、ID、样式等）
     * `markdown-it-attrs` 的选项
     * @see https://github.com/arve0/markdown-it-attrs
     *
     * Options for `markdown-it-attrs`
     */
    attrs?: {
        leftDelimiter?: string;
        rightDelimiter?: string;
        allowedAttributes?: Array<string | RegExp>;
        disable?: boolean;
    };
    /**
     * 为 markdown-it 提供了 emoji 支持。
     * 它会将 Markdown 中的 emoji 转换为对应的 HTML 实体。
     * `markdown-it-emoji` 的选项
     * @see https://github.com/markdown-it/markdown-it-emoji
     *
     * Options for `markdown-it-emoji`
     */
    emoji?: {
        defs?: Record<string, string>;
        enabled?: string[];
        shortcuts?: Record<string, string | string[]>;
    };
    /**
     * 这个有使用到node 环境，不能在浏览器中使用
     * `@mdit-vue/plugin-frontmatter` 的选项
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-frontmatter
     *
     * Options for `@mdit-vue/plugin-frontmatter`
     */
    /**
     *  * @mdit-vue/plugin-headers 是一个专为 Vue 生态优化的 Markdown 插件，用于提取和处理 Markdown 文档中的标题（headers）信息。
     * 它基于 markdown-it 解析器，为 Vue 应用提供更强大的标题导航、目录生成和锚点功能。
     * `@mdit-vue/plugin-headers` 的选项
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-headers
     *
     * Options for `@mdit-vue/plugin-headers`
     */
    headers?: HeadersPluginOptions | boolean;
    /**
     * 允许在 Markdown 文件中直接编写 Vue 单文件组件（SFC）代码，并在渲染时正确解析为可复用的 Vue 组件。
     *  Markdown 中编写的 <template>, <script>, <style> 块会被识别为 Vue 组件。
        这些组件可在同一 Markdown 文件或其他 Vue 组件中直接引用。
        适用于文档驱动开发（如组件库文档），可实时展示组件示例与代码。
     * Options for `@mdit-vue/plugin-sfc`
     * `@mdit-vue/plugin-sfc` 的选项
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-sfc
     *
     * Options for `@mdit-vue/plugin-sfc`
     */
    /**
     * * 自动生成 Markdown 文档的目录（Table of Contents），基于标题结构创建导航链接。
     * 使用后结果：
        在 Markdown 中插入 [[toc]] 标记，会被替换为包含所有标题的层级列表。
        目录项自动链接到对应标题的锚点（如 <a href="#标题-1">标题 1</a>）。
        支持自定义深度（如只显示 h2-h3 标题）和样式。
     * Options for `@mdit-vue/plugin-toc`
     * `@mdit-vue/plugin-toc` 的选项
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc
     *
     * Options for `@mdit-vue/plugin-toc`
     */
    toc?: TocPluginOptions;
    /**
     *    * 增强 Markdown 对 Vue 组件的支持，允许在 Markdown 中直接使用 Vue 组件标签。
     *
     * 可直接在 Markdown 中嵌入 Vue 组件
     * 在web端中可能用不了，由于是使用了node读取文件在转换成html，
     *
     * `@mdit-vue/plugin-component` 的选项
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-component
     *
     * Options for `@mdit-vue/plugin-component`
     */
    component?: ComponentPluginOptions;
    /**
     *   * 创建自定义的块级容器，用于包裹特定内容（如提示、警告、代码块等）。
     *
     *
     *   ::: warning
          这是一个警告信息
          :::
     * 输出
          <div class="warning">
            <p>这是一个警告信息</p>
          </div>
     * `markdown-it-container` 的选项
     * @see https://github.com/markdown-it/markdown-it-container
     *
     * Options for `markdown-it-container`
     */
    container?: ContainerOptions;
    /**
     * 数学公式支持
     *
     * 您需要安装 `markdown-it-mathjax3` 并将 `math` 设置为 `true` 来启用它
     * 您也可以在这里传递 `markdown-it-mathjax3` 的选项
     * @default false
     * @see https://vitepress.dev/guide/markdown#math-equations
     *
     * Math support
     * You need to install `markdown-it-mathjax3` and set `math` to `true` to enable it.
     */
    math?: boolean | any;
    /**
     * 图片插件选项
     *
     * Image plugin options
     */
    image?: Options;
    /**
     * 允许禁用 GitHub 风格的提示框插件
     * @default true
     * @see https://vitepress.dev/guide/markdown#github-flavored-alerts
     *
     * Allows disabling the github alerts plugin
     */
    gfmAlerts?: boolean;
    /**
     * 允许禁用 CJK 友好插件
     * 此插件添加对日语、中文和韩语文本中强调标记（**粗体**）的支持
     * @default true
     * @see https://github.com/tats-u/markdown-cjk-friendly
     *
     * Allows disabling the CJK-friendly plugin.
     * This plugin adds support for emphasis marks (**bold**) in Japanese, Chinese, and Korean text.
     */
    cjkFriendlyEmphasis?: boolean;
    /**
     * @see cjkFriendlyEmphasis
     * @deprecated 使用 `cjkFriendly` 代替
     *
     * @see cjkFriendlyEmphasis
     * @deprecated use `cjkFriendly` instead
     */
    cjkFriendly?: boolean;
}
type MarkdownRenderer = MarkdownItAsync;
declare function disposeMdItInstance(): void;
/**
 * @experimental
 */
declare function createMarkdownRenderer(options?: MarkdownOptions, baseURL?: string, logger?: Pick<Console, 'warn'>): Promise<MarkdownRenderer>;

export { createMarkdownRenderer, disposeMdItInstance };
