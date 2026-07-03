# Agent Lab - Multi-Agent Workflows Playground

An interactive, visual web dashboard demonstrating how teams of specialized **AI Workers (Agents)** collaborate, use tools, check their work, and fix their own mistakes to solve complex tasks.

👉 **Live Demo**: Configure and run the project live in your browser!

---

## 💡 What is Agent Lab? (In Plain English)

Traditional AI (like standard ChatGPT) is like a calculator: you ask a question once, and it gives you a single answer. If it makes a mistake, you have to find it and correct it yourself.

An **AI Agent** is different. It acts like a **virtual employee**. You give it a high-level goal, and it plans its own steps, uses digital tools (like searching the web or checking database records), and reviews its own results.

**Agent Lab** is a **visual floor plan** showing how a team of these virtual employees collaborate in a digital office to get a job done safely and accurately.

---

## 🏢 The Three Office Teams You Can Watch

Select a scenario in the dashboard sidebar to watch these virtual teams in action:

### 1. The Research & Writing Team (Research & Synthesis)
*   **The Boss (Orchestrator)**: Gets the goal (*"Write a report on 2026 fusion energy breakthroughs"*), breaks it down, and coordinates the team.
*   **The Researcher (Searcher)**: Uses search tools to find recent news articles and scientific papers.
*   **The Editor (Peer Critic)**: Reviews the researcher's findings. If a key fact is missing, they send the Researcher back to query Google again.
*   **The Writer**: Synthesizes the checked facts into a polished markdown document.
*   *Key takeaway*: This shows how AI can double-check its own research gaps before writing.

### 2. The Self-Healing Programmer (Self-Healing Coder)
*   **The Programmer (Coder)**: Drafts a piece of Javascript code to solve a math problem.
*   **The Tester (Sandbox)**: Tries to run the code, but it hits a bug and crashes.
*   **The Debugger**: Captures the computer crash error, reflects on *why* the code failed, and explains the fix to the Programmer.
*   **The Programmer**: Rewrites the code. The Tester runs it again, and it passes successfully.
*   *Key takeaway*: This demonstrates a "self-healing loop" where AI reads its own crash errors to fix its bugs.

### 3. Customer Service & Compliance (Support & Guardrails)
*   **The Router**: Analyzes an incoming customer complaint about a subscription refund.
*   **The Database Clerk**: Queries user transaction logs to confirm their eligibility.
*   **The Writer**: Drafts an apology email but accidentally offers a $20 gift card.
*   **The Compliance Officer (Policy Guard)**: Intercepts the email and says: *"Stop. Company policy limits refund compensation to $10. Rewrite the response."*
*   **The Writer**: Corrects the email, and it is successfully sent to the customer.
*   *Key takeaway*: This shows how safety guardrails prevent AI from making costly business errors.

---

## 🖥️ How the Dashboard Works

*   **Active Node Glow**: Watch the active virtual worker glow in real-time as the task passes from person to person.
*   **Thought Trace Console**: Read the terminal log to see the "thoughts" of the AI workers (e.g., *"Thought: The program crashed. I will check the loop indexing..."*).
*   **Performance Metrics**: Track the simulated cost, speed, and tool usage of the running workflow.
*   **Deliverable Output**: See the finished markdown report, bug-free code, or customer email compiled in real-time.

---

## 🛠️ Technical Details (For Developers & Tech Recruiters)

If you are evaluating this project from a software engineering perspective, it showcases:
1. **State-Based Orchestration**: Built using cyclic graph structures (simulating state managers like LangGraph) to allow tasks to loop back to prior agents on validation failures.
2. **Observability & Telemetry**: Captures prompt/completion token weights, active tool success rates, and standardized logging tags (`[PLAN]`, `[THOUGHT]`, `[TOOL CALL]`, `[REFLECTION]`).
3. **Model Context Protocol (MCP)**: Exposes a reference server implementation ([mcp-server-demo.js](file:///C:/Users/micro/.gemini/antigravity/scratch/agent-lab/mcp-server-demo.js)) demonstrating how to expose tools like sandboxed terminals and SQL databases to AI clients.
4. **Zero-Build Architecture**: Implemented using semantic HTML5, Vanilla CSS3 (glassmorphic layout, SVG path updates, custom keyframes), and modular ES6 Javascript.

---

## 🚀 Quickstart (Running Locally)

Since the project uses ES Modules, serve the folder using a lightweight HTTP server:

**Option 1: Using Python**
```bash
python -m http.server 8000
```
**Option 2: Using Node/NPX**
```bash
npx http-server ./
```

Open `http://localhost:8000` (or `http://localhost:8080`) in your browser to run the playground!
