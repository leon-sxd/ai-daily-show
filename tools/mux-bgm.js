#!/usr/bin/env node
/**
 * 把自备 BGM 合到静音成片上（跨平台：Windows / macOS / Linux）。
 *
 * 与 tools/mux-bgm.ps1 同一套参数口径：视频流直接复制，音频转 AAC 256k 立体声，
 * 开头 30ms 淡入，BGM 不足时长处补静音，按 -t 截断到成片长度。
 *
 * 用法：
 *   node tools/mux-bgm.js --project-dir . --input renders/silent.mp4 --output renders/final.mp4
 *
 * 可选参数：
 *   --bgm assets/bgm.wav          BGM 路径（相对 project-dir 或绝对路径）
 *   --duration 90                 成片时长（秒）
 *   --audio-bitrate 256k          音频码率
 *
 * FFmpeg 路径优先取环境变量 HYPERFRAMES_FFMPEG_PATH，否则使用 PATH 中的 ffmpeg。
 * 本脚本不打包、不下载 FFmpeg，需使用者自行安装。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function fail(msg) {
  console.error(`错误：${msg}`);
  process.exit(1);
}

const args = parseArgs(process.argv);

const projectDir = path.resolve(args['project-dir'] || '.');
const inputArg = args.input;
const outputArg = args.output;
const bgmArg = args.bgm || 'assets/bgm.wav';
const duration = Number(args.duration || 90);
const audioBitrate = args['audio-bitrate'] || '256k';

if (!inputArg) fail('缺少 --input 静音成片路径');
if (!outputArg) fail('缺少 --output 输出成片路径');

const resolveIn = (p) => (path.isAbsolute(p) ? p : path.join(projectDir, p));
const bgmPath = resolveIn(bgmArg);
const inputPath = resolveIn(inputArg);
const outputPath = resolveIn(outputArg);

if (!fs.existsSync(bgmPath)) fail(`未找到 BGM：${bgmPath}`);
if (!fs.existsSync(inputPath)) fail(`未找到输入成片：${inputPath}`);

const ffmpeg = process.env.HYPERFRAMES_FFMPEG_PATH || 'ffmpeg';

const ffmpegArgs = [
  '-y',
  '-i', inputPath,
  '-i', bgmPath,
  '-map', '0:v:0',
  '-map', '1:a:0',
  '-c:v', 'copy',
  '-c:a', 'aac',
  '-b:a', audioBitrate,
  '-af', 'afade=t=in:st=0:d=0.03,apad',
  '-t', String(duration),
  outputPath,
];

const result = spawnSync(ffmpeg, ffmpegArgs, { stdio: 'inherit' });

if (result.error) {
  fail(`无法启动 FFmpeg：${result.error.message}（可设置 HYPERFRAMES_FFMPEG_PATH 指定路径）`);
}
if (result.status !== 0) {
  fail(`FFmpeg 合轨失败，退出码 ${result.status}`);
}

console.log(`合轨完成：${outputPath}`);
