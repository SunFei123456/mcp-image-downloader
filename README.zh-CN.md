# MCP图片下载服务

[English](README.md) | 简体中文

一个基于MCP (Model Context Protocol)的图片下载服务器，为AI助手提供智能图片搜索和下载功能。支持所有兼容MCP协议的AI客户端，让图片获取变得简单高效。

## ✨ 功能特性

- 🤖 **MCP协议标准**: 兼容所有支持MCP的AI客户端和开发工具
- 🔍 **智能搜索**: 集成Unsplash API，提供高质量免费图片资源
- 📁 **自动管理**: 智能创建目录结构，自动下载到指定位置
- 🏷️ **元数据丰富**: 提供图片描述、作者信息和使用建议
- 📝 **版权合规**: 自动包含Unsplash署名，符合开源使用规范
- 🌍 **多语言搜索**: 支持中英文关键词，智能匹配相关图片
- ⚡ **即插即用**: 简单配置，快速集成到现有工作流

## 🚀 快速开始

### 1. 环境准备

确保您的系统已安装：
- Node.js >= 16.0.0
- npm 或 yarn 包管理器

### 2. 项目安装

```bash
# 克隆项目
git clone <repository-url>
cd mcp-image-downloader

# 安装依赖
npm install
```

### 3. API密钥配置

#### 获取Unsplash API密钥
1. 访问 [Unsplash Developers](https://unsplash.com/developers)
2. 注册开发者账号并创建新应用
3. 获取 **Access Key**（注意：不是Secret Key）

#### 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件
UNSPLASH_ACCESS_KEY=your_actual_api_key_here
```

### 4. 启动MCP服务器

```bash
# 启动服务器
npm start

# 开发模式（带调试信息）
npm run dev
```

服务器启动后会监听MCP客户端连接，提供 `downloadProjectImage` 工具。

## 🔧 客户端配置

### Claude Desktop

在Claude Desktop的配置文件中添加：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "image-downloader": {
      "command": "node",
      "args": ["/path/to/mcp-image-downloader/image-server.js"],
      "env": {
        "UNSPLASH_ACCESS_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Kiro IDE

#### 工作区配置（推荐）
在项目根目录创建 `.kiro/settings/mcp.json`：

```json
{
  "mcpServers": {
    "image-downloader": {
      "command": "node",
      "args": ["./image-server.js"],
      "env": {
        "UNSPLASH_ACCESS_KEY": "your_api_key_here"
      },
      "disabled": false,
      "autoApprove": ["downloadProjectImage"]
    }
  }
}
```

#### 用户级配置
编辑 `~/.kiro/settings/mcp.json`：

```json
{
  "mcpServers": {
    "image-downloader": {
      "command": "node", 
      "args": ["/absolute/path/to/image-server.js"],
      "env": {
        "UNSPLASH_ACCESS_KEY": "your_api_key_here"
      },
      "disabled": false
    }
  }
}
```

### 其他MCP客户端

对于其他支持MCP协议的客户端，通常需要配置：

- **命令**: `node`
- **参数**: `["/path/to/image-server.js"]`
- **环境变量**: `UNSPLASH_ACCESS_KEY=your_key`
- **工作目录**: 项目根目录

具体配置方法请参考对应客户端的MCP配置文档。

## 📖 使用方法

### 工具说明

服务器提供 `downloadProjectImage` 工具，参数如下：

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `query` | string | ✅ | 搜索关键词，如 "team collaboration" |
| `saveDir` | string | ✅ | 保存目录，如 "src/assets/images" |
| `filename` | string | ❌ | 自定义文件名（不含扩展名） |

### 使用示例

#### 通过AI对话
```
请帮我下载一张关于"现代办公室"的图片到 public/images 文件夹
```

#### 直接工具调用
```json
{
  "tool": "downloadProjectImage",
  "arguments": {
    "query": "modern office workspace",
    "saveDir": "public/images",
    "filename": "office-hero"
  }
}
```

### 返回数据

成功下载后返回完整的图片信息：

```json
{
  "success": true,
  "message": "图片已成功下载到 /project/public/images/modern-office.jpg",
  "filePath": "/absolute/path/to/modern-office.jpg",
  "relativePathForTag": "/public/images/modern-office.jpg", 
  "suggestedAltText": "Modern office workspace with natural lighting",
  "author": "Photo by Jane Smith on Unsplash",
  "authorUrl": "https://unsplash.com/@janesmith",
  "downloadUrl": "https://unsplash.com/photos/xyz789/download"
}
```

## 🛠️ 开发与测试

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 运行测试用例
npm test
```

### 调试模式

设置环境变量启用详细日志：

```bash
DEBUG=mcp:* npm start
```

### 测试连接

使用MCP客户端测试工具验证服务器连接：

```bash
# 如果有MCP测试工具
mcp-test-client --server "node image-server.js"
```

## 📋 技术规格

### 系统要求
- **Node.js**: >= 16.0.0
- **内存**: >= 512MB
- **磁盘**: >= 100MB（用于缓存和临时文件）
- **网络**: 需要访问Unsplash API

### 技术栈
- **运行时**: Node.js
- **协议**: Model Context Protocol (MCP)
- **HTTP客户端**: Axios
- **图片来源**: Unsplash API
- **文件系统**: Node.js fs/promises

### API限制
- **Unsplash免费版**: 50次/小时
- **图片格式**: JPEG（自动优化）
- **最大尺寸**: 根据Unsplash提供的尺寸
- **搜索语言**: 支持英文和中文关键词

## 🔍 故障排除

### 常见问题

**Q: 服务器无法启动**
```bash
# 检查Node.js版本
node --version

# 检查依赖安装
npm list
```

**Q: API密钥错误**
```bash
# 验证环境变量
echo $UNSPLASH_ACCESS_KEY

# 测试API连接
curl -H "Authorization: Client-ID your_key" "https://api.unsplash.com/photos/random"
```

**Q: 图片下载失败**
- 检查目标目录权限
- 确认网络连接正常
- 验证磁盘空间充足

### 日志分析

服务器日志包含以下信息：
- MCP连接状态
- 工具调用记录
- API请求响应
- 文件操作结果

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork项目并创建功能分支
2. 编写代码并添加测试
3. 确保所有测试通过
4. 提交PR并描述变更内容

### 代码规范
- 使用ESLint进行代码检查
- 遵循现有的代码风格
- 为新功能添加相应测试

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/)
- [Unsplash API 文档](https://unsplash.com/documentation)
- [Claude Desktop MCP 配置](https://claude.ai/docs/mcp)

---

**需要帮助？** 请查看 [Issues](../../issues) 或创建新的问题报告。