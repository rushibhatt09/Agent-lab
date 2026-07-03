import { scenarios } from "./agent-simulator.js";

// Application State
let currentScenarioId = "research";
let currentStepIndex = -1;
let isPlaying = false;
let simulationTimer = null;
let speed = 1500; // ms
let isLiveMode = false;

// DOM Elements
const btnPlay = document.getElementById("btn-play");
const btnStep = document.getElementById("btn-step");
const btnReset = document.getElementById("btn-reset");
const selectSpeed = document.getElementById("select-speed");
const selectModel = document.getElementById("select-model");
const inputApiKey = document.getElementById("input-api-key");
const customPrompt = document.getElementById("custom-prompt");
const btnApplyPrompt = document.getElementById("btn-apply-prompt");

const modeSimulated = document.getElementById("mode-simulated");
const modeLive = document.getElementById("mode-live");
const liveConfigPanel = document.getElementById("live-config-panel");

// Metrics DOM
const metricActiveNode = document.getElementById("metric-active-node");
const metricSubNode = document.getElementById("metric-sub-node");
const metricTokens = document.getElementById("metric-tokens");
const metricSubTokens = document.getElementById("metric-sub-tokens");
const metricCost = document.getElementById("metric-cost");
const metricSubCost = document.getElementById("metric-sub-cost");
const metricTools = document.getElementById("metric-tools");
const metricSubTools = document.getElementById("metric-sub-tools");
const statusDot = document.querySelector(".status-dot");
const statusText = document.querySelector(".status-text");

// Logs & Output DOM
const consoleLogs = document.getElementById("console-logs");
const btnClearConsole = document.getElementById("btn-clear-console");
const tabOutput = document.getElementById("tab-output");
const tabMcp = document.getElementById("tab-mcp");
const mcpCodeContainer = document.getElementById("mcp-code-container");
const btnCopyCode = document.getElementById("btn-copy-code");
const notification = document.getElementById("app-notification");

// Node Workspace
const graphWorkspace = document.getElementById("graph-workspace");
const nodesContainer = document.getElementById("nodes-container");
const svgOverlay = document.getElementById("graph-svg-overlay");

// SVG Inline Icon Set
const ICONS = {
  planner: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  api: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  critic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  guard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  writer: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
};

// Initialize Dashboard
function init() {
  loadScenario(currentScenarioId);
  loadMcpCode();
  
  // Set default prompt in textarea
  customPrompt.value = scenarios[currentScenarioId].goal;

  // Event Listeners
  document.querySelectorAll(".scenario-card").forEach(card => {
    card.addEventListener("click", (e) => {
      const scenarioId = e.currentTarget.getAttribute("data-scenario");
      changeScenario(scenarioId);
    });
  });

  btnPlay.addEventListener("click", toggleSimulation);
  btnStep.addEventListener("click", runNextStep);
  btnReset.addEventListener("click", resetSimulation);
  selectSpeed.addEventListener("click", () => {
    speed = parseInt(selectSpeed.value, 10);
    if (isPlaying) {
      pauseSimulation();
      playSimulation();
    }
  });

  btnClearConsole.addEventListener("click", () => {
    consoleLogs.innerHTML = "";
  });

  btnCopyCode.addEventListener("click", copyMcpCode);

  btnApplyPrompt.addEventListener("click", () => {
    const text = customPrompt.value.trim();
    if (text) {
      resetSimulation();
      appendLog("system", `System directive updated: "${text}"`);
      showNotification("Directive updated!");
    }
  });

  // Toggle Live Config
  modeSimulated.addEventListener("click", () => {
    modeSimulated.classList.add("active");
    modeLive.classList.remove("active");
    liveConfigPanel.classList.add("hidden");
    isLiveMode = false;
    resetSimulation();
    appendLog("system", "Switched to Simulated Execution Mode.");
  });

  modeLive.addEventListener("click", () => {
    modeLive.classList.add("active");
    modeSimulated.classList.remove("active");
    liveConfigPanel.classList.remove("hidden");
    isLiveMode = true;
    resetSimulation();
    appendLog("system", "Switched to Live API Mode. Awaiting API configuration.");
  });

  // Tabs logic
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      
      e.currentTarget.classList.add("active");
      const tabId = e.currentTarget.getAttribute("data-tab");
      document.getElementById(`tab-${tabId}`).classList.remove("hidden");
      
      // Re-trigger layout checks for editor blocks
      if (tabId === "mcp") {
        loadMcpCode();
      }
    });
  });

  // Window resize handler for connection lines
  window.addEventListener("resize", drawConnections);
}

