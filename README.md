# MCP Image Download Service

English | [简体中文](README.zh-CN.md)

An MCP (Model Context Protocol) server that provides intelligent image search and download capabilities for AI assistants. Compatible with all MCP-enabled AI clients, making image acquisition simple and efficient.

## ✨ Features

- 🤖 **MCP Protocol Standard**: Compatible with all MCP-enabled AI clients and development tools
- 🔍 **Smart Search**: Integrated with Unsplash API for high-quality free image resources
- 📁 **Auto Management**: Intelligent directory creation and automatic downloads to specified locations
- 🏷️ **Rich Metadata**: Provides image descriptions, author information, and usage suggestions
- 📝 **Copyright Compliance**: Automatically includes Unsplash attribution, compliant with open source usage
- 🌍 **Multi-language Search**: Supports both English and Chinese keywords with intelligent matching
- ⚡ **Plug and Play**: Simple configuration, quick integration into existing workflows

## 🚀 Quick Start

### 1. Environment Setup

Ensure your system has:
- Node.js >= 16.0.0
- npm or yarn package manager

### 2. Installation Options

#### Option A: Use NPM Package (Recommended)
```bash
# No installation needed! 
# The package will be automatically downloaded when used with npx
# Just configure your MCP client (see Configuration section below)
```

#### Option B: Global Installation
```bash
# Install globally for faster startup
npm install -g mcp-unsplash-image-downloader
```

#### Option C: Local Development
```bash
# Clone the project for development
git clone https://github.com/SunFei123456/mcp-image-downloader.git
cd mcp-image-downloader

# Install dependencies
npm install
```

### 3. API Key Configuration

#### Get Unsplash API Key
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Register a developer account and create a new application
3. Get the **Access Key** (Note: not the Secret Key)

#### Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit .env file
UNSPLASH_ACCESS_KEY=your_actual_api_key_here
```

### 4. Start MCP Server

```bash
# Start server
npm start

# Development mode (with debug info)
npm run dev
```

After startup, the server will listen for MCP client connections and provide the `downloadProjectImage` tool.

## 🔧 Client Configuration

### Claude Desktop

Add to Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "image-downloader": {
      "command": "npx",
      "args": ["-y", "mcp-unsplash-image-downloader"],
      "env": {
        "UNSPLASH_ACCESS_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Kiro IDE

#### Workspace Configuration (Recommended)
Create `.kiro/settings/mcp.json` in project root:

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

#### User-level Configuration
Edit `~/.kiro/settings/mcp.json`:

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

### Other MCP Clients

For other MCP protocol-compatible clients, typically configure:

- **Command**: `node`
- **Arguments**: `["/path/to/image-server.js"]`
- **Environment Variables**: `UNSPLASH_ACCESS_KEY=your_key`
- **Working Directory**: Project root directory

Refer to the specific client's MCP configuration documentation for detailed setup instructions.

## 📖 Usage

### Tool Description

The server provides the `downloadProjectImage` tool with the following parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | ✅ | Search keywords, e.g., "team collaboration" |
| `saveDir` | string | ✅ | Save directory, e.g., "src/assets/images" |
| `filename` | string | ❌ | Custom filename (without extension) |

### Usage Examples

#### Through AI Conversation
```
Please help me download an image about "modern office" to the public/images folder
```

#### Direct Tool Call
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

### Return Data

After successful download, returns complete image information:

```json
{
  "success": true,
  "message": "Image successfully downloaded to /project/public/images/modern-office.jpg",
  "filePath": "/absolute/path/to/modern-office.jpg",
  "relativePathForTag": "/public/images/modern-office.jpg", 
  "suggestedAltText": "Modern office workspace with natural lighting",
  "author": "Photo by Jane Smith on Unsplash",
  "authorUrl": "https://unsplash.com/@janesmith",
  "downloadUrl": "https://unsplash.com/photos/xyz789/download"
}
```

## 🛠️ Development & Testing

### Local Development

```bash
# Start development server
npm run dev

# Run test cases
npm test
```

### Debug Mode

Set environment variable to enable verbose logging:

```bash
DEBUG=mcp:* npm start
```

### Test Connection

Use MCP client testing tools to verify server connection:

```bash
# If you have MCP testing tools
mcp-test-client --server "node image-server.js"
```

## 📋 Technical Specifications

### System Requirements
- **Node.js**: >= 16.0.0
- **Memory**: >= 512MB
- **Disk**: >= 100MB (for cache and temporary files)
- **Network**: Requires access to Unsplash API

### Tech Stack
- **Runtime**: Node.js
- **Protocol**: Model Context Protocol (MCP)
- **HTTP Client**: Axios
- **Image Source**: Unsplash API
- **File System**: Node.js fs/promises

### API Limitations
- **Unsplash Free Tier**: 50 requests/hour
- **Image Format**: JPEG (auto-optimized)
- **Max Size**: Based on Unsplash provided dimensions
- **Search Languages**: Supports English and Chinese keywords

## 🔍 Troubleshooting

### Common Issues

**Q: Server won't start**
```bash
# Check Node.js version
node --version

# Check dependency installation
npm list
```

**Q: API key error**
```bash
# Verify environment variable
echo $UNSPLASH_ACCESS_KEY

# Test API connection
curl -H "Authorization: Client-ID your_key" "https://api.unsplash.com/photos/random"
```

**Q: Image download fails**
- Check target directory permissions
- Confirm network connection is working
- Verify sufficient disk space

### Log Analysis

Server logs contain the following information:
- MCP connection status
- Tool call records
- API request responses
- File operation results

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Development Process
1. Fork the project and create a feature branch
2. Write code and add tests
3. Ensure all tests pass
4. Submit PR with description of changes

### Code Standards
- Use ESLint for code checking
- Follow existing code style
- Add corresponding tests for new features

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🔗 Related Links

- [Model Context Protocol Official Documentation](https://modelcontextprotocol.io/)
- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Claude Desktop MCP Configuration](https://claude.ai/docs/mcp)

---

**Need Help?** Check [Issues](../../issues) or create a new issue report.