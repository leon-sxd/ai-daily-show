# HyperFrames 组合契约（自有整理）

> 本文件按上游 HyperFrames 官方文档与实际 lint 经验整理，不复制任何第三方技能原文。

## 结构

- 根节点带 `data-composition-id`、`data-width`、`data-height`、`data-duration`。
- 片段用 `class="clip"` + `data-start` + `data-duration`。
- 注册一条 **paused** 的 GSAP 时间线到 `window.__timelines["<id>"]`，key 与根节点 `data-composition-id` 一致。
- 多镜工程采用模块化子组合：每个场景一个 `compositions/scene-*.html`，宿主用 `data-composition-src` 挂载；宿主 id、子组合根 id、时间线 key 三者一致。

## 动画与确定性

- 只动画子元素，不 tween `.clip` 元素本身（可见性由框架管理）。
- 禁止 `Math.random`、实时时钟等非确定性内容；复杂图形必须固定种子 / 预计算数组。
- 不使用 `<br>` 分行；分行用独立元素。
- 不给 `<video>` / `<audio>` 加 `crossorigin`；不调用 `video.play()` / `audio.play()` / seek。
- 每个 audio 必须有 `id` 和 `src`。

## 媒体

- BGM `data-volume` 约 0.2，不盖人声；旁白未接入前，voice 音频标签保持注释。
- 渲染前先 `lint`，0 错误 0 警告再 `render`。

## 待补

- 九大类图形 / 动效选择库（增长、混乱、分支、周期、网络、时间、对比、空间、氛围）与确定性实现约束，按上游文档补全。