// Load and Render Scenario Nodes & Canvas
function loadScenario(scenarioId) {
  const scenario = scenarios[scenarioId];
  nodesContainer.innerHTML = "";
  
  // Render Nodes
  scenario.nodes.forEach(node => {
    const nodeEl = document.createElement("div");
    nodeEl.className = "agent-node";
    nodeEl.id = `node-${node.id}`;
    nodeEl.setAttribute("data-type", node.type);
    nodeEl.style.left = `${node.x}%`;
    nodeEl.style.top = `${node.y}%`;
    nodeEl.style.position = "absolute";
    
    const iconHtml = ICONS[node.icon] || ICONS.planner;
    nodeEl.innerHTML = `
      <div class="node-icon-circle">${iconHtml}</div>
      <div class="node-label">${node.label}</div>
      <div class="node-status">Awaiting state...</div>
    `;
    
    nodesContainer.appendChild(nodeEl);
  });
  
  // Draw Connection Lines
  setTimeout(drawConnections, 100);
}

function changeScenario(scenarioId) {
  if (isPlaying) toggleSimulation();
  currentScenarioId = scenarioId;
  
  document.querySelectorAll(".scenario-card").forEach(card => {
    card.classList.remove("active");
    if (card.getAttribute("data-scenario") === scenarioId) {
      card.classList.add("active");
    }
  });

  customPrompt.value = scenarios[scenarioId].goal;
  
  resetSimulation();
  loadScenario(scenarioId);
  appendLog("system", `Loaded scenario: ${scenarios[scenarioId].title}`);
}

// Draw paths between nodes in SVG overlay
function drawConnections() {
  svgOverlay.innerHTML = "";
  const scenario = scenarios[currentScenarioId];
  const overlayRect = svgOverlay.getBoundingClientRect();
  
  scenario.connections.forEach(conn => {
    const fromNode = document.getElementById(`node-${conn.from}`);
    const toNode = document.getElementById(`node-${conn.to}`);
    
    if (fromNode && toNode) {
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      
      // Calculate coordinates relative to SVG container
      const x1 = (fromRect.left + fromRect.width / 2) - overlayRect.left;
      const y1 = (fromRect.top + fromRect.height / 2) - overlayRect.top;
      const x2 = (toRect.left + toRect.width / 2) - overlayRect.left;
      const y2 = (toRect.top + toRect.height / 2) - overlayRect.top;
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Draw straight or subtle curved lines
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Curve factor
      
      // Use SVG quadratic path for subtle elegance
      let d = `M${x1},${y1} Q${x1 + dx/2},${y1 + dy/2 - 15} ${x2},${y2}`;
      
      // Check if connecting tools or loops for different curves
      if (Math.abs(dy) > 100 && Math.abs(dx) < 50) {
        d = `M${x1},${y1} Q${x1 + 40},${y1 + dy/2} ${x2},${y2}`;
      }
      
      line.setAttribute("d", d);
      line.setAttribute("class", "connection-line");
      line.setAttribute("id", `path-${conn.from}->${conn.to}`);
      
      svgOverlay.appendChild(line);
    }
  });
}

// Execution Loop Control
function toggleSimulation() {
  if (isPlaying) {
    pauseSimulation();
  } else {
    playSimulation();
  }
}

