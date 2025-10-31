-1 初步完成


#  计划


第一种打包不需要打精简包，可以只需要把 ts 文件打包成 js 文件，其他代码可以打包成精简的独立 js文件，因为这样是可以在安装插件后看得懂代码，然后最后的打包交给使用者自行打包



# 在web段不能使用部分

不能在md文件中导入其他文件，测试运行后打开页面在 标题 #包含 markdown 文件 的这个部分就能看到
数学公式也不可以在web段渲染，需要在本地运行才能看到

# 打包问题

nanoid 再web使用要 使用 'nanoid/non-secure' 这个版本

# vue部分

`当你在 script 中引入 css 的时候，又打包成一个 css 文件时`
导入的顺序会影响最终的样式顺序，他会按照顺序打包到最终的样式文件中

比如:

```vue
<script setup lang="ts">
import '../styles/fonts.css'
import '../styles/vars.css'
import '../styles/icons.css'
import '../styles/base.css'
import '../styles/utils.css'
import '../styles/components/custom-block.css'
import '../styles/components/vp-code-group.css'
import '../styles/components/vp-code.css'
import '../styles/components/vp-doc.css'
import '../styles/components/vp-sponsor.css'

import { ref, shallowRef, onMounted, nextTick, computed, type Ref, watch, onUnmounted } from 'vue'
import { type MenuItem, getHeaders, useActiveAnchor, findScrollableParent, isScrollHeight } from './outline'


import VPDocOutlineItem from './VPDocOutlineItem.vue'
import VPLocalNavOutlineDropdown from './VPLocalNavOutlineDropdown.vue'
</script>

```

按照上面的代码，最终打包的顺序就是你引入的顺序

## vue-tsc 生成 d.ts 文件


## 可以借助 vue-tsc 生成所有的 d.ts 文件，生成 d.ts 文件底层是调用 typescript 的 API，在 rollup 中也是一样，那些插件都是基于 ts 提供的 API 来实现的


## 2024-12-24 vue-tsc的问题

使用 vue-tsc 生成d.ts文件会报错
```lua
Search string not found: "/supportedTSExtensions = .*(?=;)/"
(Use `node --trace-uncaught ...` to show where the exception was thrown)
```

