# 把自备 BGM 合到静音成片上（横/竖版通用，Windows PowerShell）
# 用法：
#   pwsh tools/mux-bgm.ps1 -ProjectDir . -InputMp4 renders/silent.mp4 -OutputMp4 renders/final.mp4
# 说明：视频流直接复制，音频转 AAC 256k 立体声；开头 30ms 淡入，BGM 不足时长处补静音。
# FFmpeg 路径优先取环境变量 HYPERFRAMES_FFMPEG_PATH，否则使用 PATH 中的 ffmpeg。
param(
  [Parameter(Mandatory = $true)][string]$ProjectDir,
  [Parameter(Mandatory = $true)][string]$InputMp4,
  [Parameter(Mandatory = $true)][string]$OutputMp4,
  [string]$Bgm = "assets\bgm.wav",
  [double]$Duration = 90,
  [string]$AudioBitrate = "256k"
)

$ErrorActionPreference = "Stop"

$ff = $env:HYPERFRAMES_FFMPEG_PATH
if (-not $ff) { $ff = "ffmpeg" }

$bgmPath = Join-Path $ProjectDir $Bgm
$inputPath = if ([System.IO.Path]::IsPathRooted($InputMp4)) { $InputMp4 } else { Join-Path $ProjectDir $InputMp4 }
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputMp4)) { $OutputMp4 } else { Join-Path $ProjectDir $OutputMp4 }

if (-not (Test-Path -LiteralPath $bgmPath)) { throw "未找到 BGM：$bgmPath" }
if (-not (Test-Path -LiteralPath $inputPath)) { throw "未找到输入成片：$inputPath" }

& $ff -y -i $inputPath -i $bgmPath `
  -map 0:v:0 -map 1:a:0 `
  -c:v copy -c:a aac -b:a $AudioBitrate `
  -af "afade=t=in:st=0:d=0.03,apad" -t $Duration `
  $outputPath

if ($LASTEXITCODE -ne 0) { throw "FFmpeg 合轨失败，退出码 $LASTEXITCODE" }
Write-Host "合轨完成：$outputPath"
