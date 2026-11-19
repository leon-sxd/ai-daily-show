# AI Daily Show — 双版本 AI 科普短视频模板

一套基于 [HyperFrames](https://github.com/heygen-com/hyperframes)（Apache-2.0）的 90 秒 AI 科普短视频生产模板：每期产出横版 16:9（1920×1080）与竖版 9:16（1080×1920）双成片，配套标题、简介、封面模板引用与信息来源清单。

本仓库面向所有智能体与开发者，不绑定任何特定 Agent 技能运行时；读取文档与模板后，用 Node CLI 即可复现流程。

## 前置环境

- Node.js ≥ 22
- FFmpeg / FFprobe（加入 PATH，或通过环境变量指定绝对路径）
- 渲染走 HyperFrames CLI：`npx --yes hyperframes@0.9.52`
- 动画库 GSAP 3.14.2 经固定版本 CDN 引入，仓库不打包压缩产物

## 快速开始（手动 CLI）

```bash
# 1. 复制对应比例模板到工作目录
cp -r templates/landscape my-issue
cd my-issue

# 2. 校验组合契约
npx --yes hyperframes@0.9.52 lint

# 3. 预览
npx --yes hyperframes@0.9.52 preview

# 4. 渲染静音源（横版）
npx --yes hyperframes@0.9.52 render --resolution landscape -o renders/final.silent.mp4

# 5. 合入自备 BGM（二选一；脚本在仓库根目录 tools/ 下，可从仓库根目录调用，或随模板复制 tools/）
#    Windows PowerShell：
pwsh tools/mux-bgm.ps1 -ProjectDir . -InputMp4 renders/final.silent.mp4 -OutputMp4 renders/final.mp4
#    跨平台 Node（Windows / macOS / Linux）：
node tools/mux-bgm.js --project-dir . --input renders/final.silent.mp4 --output renders/final.mp4
```

竖版把模板换成 `templates/portrait`，渲染加 `--resolution portrait`。

## 作为 Agent 技能使用

仓库根目录的 `SKILL.md` 是一份 runtime 无关的 Agent 指令清单；支持技能目录的 Agent 可把本仓库克隆或下载到技能工作区，读取 `SKILL.md` 后按其中流程执行。之后可用类似指令触发：

- 「用 ai-daily-show 生成今天的 AI 日报」
- 「按 ai-daily-show 模板做本周 AI 周报，横版 + 竖版」

注意：GitHub 仓库不会被自动注册为技能；首次使用仍需先把仓库放到 Agent 的技能目录，或让 Agent 拉取仓库后阅读 `SKILL.md`。该流程不依赖任何旧版专用技能运行时。

## 目录结构

```
ai-daily-show/
├── SKILL.md              # Agent 指令清单（runtime 无关，供支持技能目录的 Agent 读取）
├── templates/
│   ├── landscape/        # 横版 16:9 模板（index.html + compositions/）
│   ├── portrait/         # 竖版 9:16 模板（index.html + compositions/）
│   └── covers/          # 4:3 / 3:4 封面占位版式（SVG）
├── tools/
│   ├── mux-bgm.ps1       # 静音成片 + 自备 BGM 合轨（Windows PowerShell）
│   └── mux-bgm.js        # 同一套口径的跨平台 Node 版合轨脚本
├── docs/
│   ├── workflow.md       # 选题 → 文案 → 工程 → lint → render → 合轨 → 归档 → 人工发布
│   ├── contract.md       # HyperFrames 组合契约（时间线、媒体、确定性规则）
│   ├── layout-landscape.md
│   ├── layout-portrait.md
│   ├── cover-spec.md     # 封面槽位、正圆约束、安全避让区
│   └── smoke-test.md     # 干净目录 lint + 完整渲染冒烟流程
├── examples/             # 一套可渲染的脱敏示例分镜
└── assets/               # 私有素材自备说明（不放真实成品）
```

## 自备素材（仓库不含）

以下素材权利归内容作者本人，**不随本仓库分发**；使用者需自备授权素材并放到对应位置：

- **BGM**：默认读取 `assets/bgm.wav`（44.1kHz 立体声，每期取前 90s，AAC 256k、开头 30ms 淡入）。仓库不附带音频文件。
- **封面成品图**：仓库只提供 `templates/covers/` 空白占位版式；成品封面由作者本地生成或设计，不入库。
- **当期文案与来源**：每期热点标题、正文、外部链接与来源清单属于当期内容，不进入模板仓库。

## 发布边界

- 仓库只负责产出成片、文案物料与来源清单；封面走本地固定模板，不逐期复制副本到期次归档目录；**不含任何平台自动填表、登录态或发布脚本**。
- 成片由人工在各平台创作者中心上传、粘贴标题与简介、核对封面裁剪框后自行发布。
- 投稿标题：主推与备选均 ≤30 个字符（抖音上限；B 站建议 ≤30、上限 80）；拟写后逐条计数核对，视频内分镜标题不受此限。

## 许可与署名

- 上游 HyperFrames CLI：HeyGen 开源，Apache-2.0，见 https://github.com/heygen-com/hyperframes
- GSAP 3.14.2：经 CDN 引入，按其标准许可使用，见 https://gsap.com/standard-license
- 本仓库自有代码许可：MIT（见 `LICENSE`）。

## 路线图

- [x] 合轨脚本跨平台版本（Node 调 ffmpeg，见 `tools/mux-bgm.js`）
- [ ] 旁白 TTS 接入（当前模板 voice 音频标签保持注释）
- [x] 仓库 LICENSE：MIT
- [x] 脱敏示例分镜（`templates/` 双版本即脱敏样例，说明见 `examples/README.md`）
- [x] 全新克隆目录 lint 冒烟（横/竖均 0 errors / 0 warnings）
- [x] 干净目录渲染冒烟流程文档（`docs/smoke-test.md`）
- [ ] 全新克隆目录完整 90s 实跑渲染复验（需本机 FFmpeg）
