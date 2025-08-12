#!/usr/bin/env node

// MCP图片下载服务器
// 提供通过AI助手搜索和下载图片的功能

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

// 配置区域
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your_unsplash_api_key_here') {
  console.error('❌ 错误：请设置UNSPLASH_ACCESS_KEY环境变量');
  console.error('   获取API密钥：https://unsplash.com/developers');
  process.exit(1);
}

// 创建MCP服务器实例
const server = new Server(
  {
    name: 'mcp-image-downloader',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 工具列表处理
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'downloadProjectImage',
        description: '根据关键词搜索图片，下载到指定的项目文件夹，并返回相对路径以便引用',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '要搜索的图片关键词，例如 "modern office" 或 "team collaboration"',
            },
            saveDir: {
              type: 'string',
              description: '图片要保存到的项目内相对路径，例如 "src/assets/images"',
            },
            filename: {
              type: 'string',
              description: '可选的文件名（不含扩展名）。如果未提供，将根据查询自动生成',
            },
          },
          required: ['query', 'saveDir'],
        },
      },
    ],
  };
});

// 工具调用处理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'downloadProjectImage') {
    try {
      const { query, saveDir, filename } = args;
      
      // 生成文件名
      const finalFilename = (filename || query.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) + '.jpg';
      const absoluteSaveDir = path.resolve(process.cwd(), saveDir);
      const absoluteSavePath = path.join(absoluteSaveDir, finalFilename);

      // 确保目录存在
      await fs.mkdir(absoluteSaveDir, { recursive: true });

      // 从Unsplash API搜索图片
      console.log(`🔍 搜索图片: "${query}"`);
      const searchUrl = `https://api.unsplash.com/search/photos`;
      const searchResponse = await axios.get(searchUrl, {
        params: {
          query: query,
          per_page: 1,
          orientation: 'landscape',
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (searchResponse.data.results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ 没有找到关于 "${query}" 的图片，请尝试其他关键词。`,
            },
          ],
        };
      }

      const photo = searchResponse.data.results[0];
      const imageUrl = photo.urls.regular;

      // 下载图片
      console.log(`⬇️ 下载图片: ${imageUrl}`);
      const imageResponse = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        timeout: 30000,
      });
      
      await fs.writeFile(absoluteSavePath, imageResponse.data);

      // 计算用于代码引用的相对路径
      const relativePathForTag = path.posix.join('/', saveDir, finalFilename);

      console.log(`✅ 图片已保存到: ${absoluteSavePath}`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `图片已成功下载到 ${absoluteSavePath}`,
              filePath: absoluteSavePath,
              relativePathForTag: relativePathForTag,
              suggestedAltText: photo.alt_description || query,
              author: `Photo by ${photo.user.name} on Unsplash`,
              authorUrl: photo.user.links.html,
              downloadUrl: photo.links.download_location,
            }, null, 2),
          },
        ],
      };

    } catch (error) {
      console.error('❌ 工具执行失败:', error.message);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: `执行失败: ${error.message}`,
            }, null, 2),
          },
        ],
      };
    }
  }

  throw new Error(`未知工具: ${name}`);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 MCP图片下载服务器已启动');
}

main().catch((error) => {
  console.error('❌ 服务器启动失败:', error);
  process.exit(1);
});