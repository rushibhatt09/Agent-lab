# Agent Lab - Multi-Agent Workflows Playground

An interactive, premium web-based dashboard demonstrating production-grade AI Agent architectures, state-based coordination, tool calling, and self-healing loops. 

This project was built to address the **"engineering chasm"** in AI systems—moving beyond fragile prompt-and-response setups to resilient, observability-focused agent systems that recruiters look for.

---

## 🚀 Key Architectural Patterns Showcased

1. **State-Based Multi-Agent Routing (Cyclic Graphs)**
   Unlike simple sequential LLM calls, our **Research Scenario** routes control dynamically based on validation. The *Peer Critic* evaluates research data and routes the execution back to the *Web Searcher* if information gaps are found.
2. **The Self-Healing Loop (Reflection)**
   In the **Self-Healing Coder Scenario**, a *Coder Agent* produces code that is run inside a virtual test sandbox. If the tests fail (due to an infinite loop, syntactic error, or semantic bug), the traceback is captured, passed back as context, and a *Debugger Agent* instructs the coder on how to correct the code.
3. **Semantic Guardrails & Alignment Policy**
   In the **Support & Guardrails Scenario**, the *Policy Guard* serves as a strict constraint layer checking final deliverables for safety, SLA timelines, or financial bounds (e.g., rejecting an support draft that exceeds gift card limits), rewriting it dynamically before the *Delivery Agent* sends the email.
4. **Model Context Protocol (MCP) Tools integration**
   Includes a production-ready reference server [mcp-server-demo.js](file:///C:/Users/micro/.gemini/antigravity/scratch/agent-lab/mcp-server-demo.js) demonstrating how to expose tools like sandboxed terminal execution and database queries to LLM clients (like Claude Desktop) using Anthropic's open-source protocol.

---

## 🛠️ Tech Stack & Design System

- **Core**: Vanilla HTML5, ES6 Modules (modular, buildless development).
- **Styling**: Vanilla CSS3 Custom Properties. Features a premium glassmorphic dark-mode theme, glowing canvas graph nodes, and pulsating interactive communication paths.
- **Graph Drawing**: Dynamic coordinates calculation rendering SVG linkage overlays that dynamically resize with the browser viewport.
- **Observability Console**: Terminal emulator displaying standardized, color-coded logging traces showing real-time token telemetry, model pricing estimations, and agent reasoning.

---

## 💻 Quickstart (Running Locally)

Since the project uses ES Modules, opening `index.html` directly in the browser may trigger CORS flags. It is best served using a lightweight HTTP server.

**Option 1: Using Node/NPX (Recommended)**
```bash
# From the project root, run http-server instantly
npx http-server ./
```

**Option 2: Using Python**
```bash
# Python 3
python -m http.server 8000
```

Once running, navigate to `http://localhost:8080` (or `http://localhost:8000`) in your browser to interact with the dashboard.

---

## 🎯 Career Alignment (For Your Portfolio)
When discussing this project with hiring managers or engineering leads, emphasize these engineering decisions:
*   **Decoupled Tools**: We separated the tool definitions from the LLM core using the **Model Context Protocol (MCP)**, ensuring standard API compliance.
*   **Cost Control**: The metrics row monitors token volumes and estimates cost, showing you design agents with business cost constraints in mind.
*   **Observability First**: Rather than letting agents operate in a "black box", the *Thought Trace Console* prints standard logs showing planner decisions, tools queried, and evaluation tracebacks.
