/**
 * Model Context Protocol (MCP) - Tool Server Reference Implementation
 * 
 * This file is part of the Agent Lab Portfolio Project.
 * It demonstrates how to expose local tools (file editors, database access, sandboxes)
 * to LLM clients (like Claude Desktop or custom agents) using Anthropic's MCP SDK.
 * 
 * To run this in production:
 * 1. Install dependencies: npm install @modelcontextprotocol/sdk
 * 2. Configure in your agent config (e.g. claude_desktop_config.json)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

// Initialize the MCP Server
const server = new Server(
  {
    name: "agent-lab-tools-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}, // Expose custom tools
    },
  }
);

// Define available tools schema
const TOOLS = [
  {
    name: "execute_sandbox_code",
    description: "Runs Javascript code in a local temporary node sandbox and returns stdout/stderr. Perfect for agentic self-healing loops.",
    inputSchema: {
      type: "object",
      properties: {
        code: { 
          type: "string", 
          description: "The complete self-contained Node.js code block to execute." 
        },
        timeoutMs: { 
          type: "number", 
          description: "Execution timeout in milliseconds. Defaults to 5000.",
          default: 5000 
        }
      },
      required: ["code"],
    },
  },
  {
    name: "query_research_db",
    description: "Queries the local markdown/JSON document repository for fusion energy studies, specifications, and previous drafts.",
    inputSchema: {
      type: "object",
      properties: {
        query: { 
          type: "string", 
          description: "Search keywords or semantic topics." 
        },
        limit: { 
          type: "number", 
          description: "Maximum number of documents to return.",
          default: 3 
        }
      },
      required: ["query"],
    },
  }
];

// 1. List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// 2. Call tool handler (Tool Execution logic)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "execute_sandbox_code": {
        const { code, timeoutMs = 5000 } = args;
        
        // Setup secure temp file execution (simplistic child-process sandbox for demonstration)
        const tempFile = path.join(process.cwd(), `sandbox_${Date.now()}.js`);
        await fs.writeFile(tempFile, code);
        
        const result = await new Promise((resolve) => {
          exec(`node "${tempFile}"`, { timeout: timeoutMs }, (error, stdout, stderr) => {
            resolve({
              exitCode: error ? error.code : 0,
              stdout,
              stderr: stderr || (error && error.signal === "SIGTERM" ? "TIMEOUT: Execution exceeded time limit." : "")
            });
          });
        });
        
        // Clean up temp file
        await fs.unlink(tempFile);
        
        const isSuccess = result.exitCode === 0 && !result.stderr;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: isSuccess ? "Success" : "Failure",
                stdout: result.stdout.trim(),
                stderr: result.stderr.trim()
              }, null, 2)
            }
          ],
          isError: !isSuccess
        };
      }
      
      case "query_research_db": {
        const { query, limit = 3 } = args;
        
        // Mock DB query representing our workspace indexing
        const mockDb = [
          { title: "SPARC Magnet Design 2026", tags: ["cfs", "fusion", "sparc"], content: "HTS magnets achieving 20.1T toroidal field strength successfully assembled." },
          { title: "Polaris Facility Report 2026", tags: ["helion", "polaris", "fusion"], content: "Assembly completed, testing pulsed magnets. Grid connection rescheduled for mid-2027." }
        ];
        
        const matched = mockDb.filter(doc => 
          doc.title.toLowerCase().includes(query.toLowerCase()) || 
          doc.content.toLowerCase().includes(query.toLowerCase())
        ).slice(0, limit);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                count: matched.length,
                results: matched
              }, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Run server using Stdio transport (Standard Input/Output JSON-RPC communication)
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Agent Lab MCP Tool Server running on stdio transport.");
