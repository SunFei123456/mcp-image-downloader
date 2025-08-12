#!/bin/bash

# MCP Image Downloader 发布脚本
# 使用方法: ./publish.sh

set -e

echo "🚀 开始发布 MCP Image Downloader..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否已登录npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 错误: 请先登录npm账号 (npm login)"
    exit 1
fi

# 运行测试
echo "🧪 运行测试..."
npm test

# 检查Git状态
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  警告: 有未提交的更改"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查包名可用性
echo "📦 检查包名可用性..."
PACKAGE_NAME=$(node -p "require('./package.json').name")
if npm view "$PACKAGE_NAME" > /dev/null 2>&1; then
    echo "⚠️  包名 '$PACKAGE_NAME' 已存在"
    echo "建议使用 scoped 包名: @your-username/$PACKAGE_NAME"
    read -p "是否继续发布? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 发布到npm
echo "📤 发布到npm..."
if [[ $PACKAGE_NAME == @* ]]; then
    # Scoped package需要指定access public
    npm publish --access public
else
    npm publish
fi

# 获取版本号
VERSION=$(node -p "require('./package.json').version")

echo "✅ 发布成功!"
echo "📦 包名: $PACKAGE_NAME"
echo "🏷️  版本: $VERSION"
echo "🔗 npm: https://www.npmjs.com/package/$PACKAGE_NAME"
echo "🔗 GitHub: https://github.com/$(git config user.name)/mcp-image-downloader"

echo ""
echo "🎉 发布完成! 您可以通过以下命令安装:"
echo "npm install -g $PACKAGE_NAME"