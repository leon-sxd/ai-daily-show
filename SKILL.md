---
name: ai-daily-show
description: 基于 HyperFrames 的 AI 日报/周报科普短视频生产技能。当用户需要制作每日 AI 日报、每周 AI 周报或同类 AI 知识科普短视频，要求横版 16:9 + 竖版 9:16 双版本、90 秒分镜、lint 校验、静音渲染与自备 BGM 合轨时使用；按仓库模板填充当期文案、产出成片与发布物料，不自动发布到平台。
---

# AI Daily Show

## 前置检查

- Node.js ≥ 22；FFmpeg / FFprobe 在 PATH，或通过 `HYPERFRAMES_FFMPEG_PATH` / `HYPERFRAMES_FFPROBE_PATH` 指定绝对路径。
- HyperFrames CLI 走 `npx --yes hyperframes@0.9.52`；GSAP 3.14.2 经固定版本 CDN 引入。
- 自备授权 BGM 放到 `assets/bgm.wav`；未自备时只产出静音源，不编造音频素材。

## 工作流

1. **选题与来源**：检索当期 AI 热点；热点不足时加深概念讲解并补具体举例。逐条记录获悉渠道、时间点、外部链接与口径，整理信息来源清单——仅后台存档，不写进视频画面。
2. **复制模板**：横版 `templates/landscape`，竖版 `templates/portrait`；替换 10 镜占位文案，不改时间线结构、id 与挂载关系。
3. **角标口径**：日报「今日观察」，周报「本周观察」；封面角标、主线镜、结尾镜、浏览器标题四处保持一致。
4. **契约校验**：先跑 `lint`，0 errors / 0 warnings 后再 `preview` 或 `render`。
5. **渲染**：横版 1920×1080、竖版 1080×1920，90s、30fps；保留 `.silent.mp4` 静音备份。
6. **合轨**：用 `tools/mux-bgm.ps1`（Windows）或 `tools/mux-bgm.js`（跨平台 Node）合入自备 BGM；AAC 256k、开头 30ms 淡入、取前 90s。
7. **物料与归档**：标题（主推 + 备选）、简介文案、双封面占位、信息来源清单、发布物料文档，按期次归档到本地目录；当期成品与来源不进入模板仓库。

## 参考文档（需要时再读）

- `docs/workflow.md`：完整生产流程与归档约定
- `docs/contract.md`：组合契约、确定性规则、图形选择库
- `docs/layout-landscape.md` / `docs/layout-portrait.md`：排版参数与安全区
- `docs/cover-spec.md`：封面槽位、正圆约束与避让区
- `docs/smoke-test.md`：干净目录 lint 与完整渲染冒烟流程

## 边界

- 不内置平台登录态、自动填表或发布脚本；最终上传、封面裁剪核对、发布由人工在创作者中心完成。
- 不随模板分发私有素材：BGM、成品封面、当期文案与来源清单均由使用者自备或本地留存。
- 不在组合代码里调用 `play()` / `pause()` / seek；不使用 `Math.random`、实时时钟、网络请求等非确定性内容。
