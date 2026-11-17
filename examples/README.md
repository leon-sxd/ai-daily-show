# examples 脱敏示例

`templates/landscape/` 与 `templates/portrait/` 本身就是一套已脱敏、可渲染的示例分镜：文案为中性占位（示例模型 / 要点一~三 / YYYY.MM.DD），不含真实热点、品牌专名、外部链接与私有素材。

## 本地跑通示例

```bash
# 横版
cp -r templates/landscape examples/demo-landscape
cd examples/demo-landscape
npx --yes hyperframes@0.9.52 lint
npx --yes hyperframes@0.9.52 preview

# 竖版（另开终端）
cp -r templates/portrait examples/demo-portrait
cd examples/demo-portrait
npx --yes hyperframes@0.9.52 lint
```

## 冒烟验收清单

- [ ] 两个比例 `lint` 均为 0 errors / 0 warnings。
- [ ] 预览中文字落在安全框内：横版四周 ≥64px；竖版顶 ≥270px、底 ≥500px、左 96px、右 140px。
- [ ] 图形分步入场，无 `Math.random` / 实时时钟 / 网络请求。
- [ ] 未自备 BGM 前，宿主音频标签保持注释；自备后再放开 `assets/bgm.wav` 对应行。

注意：不要把真实期次的 `renders/`、`ai_daily/`、`ai_weekly/` 成品与来源清单复制到本目录。