function playSimulation() {
  isPlaying = true;
  btnPlay.classList.add("active");
  btnPlay.querySelector(".icon-play").classList.add("hidden");
  btnPlay.querySelector(".icon-pause").classList.remove("hidden");
  btnPlay.querySelector("span").textContent = "Pause";
  
  statusDot.className = "status-dot status-running";
  statusText.textContent = isLiveMode ? "Executing Live APIs" : "Simulating Workflow";

  if (currentStepIndex === -1) {
    resetSimulation();
  }

  runNextStep();
  simulationTimer = setInterval(runNextStep, speed);
}

function pauseSimulation() {
  isPlaying = false;
  btnPlay.classList.remove("active");
  btnPlay.querySelector(".icon-play").classList.remove("hidden");
  btnPlay.querySelector(".icon-pause").classList.add("hidden");
  btnPlay.querySelector("span").textContent = "Resume";
  
  statusDot.className = "status-dot status-idle";
  statusText.textContent = "System Paused";

  clearInterval(simulationTimer);
}

function runNextStep() {
  const scenario = scenarios[currentScenarioId];
  const steps = scenario.steps;
  
  currentStepIndex++;
  
  if (currentStepIndex >= steps.length) {
    pauseSimulation();
    statusDot.className = "status-dot status-idle";
    statusText.textContent = "Workflow Completed";
    appendLog("success", "Workflow execution sequence completed successfully.");
    currentStepIndex = steps.length - 1;
    return;
  }
  
  const step = steps[currentStepIndex];
  
  // Update Metrics
  updateMetrics(step.metrics, step.activeNodeId);
  
  // Highlight Node
  document.querySelectorAll(".agent-node").forEach(node => {
    node.classList.remove("node-active");
    const nodeStatus = node.querySelector(".node-status");
    if (nodeStatus) nodeStatus.textContent = "Idle";
  });
  
  const activeNode = document.getElementById(`node-${step.activeNodeId}`);
  if (activeNode) {
    activeNode.classList.add("node-active");
    const status = activeNode.querySelector(".node-status");
    if (status) status.textContent = step.metrics.status || "Working";
  }
  
  // Highlight Paths
  document.querySelectorAll(".connection-line").forEach(path => {
    path.classList.remove("active-path");
  });
  
  step.activeConnections.forEach(connId => {
    const path = document.getElementById(`path-${connId}`);
    if (path) {
      path.classList.add("active-path");
    }
  });
  
  // Append Logs
  step.logs.forEach(log => {
    appendLog(log.type, log.text);
  });
  
  // Render Output
  if (step.output) {
    renderOutput(step.output);
  }
}

function resetSimulation() {
  pauseSimulation();
  clearInterval(simulationTimer);
  currentStepIndex = -1;
  isPlaying = false;
  
  btnPlay.querySelector(".icon-play").classList.remove("hidden");
  btnPlay.querySelector(".icon-pause").classList.add("hidden");
  btnPlay.querySelector("span").textContent = "Run";
  
  statusDot.className = "status-dot status-idle";
  statusText.textContent = "System Idle";
  
  // Clear Node visual highlights
  document.querySelectorAll(".agent-node").forEach(node => {
    node.classList.remove("node-active");
    const status = node.querySelector(".node-status");
    if (status) status.textContent = "Awaiting start...";
  });
  
  document.querySelectorAll(".connection-line").forEach(path => {
    path.classList.remove("active-path");
  });

  // Reset metrics
  metricActiveNode.textContent = "Orchestrator";
  metricSubNode.textContent = "Awaiting start";
  metricTokens.textContent = "0";
  metricSubTokens.textContent = "0 prompt / 0 output";
  metricCost.textContent = "$0.0000";
  metricSubCost.textContent = "Simulated model cost";
  metricTools.textContent = "0";
  metricSubTools.textContent = "100% success rate";

  // Reset output and terminal logs
  consoleLogs.innerHTML = `<div class="log-line log-system">SYSTEM: Workspace reset. Ready to launch.</div>`;
  
  tabOutput.innerHTML = `
    <div class="output-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <p>No output generated yet. Start the agent workflow simulation to watch the final results compile here in real-time.</p>
    </div>
  `;
}

