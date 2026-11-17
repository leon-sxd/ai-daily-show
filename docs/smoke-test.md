# 干净目录渲染冒烟

## 目的

在不含本机 `.tools/`、`node_modules/`、私有 BGM、旧工程残留的全新目录里，验证模板可被复现：lint 通过、双版本静音渲染成功、合轨脚本可运行。

## 前置条件

- Node.js ≥ 22
- FFmpeg / FFprobe 在 PATH，或用 `HYPERFRAMES_FFMPEG_PATH` / `HYPERFRAMES_FFPROBE_PATH` 指定绝对路径
- 可访问 jsDelivr CDN（GSAP 3.14.2）

## 步骤

1. **全新拉取**：clone 仓库或下载 zip 解压到临时目录；确认其中没有 `renders/`、`assets/bgm.wav`、`.tools/`、`node_modules/`。

2. **横版 lint + 静音渲染**（在系统临时目录下操作）：

   ```bash
   cp -r templates/landscape smoke-landscape
   cd smoke-landscape
   npx --yes hyperframes@0.9.52 lint
   npx --yes hyperframes@0.9.52 render --resolution landscape -o renders/demo.silent.mp4
   ```

3. **竖版 lint + 静音渲染**：换用 `templates/portrait`，渲染加 `--resolution portrait`。

4. **产物校验（ffprobe）**：
   - 横版 1920×1080，竖版 1080×1920；
   - 时长 ≈ 90s，含视频流；
   - 竖版抽帧目检安全区：顶 ≥270px、底 ≥500px、左 96px、右 140px。

5. **合轨冒烟（不用私有 BGM）**：现场生成一段 90s 静音测试音，跑合轨脚本校验音轨可合成；dummy 文件与成片均不提交。

   ```bash
   ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t 90 assets/dummy.wav
   node tools/mux-bgm.js --project-dir . --input renders/demo.silent.mp4 --output renders/demo.mp4 --bgm assets/dummy.wav
   ```

## 通过标准

- 横 / 竖双版本 `lint` 均为 0 errors / 0 warnings；
- 静音源分辨率、时长正确，可正常解码；
- 合轨脚本退出码 0，输出含 AAC 音轨；
- 模板中无本地私有路径、私有素材或凭证残留；允许的外链仅 CDN、上游仓库与官方文档。

## 已知未覆盖

- 旁白 TTS 未接入，宿主 voice 音频标签保持注释；
- 完整 90s 渲染耗时与 FFmpeg 表现按执行机器而定。
