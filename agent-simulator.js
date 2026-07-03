/**
 * Agent Lab - Workflow Scenario Simulation Database
 * Contains nodes, connection edges, and step-by-step logs representing agent behavior.
 */

export const scenarios = {
  research: {
    title: "Research & Synthesis",
    goal: "Research 2026 commercial fusion energy developments and write a summary report.",
    nodes: [
      { id: "orchestrator", label: "Orchestrator", type: "planner", x: 10, y: 40, icon: "planner" },
      { id: "searcher", label: "Web Searcher", type: "tool", x: 36, y: 15, icon: "search" },
      { id: "web_api", label: "Web Search API", type: "tool", x: 36, y: 65, icon: "api" },
      { id: "critic", label: "Peer Critic", type: "critic", x: 62, y: 15, icon: "critic" },
      { id: "draft_reviewer", label: "Policy Guard", type: "critic", x: 62, y: 65, icon: "guard" },
      { id: "writer", label: "Report Writer", type: "writer", x: 88, y: 40, icon: "writer" }
    ],
    connections: [
      { from: "orchestrator", to: "searcher" },
      { from: "searcher", to: "web_api" },
      { from: "searcher", to: "critic" },
      { from: "critic", to: "orchestrator" },
      { from: "orchestrator", to: "writer" },
      { from: "writer", to: "draft_reviewer" },
      { from: "draft_reviewer", to: "writer" }
    ],
    steps: [
      {
        activeNodeId: "orchestrator",
        metrics: { tokens: 1250, cost: 0.00018, tools: 0, status: "Planning task" },
        activeConnections: [],
        logs: [
          { type: "system", text: "Initializing workflow: Research & Synthesis" },
          { type: "plan", text: "Goal: Research 2026 fusion energy and draft report." },
          { type: "thought", text: "Decomposing goal. Step 1: Query web for recent announcements on magnetic confinement fusion and laser ignition. Step 2: Extract metrics. Step 3: Peer review findings. Step 4: Write report." },
          { type: "plan", text: "Routing task to Web Searcher agent." }
        ],
        output: null
      },
      {
        activeNodeId: "searcher",
        metrics: { tokens: 3100, cost: 0.00045, tools: 0, status: "Formulating query" },
        activeConnections: ["orchestrator->searcher"],
        logs: [
          { type: "thought", text: "Received query request. I need to look up commercial developments in fusion power plants during 2025/2026." },
          { type: "thought", text: "Creating search query: 'commercial fusion energy milestones 2026 magnetic confinement laser ignition'" },
          { type: "plan", text: "Executing tool call: Google Search API." }
        ],
        output: null
      },
      {
        activeNodeId: "web_api",
        metrics: { tokens: 4600, cost: 0.00067, tools: 1, status: "Executing search" },
        activeConnections: ["searcher->web_api"],
        logs: [
          { type: "tool", text: "Call: WebSearchAPI(query='commercial fusion energy milestones 2026')" },
          { type: "obs", text: "Observation: Retrieved 4 results. 1. Commonwealth Fusion Systems (CFS) SPARC plant assembly updates. 2. Helion Energy Polaris deployment. 3. Tokamak Energy high-temperature superconductor milestones. 4. NIF net energy gain reports." }
        ],
        output: null
      },
      {
        activeNodeId: "searcher",
        metrics: { tokens: 6800, cost: 0.00102, tools: 1, status: "Analyzing results" },
        activeConnections: ["searcher->web_api"],
        logs: [
          { type: "thought", text: "Parsing search results. Helion Energy completed their Polaris test vessel, and CFS announced SPARC magnet assembly completion. I have raw data but I lack exact magnetic field strengths for CFS's 2026 milestones." },
          { type: "thought", text: "Formulating a secondary precise search to extract magnet technical specifications." },
          { type: "tool", text: "Call: WebSearchAPI(query='Commonwealth Fusion Systems SPARC magnet tesla field strength 2026')" }
        ],
        output: null
      },
      {
        activeNodeId: "web_api",
        metrics: { tokens: 8200, cost: 0.00123, tools: 2, status: "Refining data" },
        activeConnections: ["searcher->web_api"],
        logs: [
          { type: "tool", text: "Call: WebSearchAPI(query='Commonwealth Fusion Systems SPARC magnet tesla field strength 2026')" },
          { type: "obs", text: "Observation: Retrieved 2 papers. SPARC features a high-temperature superconducting (HTS) magnet system reaching 20.1 Tesla peak field strength." },
          { type: "success", text: "Information gathering complete. Synthesizing data package." }
        ],
        output: null
      },
      {
        activeNodeId: "critic",
        metrics: { tokens: 10400, cost: 0.00156, tools: 2, status: "Peer reviewing findings" },
        activeConnections: ["searcher->critic"],
        logs: [
          { type: "thought", text: "Reviewing Web Searcher's data package. CFS SPARC data looks solid (20.1 Tesla HTS magnets confirmed). Helion Polaris data lists helium-3 fusion plans, but misses timeline updates for grid synchronization." },
          { type: "correction", text: "Feedback to Orchestrator: Helion Polaris timeline is incomplete. Need verification on whether grid connection occurs in 2026 or 2027." }
        ],
        output: null
      },
      {
        activeNodeId: "orchestrator",
        metrics: { tokens: 12100, cost: 0.00181, tools: 2, status: "Adjusting execution plan" },
        activeConnections: ["critic->orchestrator"],
        logs: [
          { type: "thought", text: "Received feedback from Peer Critic. Re-routing task back to Searcher to check Helion grid connection date." },
          { type: "plan", text: "Re-initiating Searcher: query='Helion Polaris grid synchronization connection 2026 2027 timeline'" }
        ],
        output: null
      },
      {
        activeNodeId: "searcher",
        metrics: { tokens: 13900, cost: 0.00208, tools: 3, status: "Performing correction search" },
        activeConnections: ["orchestrator->searcher", "searcher->web_api"],
        logs: [
          { type: "thought", text: "Executing correction query to fill the gap flagged by Critic." },
          { type: "tool", text: "Call: WebSearchAPI(query='Helion Polaris grid connection date')" },
          { type: "obs", text: "Observation: Press release from early 2026 states Polaris test operations begin late 2026, grid synchronization target pushed to mid-2027. Microsoft agreement remains active." },
          { type: "success", text: "Gap filled. Forwarding finalized package to Orchestrator." }
        ],
        output: null
      },
      {
        activeNodeId: "writer",
        metrics: { tokens: 18200, cost: 0.00273, tools: 3, status: "Drafting final report" },
        activeConnections: ["orchestrator->writer"],
        logs: [
          { type: "thought", text: "Received verified research data package. Drafting structured report. Incorporating sections for: Introduction, CFS SPARC Magnet Milestones, Helion Polaris Grid Update, and Comparative Summary." },
          { type: "plan", text: "Generating Markdown output document." }
        ],
        output: `## Commercial Fusion Energy Developments (2026)

### 1. Commonwealth Fusion Systems (CFS) - SPARC
*   **Magnet Achievements**: Assembly of the high-temperature superconducting (HTS) magnets was finalized. The toroidal field coils achieved a peak magnetic field strength of **20.1 Tesla** in validation testing.
*   **Significance**: Confirms scaling laws for a compact tokamak design, significantly reducing the volume required to achieve net energy gain ($Q > 10$).

### 2. Helion Energy - Polaris
*   **Operational Milestones**: The Polaris test vessel assembly was completed in early 2026. Test runs using pulsed magnetic fields have commenced.
*   **Grid Timeline**: According to latest statements, test operations continue through late 2026, with grid synchronization and delivery to Microsoft now targeted for **mid-2027**.

### 3. Tokamak Energy - ST40
*   **High-Beta Operations**: The ST40 spherical tokamak successfully tested new high-temperature superconducting magnets, achieving plasma temperatures of 100M Kelvin.

---
*Report compiled by Research Agent Group.*`
      },
      {
        activeNodeId: "draft_reviewer",
        metrics: { tokens: 20500, cost: 0.00307, tools: 3, status: "Enforcing guardrails" },
        activeConnections: ["writer->draft_reviewer"],
        logs: [
          { type: "thought", text: "Checking draft for safety, hallucinations, and compliance with directives. 1. Fact Check: CFS SPARC (20.1 Tesla) is correct. 2. Fact Check: Helion Polaris Microsoft sync (2027) is correct. 3. Compliance: Outlines citations cleanly. No policy violations detected." },
          { type: "success", text: "Compliance checks passed. Approving document for publication." }
        ],
        output: `## Commercial Fusion Energy Developments (2026)

### 1. Commonwealth Fusion Systems (CFS) - SPARC
*   **Magnet Achievements**: Assembly of the high-temperature superconducting (HTS) magnets was finalized. The toroidal field coils achieved a peak magnetic field strength of **20.1 Tesla** in validation testing.
*   **Significance**: Confirms scaling laws for a compact tokamak design, significantly reducing the volume required to achieve net energy gain ($Q > 10$).

### 2. Helion Energy - Polaris
*   **Operational Milestones**: The Polaris test vessel assembly was completed in early 2026. Test runs using pulsed magnetic fields have commenced.
*   **Grid Timeline**: According to latest statements, test operations continue through late 2026, with grid synchronization and delivery to Microsoft now targeted for **mid-2027**.

### 3. Tokamak Energy - ST40
*   **High-Beta Operations**: The ST40 spherical tokamak successfully tested new high-temperature superconducting magnets, achieving plasma temperatures of 100M Kelvin.

---
*Report compiled by Research Agent Group. Verified by Policy Guard.*`
      },
      {
        activeNodeId: "orchestrator",
        metrics: { tokens: 21100, cost: 0.00316, tools: 3, status: "Task finished" },
        activeConnections: [],
        logs: [
          { type: "success", text: "Workflow completed successfully. Cost: $0.00316. Output delivered below." }
        ],
        output: `## Commercial Fusion Energy Developments (2026)

### 1. Commonwealth Fusion Systems (CFS) - SPARC
*   **Magnet Achievements**: Assembly of the high-temperature superconducting (HTS) magnets was finalized. The toroidal field coils achieved a peak magnetic field strength of **20.1 Tesla** in validation testing.
*   **Significance**: Confirms scaling laws for a compact tokamak design, significantly reducing the volume required to achieve net energy gain ($Q > 10$).

### 2. Helion Energy - Polaris
*   **Operational Milestones**: The Polaris test vessel assembly was completed in early 2026. Test runs using pulsed magnetic fields have commenced.
*   **Grid Timeline**: According to latest statements, test operations continue through late 2026, with grid synchronization and delivery to Microsoft now targeted for **mid-2027**.

### 3. Tokamak Energy - ST40
*   **High-Beta Operations**: The ST40 spherical tokamak successfully tested new high-temperature superconducting magnets, achieving plasma temperatures of 100M Kelvin.

---
*Report compiled by Research Agent Group. Verified by Policy Guard.*`
      }
    ]
  },
  
  coding: {
    title: "Self-Healing Coder",
    goal: "Fix the binary search implementation to prevent infinite loops and optimize performance.",
    nodes: [
      { id: "planner", label: "Lead Planner", type: "planner", x: 10, y: 40, icon: "planner" },
      { id: "coder", label: "Coder Agent", type: "writer", x: 36, y: 20, icon: "writer" },
      { id: "sandbox", label: "Sandbox Runner", type: "tool", x: 62, y: 20, icon: "api" },
      { id: "debugger", label: "Debugger Agent", type: "critic", x: 62, y: 65, icon: "critic" },
      { id: "evaluator", label: "Code Evaluator", type: "critic", x: 88, y: 40, icon: "guard" }
    ],
    connections: [
      { from: "planner", to: "coder" },
      { from: "coder", to: "sandbox" },
      { from: "sandbox", to: "debugger" },
      { from: "debugger", to: "coder" },
      { from: "sandbox", to: "evaluator" },
      { from: "evaluator", to: "planner" }
    ],
    steps: [
      {
        activeNodeId: "planner",
        metrics: { tokens: 850, cost: 0.00012, tools: 0, status: "Analyzing repository" },
        activeConnections: [],
        logs: [
          { type: "system", text: "Initializing workflow: Self-Healing Coder" },
          { type: "plan", text: "Goal: Fix bug in `binary_search` implementation." },
          { type: "thought", text: "Inspecting codebase logs. User reports that binary_search enters infinite loop when looking for items not in the list, or when duplicate items exist." },
          { type: "plan", text: "Instructing Coder Agent to write the fix." }
        ],
        output: null
      },
      {
        activeNodeId: "coder",
        metrics: { tokens: 2600, cost: 0.00039, tools: 0, status: "Writing codebase fix" },
        activeConnections: ["planner->coder"],
        logs: [
          { type: "thought", text: "Looking at the broken binary search code. It has a calculation bug: `mid = (low + high) / 2`. In JavaScript, division yields floats unless floored. Furthermore, if target is not found, low/high adjustments might hang." },
          { type: "thought", text: "Writing a standard binary search but neglecting the Math.floor bug temporarily to simulate test failure." },
          { type: "plan", text: "Sending code draft to Sandbox Runner to execute tests." }
        ],
        output: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    let mid = (low + high) / 2; // BUG: Will produce decimals
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid; // BUG: Infinite loop risk (should be mid + 1)
    } else {
      high = mid; // BUG: Infinite loop risk (should be mid - 1)
    }
  }
  return -1;
}`
      },
      {
        activeNodeId: "sandbox",
        metrics: { tokens: 3800, cost: 0.00057, tools: 1, status: "Running unit tests" },
        activeConnections: ["coder->sandbox"],
        logs: [
          { type: "tool", text: "Call: SandboxExec(test_script.js, code)" },
          { type: "error", text: "Test Failure: Process terminated due to Timeout (Infinite Loop detected)." },
          { type: "obs", text: "Traceback: RangeError: Maximum call stack size exceeded / Execution hung at while(low <= high) loop." }
        ],
        output: null
      },
      {
        activeNodeId: "debugger",
        metrics: { tokens: 5900, cost: 0.00088, tools: 1, status: "Analyzing failure traceback" },
        activeConnections: ["sandbox->debugger"],
        logs: [
          { type: "thought", text: "Analyzing the test failure in the sandbox. The execution hung. Why?" },
          { type: "thought", text: "Look at `mid = (low + high) / 2`. In JS, if low=0, high=1, mid becomes 0.5. `arr[0.5]` is undefined. This causes comparisons like `arr[0.5] < target` to evaluate to false, routing to the else block: `high = mid (0.5)`. The loop high becomes 0.5, low becomes 0, mid becomes 0.25... it goes into infinite loop." },
          { type: "correction", text: "Feedback to Coder: 1. Use Math.floor() for mid calculation. 2. Increment low/high: `low = mid + 1` and `high = mid - 1` to ensure convergence." }
        ],
        output: null
      },
      {
        activeNodeId: "coder",
        metrics: { tokens: 8400, cost: 0.00126, tools: 1, status: "Applying self-healing patch" },
        activeConnections: ["debugger->coder"],
        logs: [
          { type: "thought", text: "Got the debugger's analysis. That is correct. I must floor the index: `let mid = Math.floor((low + high) / 2)`. I also must shift low and high pointers past the mid element to avoid loops." },
          { type: "thought", text: "Rewriting the code and dispatching to Sandbox Runner." }
        ],
        output: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`
      },
      {
        activeNodeId: "sandbox",
        metrics: { tokens: 9900, cost: 0.00148, tools: 2, status: "Re-executing unit tests" },
        activeConnections: ["coder->sandbox"],
        logs: [
          { type: "tool", text: "Call: SandboxExec(test_script.js, code)" },
          { type: "obs", text: "Observation: Test Suite passed. 4/4 tests succeeded. Test 1 (Element present): Pass. Test 2 (Element absent): Pass. Test 3 (Empty array): Pass. Test 4 (Large array): Pass." },
          { type: "success", text: "All tests executed successfully in sandbox." }
        ],
        output: null
      },
      {
        activeNodeId: "evaluator",
        metrics: { tokens: 11200, cost: 0.00168, tools: 2, status: "Reviewing code quality" },
        activeConnections: ["sandbox->evaluator"],
        logs: [
          { type: "thought", text: "Validating code quality. Algorithmic complexity is correct: O(log N). Implementation is safe against overflow? In JS, integer limits are high, but for best practices we can mention `low + Math.floor((high - low) / 2)` to avoid integer overflow." },
          { type: "success", text: "Code accepted. Submitting final delivery." }
        ],
        output: `/**
 * Performs a binary search on a sorted array.
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 *
 * @param {Array} arr - Sorted array of elements
 * @param {*} target - Element to search for
 * @returns {number} The index of the target, or -1 if not found
 */
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    // Avoids integer overflow (best practice in software engineering)
    let mid = low + Math.floor((high - low) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1; // Narrow search to upper half
    } else {
      high = mid - 1; // Narrow search to lower half
    }
  }
  return -1; // Target not found
}`
      },
      {
        activeNodeId: "planner",
        metrics: { tokens: 12000, cost: 0.00180, tools: 2, status: "Finished" },
        activeConnections: [],
        logs: [
          { type: "success", text: "Workflow completed successfully. Coder self-healed after infinite-loop failure. Deliverable output compiled below." }
        ],
        output: `/**
 * Performs a binary search on a sorted array.
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 *
 * @param {Array} arr - Sorted array of elements
 * @param {*} target - Element to search for
 * @returns {number} The index of the target, or -1 if not found
 */
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    // Avoids integer overflow (best practice in software engineering)
    let mid = low + Math.floor((high - low) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1; // Narrow search to upper half
    } else {
      high = mid - 1; // Narrow search to lower half
    }
  }
  return -1; // Target not found
}`
      }
    ]
  },
  
  routing: {
    title: "Support & Guardrails",
    goal: "Process customer refund request for transaction #4892.",
    nodes: [
      { id: "router", label: "Ticket Router", type: "planner", x: 10, y: 40, icon: "planner" },
      { id: "customer_db", label: "Customer DB", type: "tool", x: 36, y: 15, icon: "api" },
      { id: "writer", label: "Draft Writer", type: "writer", x: 36, y: 65, icon: "writer" },
      { id: "refund_agent", label: "Refund Manager", type: "planner", x: 62, y: 15, icon: "planner" },
      { id: "policy_critic", label: "Policy Guard", type: "critic", x: 62, y: 65, icon: "guard" },
      { id: "delivery", label: "Delivery Agent", type: "writer", x: 88, y: 40, icon: "writer" }
    ],
    connections: [
      { from: "router", to: "customer_db" },
      { from: "router", to: "writer" },
      { from: "customer_db", to: "refund_agent" },
      { from: "refund_agent", to: "writer" },
      { from: "writer", to: "policy_critic" },
      { from: "policy_critic", to: "writer" },
      { from: "policy_critic", to: "delivery" }
    ],
    steps: [
      {
        activeNodeId: "router",
        metrics: { tokens: 900, cost: 0.00014, tools: 0, status: "Analyzing support ticket" },
        activeConnections: [],
        logs: [
          { type: "system", text: "Initializing workflow: Support & Guardrails" },
          { type: "plan", text: "Goal: Route and reply to ticket regarding refund for txn #4892." },
          { type: "thought", text: "Ticket details: 'I requested a refund on my subscription cancellation 3 days ago. I haven't received it.' I must first retrieve the transaction state from the database." },
          { type: "plan", text: "Routing database query task to Customer DB agent." }
        ],
        output: null
      },
      {
        activeNodeId: "customer_db",
        metrics: { tokens: 2100, cost: 0.00032, tools: 1, status: "Querying customer profile" },
        activeConnections: ["router->customer_db"],
        logs: [
          { type: "tool", text: "Call: DatabaseTool(query='select * from transactions where id = 4892')" },
          { type: "obs", text: "Observation: Transaction found. User: Jane Doe. Amount: $49.00. Date: June 30. Status: PENDING_BANK_SYNC. Cancellation date: July 1." },
          { type: "success", text: "Forwarding status to Refund Manager." }
        ],
        output: null
      },
      {
        activeNodeId: "refund_agent",
        metrics: { tokens: 3500, cost: 0.00053, tools: 1, status: "Verifying eligibility" },
        activeConnections: ["customer_db->refund_agent"],
        logs: [
          { type: "thought", text: "Received database transaction profile. The charge status is PENDING_BANK_SYNC, not SETTLED yet. Refund cannot be initiated until settled." },
          { type: "thought", text: "Formulating instruction: Subscriptions cancellation policy allows refunds within 7 days. Customer canceled within 1 day. Eligible, but delayed due to banking processing sync." },
          { type: "plan", text: "Instructing Draft Writer to write email explaining situation." }
        ],
        output: null
      },
      {
        activeNodeId: "writer",
        metrics: { tokens: 5800, cost: 0.00087, tools: 1, status: "Drafting email response" },
        activeConnections: ["refund_agent->writer"],
        logs: [
          { type: "thought", text: "Drafting response to customer Jane Doe. I will explain that we are issuing the refund, apologizing profusely, and offering a $20 gift voucher to make up for the delay." },
          { type: "plan", text: "Sending drafted message to Policy Guard to check alignment." }
        ],
        output: `Subject: Refund Update for Subscription #4892

Dear Jane,

I am incredibly sorry about the delay. We have processed your refund of $49.00, but it is currently stuck in banking sync. 
Because of this delay, I'd love to offer you a free $20.00 Amazon Gift Voucher to apologize. You should see the funds in 1 day.

Best regards,
Support Team`
      },
      {
        activeNodeId: "policy_critic",
        metrics: { tokens: 7400, cost: 0.00111, tools: 1, status: "Enforcing safety constraints" },
        activeConnections: ["writer->policy_critic"],
        logs: [
          { type: "thought", text: "Reviewing email draft against customer alignment policies. 1. Financial rule: Agents cannot issue gift cards exceeding $10 without manager override. 2. SLA rule: Funds sync takes 3-5 business days, saying '1 day' violates SLA policies." },
          { type: "correction", text: "Policy Violation Flagged: 1. Gift card exceeds maximum allowance ($20 vs $10 limit). 2. SLA claim of '1 day' is inaccurate (must state 3-5 business days)." },
          { type: "plan", text: "Routing feedback back to Draft Writer for correction." }
        ],
        output: null
      },
      {
        activeNodeId: "writer",
        metrics: { tokens: 9900, cost: 0.00149, tools: 1, status: "Correcting ticket response" },
        activeConnections: ["policy_critic->writer"],
        logs: [
          { type: "thought", text: "Analyzing Policy Guard feedback. Ah, I violated financial limits and SLA estimates. I will rewrite the email: adjusting compensation to a $10 store credit and amending the banking sync timeline to 3-5 business days." },
          { type: "plan", text: "Re-submitting edited email to Policy Guard." }
        ],
        output: `Subject: Refund Update for Subscription #4892

Dear Jane,

Thank you for reaching out. We have reviewed your account and confirmed your refund of $49.00 is active. It is currently in banking synchronization and should reflect in your account within 3 to 5 business days.

As a gesture of goodwill, we have credited your profile with $10.00 store credit.

Best regards,
Support Team`
      },
      {
        activeNodeId: "policy_critic",
        metrics: { tokens: 11400, cost: 0.00171, tools: 1, status: "Verifying safety patch" },
        activeConnections: ["writer->policy_critic"],
        logs: [
          { type: "thought", text: "Analyzing corrected draft. Store credit is $10 (compliant). Timeline is 3-5 business days (compliant). Language is polite and professional." },
          { type: "success", text: "Policy check successful. Passing message to Delivery Agent." }
        ],
        output: null
      },
      {
        activeNodeId: "delivery",
        metrics: { tokens: 12200, cost: 0.00183, tools: 2, status: "Delivering message" },
        activeConnections: ["policy_critic->delivery"],
        logs: [
          { type: "thought", text: "Received approved response. Sending email via SendGrid API and marking support ticket #4892 as 'Pending Bank Sync'." },
          { type: "tool", text: "Call: SendGridAPI(to='jane.doe@example.com', subject='Refund Update')" },
          { type: "success", text: "Ticket routed, processed, checked, and delivered successfully." }
        ],
        output: `Subject: Refund Update for Subscription #4892

Dear Jane,

Thank you for reaching out. We have reviewed your account and confirmed your refund of $49.00 is active. It is currently in banking synchronization and should reflect in your account within 3 to 5 business days.

As a gesture of goodwill, we have credited your profile with $10.00 store credit.

Best regards,
Support Team`
      },
      {
        activeNodeId: "router",
        metrics: { tokens: 12600, cost: 0.00189, tools: 2, status: "Workflow completed" },
        activeConnections: [],
        logs: [
          { type: "success", text: "Workflow completed successfully. Policy Guard caught SLA and financial violations and successfully self-corrected draft before final delivery." }
        ],
        output: `Subject: Refund Update for Subscription #4892

Dear Jane,

Thank you for reaching out. We have reviewed your account and confirmed your refund of $49.00 is active. It is currently in banking synchronization and should reflect in your account within 3 to 5 business days.

As a gesture of goodwill, we have credited your profile with $10.00 store credit.

Best regards,
Support Team`
      }
    ]
  }
};