// Log Terminal Rendering
function appendLog(type, text) {
  const logLine = document.createElement("div");
  logLine.className = `log-line log-${type}`;
  
  const timestamp = new Date().toLocaleTimeString().split(" ")[0];
  const typeTag = type.toUpperCase().padEnd(10);
  
  logLine.textContent = `[${timestamp}] [${typeTag}] ${text}`;
  consoleLogs.appendChild(logLine);
  
  // Auto Scroll
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// Metrics Panel Update
function updateMetrics(metrics, nodeId) {
  const scenarioNode = scenarios[currentScenarioId].nodes.find(n => n.id === nodeId);
  
  metricActiveNode.textContent = scenarioNode ? scenarioNode.label : "Orchestrator";
  metricSubNode.textContent = metrics.status;
  
  metricTokens.textContent = Number(metrics.tokens).toLocaleString();
  const promptTokens = Math.floor(metrics.tokens * 0.65);
  const completionTokens = metrics.tokens - promptTokens;
  metricSubTokens.textContent = `${promptTokens.toLocaleString()} prompt / ${completionTokens.toLocaleString()} output`;
  
  metricCost.textContent = `$${metrics.cost.toFixed(5)}`;
  metricSubCost.textContent = `$0.075 / 1M tokens rate`;
  
  metricTools.textContent = metrics.tools;
  metricSubTools.textContent = `${metrics.tools > 0 ? "100% success rate" : "0 tools called"}`;
}

// Output Tab Renderer
function renderOutput(outputContent) {
  if (currentScenarioId === "coding") {
    // Render code editor block
    tabOutput.innerHTML = `
      <div class="code-editor-wrapper">
        <div class="editor-header">
          <span class="editor-filename">binarySearch.js</span>
          <button id="btn-copy-output" class="btn-text">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy Code
          </button>
        </div>
        <div class="editor-body">
          <pre><code class="language-js">${escapeHtml(outputContent)}</code></pre>
        </div>
      </div>
    `;
    document.getElementById("btn-copy-output").addEventListener("click", () => {
      navigator.clipboard.writeText(outputContent);
      showNotification("Code copied to clipboard!");
    });
  } else {
    // Render markdown block
    tabOutput.innerHTML = `
      <div class="rendered-markdown">
        ${parseMarkdown(outputContent)}
      </div>
    `;
  }
}

// Simple local Markdown parser (for bolding, headers, lists)
function parseMarkdown(md) {
  let html = md;
  // Headers
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/<\/li>\n<li>/gim, '</li><li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 20px 0;">');
  
  return html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Load and Display the reference MCP file
function loadMcpCode() {
  fetch("mcp-server-demo.js")
    .then(res => {
      if (!res.ok) throw new Error("CORS or File missing");
      return res.text();
    })
    .then(code => {
      mcpCodeContainer.textContent = code;
    })
    .catch(() => {
      // Fallback in case they view page via file:/// protocol without local web server
      mcpCodeContainer.textContent = `/**
 * Model Context Protocol (MCP) - Stdio Tool Server Reference
 * [Fallback loaded due to local file protocol restrictions]
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "agent-lab-tools-server",
  version: "1.0.0",
}, {
  capabilities: { tools: {} },
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "execute_sandbox_code",
      description: "Runs JavaScript inside a sandbox container",
      inputSchema: {
        type: "object",
        properties: { code: { type: "string" } },
        required: ["code"]
      }
    }]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);`;
    });
}

function copyMcpCode() {
  const code = mcpCodeContainer.textContent;
  navigator.clipboard.writeText(code);
  showNotification("MCP Reference Code copied!");
}

function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}

// Start application
window.onload = init;
