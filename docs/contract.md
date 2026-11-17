# HyperFrames 组合契约（自有整理）

> 本文件按上游 HyperFrames 官方文档与实际 lint 经验整理，不复制任何第三方技能原文。上游仓库：https://github.com/heygen-com/hyperframes

## 结构

- 根节点带 `data-composition-id`、`data-width`、`data-height`、`data-duration`。
- 片段用 `class="clip"` + `data-start` + `data-duration`。
- 注册一条 **paused** 的 GSAP 时间线到 `window.__timelines["<id>"]`，key 与根节点 `data-composition-id` 一致。
- 多镜工程采用模块化子组合：每个场景一个 `compositions/scene-*.html`，宿主用 `data-composition-src` 挂载；宿主 id、子组合根 id、时间线 key 三者一致。
- 独立顶层组合根节点直接放 `<body>`，不用 `<template>` 包裹；子组合文件内部才用 `<template>` 承载。

## 动画与确定性

- 只动画子元素，不 tween `.clip` 元素本身（可见性由框架管理）。
- 禁止 `Math.random`、`Date.now` / 实时时钟、未播种随机、网络请求等非确定性内容；复杂图形必须固定种子或预计算数组。
- 不使用 `<br>` 分行；分行用独立元素。
- 不给 `<video>` / `<audio>` 加 `crossorigin`；不调用 `video.play()` / `audio.play()` / seek。
- 每个 `id` 在整页唯一；被 transform 的元素必须是块级且已定尺寸。
- `repeat: -1` 仅在根 `data-duration` 有限时使用，否则用有限次数。

## 媒体

- BGM `data-volume` 约 0.2，不盖人声；旁白未接入前，voice 音频标签保持注释。
- 每个 `<audio>` 必须有 `id` 和 `src`；不要在代码里控制播放、暂停或 seek。
- 渲染前先 `lint`，0 错误 0 警告再 `render`。

## 常见 lint 报错对照

| 报错 | 原因 | 处理 |
|---|---|---|
| `gsap_css_transform_conflict` | CSS 初始 transform 与 GSAP 同属性 tween 冲突 | 初始态交给 `gsap.fromTo`，CSS 不写 transform |
| `gsap_animates_clip_element` | 直接 tween 了 `.clip` 的可见性/显示属性 | 改为动画 `.clip` 的子元素 |
| `media_crossorigin_breaks_preview` | 媒体标签加了 `crossorigin` | 去掉该属性 |
| `media_missing_id` | `<audio>` 缺 `id` | 补唯一 `id` |
| `standalone_composition_wrapped_in_template` | 顶层组合被 `<template>` 包裹 | 根节点直接放 `<body>` |
| `clip_ends_past_root_duration` | 片段超出根时长 | 同步延长根 `data-duration` |

## 图形与动效选择库

按分镜文案的核心意象选图，不固定使用某一种示例图形；每镜 **1 种主图形 + 至多 1 种辅助点缀**。优先 CSS / HTML / SVG 确定性实现。

### 九类候选

1. **基础几何矢量**：点、直线、折线、矩形、圆形、圆弧、多边形、贝塞尔曲线、自定义闭合路径。
2. **数据可视化图表**：折线、柱状、条形、饼图、环形、散点、雷达、面积、堆叠、箱线、树图、桑基图等；仅作示意，不赋予虚假业务含义。
3. **分形与生成纹样**：螺旋、Voronoi 碎块、分形树、几何镶嵌、裂纹与细胞状纹理。
4. **模拟与元胞自动机**：向量场、波干涉、驻波、粒子流、反应扩散斑纹。
5. **程序化纹理**：噪声纹理、像素画、纯色渐变与网格；Shader 特效仅在确定性可复现时使用。
6. **3D 图形**：立方体、球体、圆环、点云、线框投影；成本过高时降级为同类 2D 图形。
7. **结构与关系图**：流程、时序、思维导图、网络拓扑、知识图谱、依存树。
8. **文字类图形**：文字轮廓、点阵、沿曲线排列、粒子打散；必须保证中文可读、不溢出安全框。
9. **动态图形**：位移、旋转、形变、生长、粒子与流体图案。

### 语义匹配

| 分镜意象 | 推荐图形 | 推荐动效 |
|---|---|---|
| 增长 / 建立秩序 | 柱状条、阶梯、树形生长、螺旋 | 从底生长、逐步升高 |
| 混乱 / 无序 | 网格方块、散点、碎块、裂纹 | 漂移、扩散、碎裂 |
| 可能性 / 分支 | 树图、散点、思维导图 | 向外发散、分支生长 |
| 周期 / 循环 | 环形、圆环、波形、摆线 | 旋转、脉冲、往返 |
| 关系 / 网络 | 拓扑、知识图谱、力导向图 | 节点连线、渐进点亮 |
| 时间 / 过程 | 折线、面积图、时间轴 | 笔划生长、轨迹延伸 |
| 对比 / 分布 | 饼图、环形、雷达、箱线 | 扇区展开、逐项呈现 |
| 空间 / 结构 | 等距网格、点云、线框 | 逐层搭建、旋转入场 |
| 氛围 / 抽象 | 噪声纹理、波干涉、粒子流 | 流动、起伏、消散 |

### 安全框与降级

- 横版 1920×1080：四周 ≥64px。
- 竖版 1080×1920：顶部 ≥270px、底部 ≥500px、左 96px、右 140px，内容宽 844px。
- 复杂图形（分形、自动机、3D、Shader、纹理）必须固定种子或预计算数组；不满足确定性时降级为 2D 同类图形，不得牺牲 lint 通过性与可复现性。
