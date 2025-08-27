#!/bin/bash

# 部署到 GitHub Pages 的脚本

set -e  # 遇到错误时退出

echo "🔄 切换到 gh-pages 分支"
git switch gh-pages
echo "✅ 同步远程 gh-pages 分支"
git pull
echo "🔙 切换回原来的分支"
git switch -

echo "🏗️  开始构建项目..."

# 确保我们在项目根目录
cd "$(dirname "$0")/.."

# 安装依赖并构建项目
echo "📦 安装依赖..."
pnpm install

echo "🔨 构建项目..."
pnpm run build

# 检查构建输出目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ 构建失败：找不到 dist 目录"
    exit 1
fi

echo "📁 准备 gh-pages 分支..."

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  检测到未提交的更改，请先提交或暂存更改"
    git status
    exit 1
fi

# 切换到 gh-pages 分支
echo "🔄 切换到 gh-pages 分支"
git switch gh-pages

# 保存 node_modules 的引用（如果存在）
if [ -d "node_modules" ]; then
    echo "💾 保存 node_modules 引用..."
    NODE_MODULES_EXISTS=true
else
    NODE_MODULES_EXISTS=false
fi

echo "🗑️  清理 gh-pages 分支内容..."

# 删除除了 .git 和 dist 以外的所有文件和目录
find . -maxdepth 1 -not -name '.' -not -name '..' -not -name '.git' -not -name 'dist' -exec rm -rf {} + 2>/dev/null || true

# 将 dist 目录中的文件移动到根目录
if [ -d "dist" ]; then
    echo "📋 移动构建文件到根目录..."
    mv dist/* . 2>/dev/null || true
    mv dist/.* . 2>/dev/null || true  # 移动隐藏文件（如果有的话）
    rmdir dist 2>/dev/null || true   # 删除空的 dist 目录
fi

echo "📝 提交更改..."

# 添加所有文件到 git
git add .

# 检查是否有更改需要提交
if git diff --staged --quiet; then
    echo "ℹ️  没有新的更改需要提交"
else
    # 提交更改
    COMMIT_MSG="Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
    
    echo "🚀 推送到 GitHub Pages..."
    git push origin gh-pages
    
    echo "✅ 部署完成！"
    echo "🌐 你的网站将在几分钟内在 GitHub Pages 上可用"
fi

# 切换回原来的分支
echo "🔙 切换回原来的分支"
git switch -

# 恢复 node_modules（如果需要）
if [ "$NODE_MODULES_EXISTS" = true ]; then
    echo "📦 检查 node_modules..."
    if [ ! -d "node_modules" ]; then
        echo "🔄 重新安装依赖..."
        pnpm install
    else
        echo "✅ node_modules 已存在，无需重新安装"
    fi
else
    echo "ℹ️  原始分支没有 node_modules，跳过恢复"
fi

echo "🎉 部署流程完成！"