[参考链接](https://juejin.cn/post/7447374654720688179)


# 注释
@rollup/plugin-replace 是 Rollup 构建工具中用于字符串替换的插件，主要作用是在打包过程中动态修改代码内容。

@rollup/plugin-node-resolve 是 Rollup 的核心模块解析插件

```js
nodeResolve({
  preferBuiltins: false, // 禁用内置模块优先 (如fs/path等)
  extensions: ['.js', '.json'], // 默认处理的扩展名
  modulePaths: [] // 自定义模块搜索路径
})
```


在 @mdit-vue/shared 插件包中，slugify 是一个用于将文本转换为符合 URL/HTML 规范的 “slug” 字符串的工具函数。它的核心作用是处理文本（尤其是 Markdown 标题），生成可用于锚点链接（anchor）、URL 路径等场景的标准化字符串。

1. 为 Markdown 标题生成锚点 ID
Markdown 中通常会有各级标题（如 # 标题、## 子标题），转换为 HTML 时会对应 <h1>、<h2> 等标签。为了支持页面内锚点跳转（如点击目录跳转到对应标题），需要给这些标题标签添加唯一的 id 属性。
slugify 会将标题文本转换为标准化的 id，例如：
Markdown 标题：## 安装与配置
经 slugify 处理后生成 id：安装与配置（或根据规则处理为 an-zhuang-yu-pei-zhi，取决于具体实现）
最终 HTML：<h2 id="安装与配置">安装与配置</h2>，支持通过 #安装与配置 锚点跳转。
2. 处理重复标题，确保 ID 唯一性
如果 Markdown 中有重复的标题（如多个 ## 注意事项），直接使用 slugify 会生成重复的 id，导致锚点冲突。因此 @mdit-vue 中的 slugify 通常会配合 “去重逻辑”，例如在重复 slug 后添加计数器：
第一个重复标题：## 注意事项 → id="注意事项"
第二个重复标题：## 注意事项 → id="注意事项-1"
第三个重复标题：## 注意事项 → id="注意事项-2"
3. 支持多语言和特殊字符处理
@mdit-vue/shared 的 slugify 通常会针对多语言（尤其是中文、日文等非拉丁字符）做适配，避免直接过滤非拉丁字符导致的信息丢失。例如：
原始文本：Vue 3 新特性：Composition API
处理后：vue-3-新特性-composition-api（保留中文，替换空格为连字符，英文转小写）

# 

```js 
[
    "ABAP",
    "ActionScript",
    "Ada",
    "Angular HTML",
    "Angular TypeScript",
    "Apache Conf",
    "Apex",
    "APL",
    "AppleScript",
    "Ara",
    "AsciiDoc",
    "Assembly",
    "Astro",
    "AWK",
    "Ballerina",
    "Batch File",
    "Beancount",
    "Berry",
    "BibTeX",
    "Bicep",
    "Blade",
    "1C (Enterprise)",
    "C",
    "Cadence",
    "Cairo",
    "Clarity",
    "Clojure",
    "CMake",
    "COBOL",
    "CODEOWNERS",
    "CodeQL",
    "CoffeeScript",
    "Common Lisp",
    "Coq",
    "C++",
    "Crystal",
    "C#",
    "CSS",
    "CSV",
    "CUE",
    "Cypher",
    "D",
    "Dart",
    "DAX",
    "Desktop",
    "Diff",
    "Dockerfile",
    "dotEnv",
    "Dream Maker",
    "Edge",
    "Elixir",
    "Elm",
    "Emacs Lisp",
    "ERB",
    "Erlang",
    "Fennel",
    "Fish",
    "Fluent",
    "Fortran (Fixed Form)",
    "Fortran (Free Form)",
    "F#",
    "GDResource",
    "GDScript",
    "GDShader",
    "Genie",
    "Gherkin",
    "Git Commit Message",
    "Git Rebase Message",
    "Gleam",
    "Glimmer JS",
    "Glimmer TS",
    "GLSL",
    "Gnuplot",
    "Go",
    "GraphQL",
    "Groovy",
    "Hack",
    "Ruby Haml",
    "Handlebars",
    "Haskell",
    "Haxe",
    "HashiCorp HCL",
    "Hjson",
    "HLSL",
    "HTML",
    "HTML (Derivative)",
    "HTTP",
    "HXML",
    "Hy",
    "Imba",
    "INI",
    "Java",
    "JavaScript",
    "Jinja",
    "Jison",
    "JSON",
    "JSON5",
    "JSON with Comments",
    "JSON Lines",
    "Jsonnet",
    "JSSM",
    "JSX",
    "Julia",
    "Kotlin",
    "Kusto",
    "LaTeX",
    "Lean 4",
    "Less",
    "Liquid",
    "Log file",
    "Logo",
    "Lua",
    "Luau",
    "Makefile",
    "Markdown",
    "Marko",
    "MATLAB",
    "MDC",
    "MDX",
    "Mermaid",
    "MIPS Assembly",
    "Mojo",
    "Move",
    "Narrat Language",
    "Nextflow",
    "Nginx",
    "Nim",
    "Nix",
    "nushell",
    "Objective-C",
    "Objective-C++",
    "OCaml",
    "Pascal",
    "Perl",
    "PHP",
    "PL/SQL",
    "Gettext PO",
    "Polar",
    "PostCSS",
    "PowerQuery",
    "PowerShell",
    "Prisma",
    "Prolog",
    "Protocol Buffer 3",
    "Pug",
    "Puppet",
    "PureScript",
    "Python",
    "QML",
    "QML Directory",
    "Qt Style Sheets",
    "R",
    "Racket",
    "Raku",
    "ASP.NET Razor",
    "Windows Registry Script",
    "RegExp",
    "Rel",
    "RISC-V",
    "reStructuredText",
    "Ruby",
    "Rust",
    "SAS",
    "Sass",
    "Scala",
    "Scheme",
    "SCSS",
    "1C (Query)",
    "ShaderLab",
    "Shell",
    "Shell Session",
    "Smalltalk",
    "Solidity",
    "Closure Templates",
    "SPARQL",
    "Splunk Query Language",
    "SQL",
    "SSH Config",
    "Stata",
    "Stylus",
    "Svelte",
    "Swift",
    "SystemVerilog",
    "Systemd Units",
    "TalonScript",
    "Tasl",
    "Tcl",
    "Templ",
    "Terraform",
    "TeX",
    "TOML",
    "TypeScript with Tags",
    "TSV",
    "TSX",
    "Turtle",
    "Twig",
    "TypeScript",
    "TypeSpec",
    "Typst",
    "V",
    "Vala",
    "Visual Basic",
    "Verilog",
    "VHDL",
    "Vim Script",
    "Vue",
    "Vue HTML",
    "Vyper",
    "WebAssembly",
    "Wenyan",
    "WGSL",
    "Wikitext",
    "Wolfram",
    "XML",
    "XSL",
    "YAML",
    "ZenScript",
    "Zig"
]
```