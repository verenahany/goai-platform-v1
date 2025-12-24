# GoAI Sovereign Platform v1

**Enterprise AI Under Your Complete Control**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/License-Enterprise-gold?style=flat-square)](LICENSE)

---

**A production-ready, self-hosted AI infrastructure for organizations that demand data sovereignty, model control, and regulatory compliance.**

🚀 [Quick Start](#-quick-start) • 📖 [Documentation](#-documentation) • 🧪 [Try Examples](#-try-it-now) • 🔧 [API Reference](#-complete-api-reference)

---

## 📋 Table of Contents

- [What Makes GoAI Different](#-what-makes-goai-different)
- [Quick Start (5 Minutes)](#-quick-start-5-minutes)
- [Architecture Overview](#-architecture-overview)
- [Key Concepts Explained](#-key-concepts-explained)
  - [AI Agents](#1-ai-agents---autonomous-task-execution)
  - [RAG Pipeline](#2-rag-retrieval-augmented-generation)
  - [Multi-Agent Collaboration](#3-multi-agent-collaboration)
  - [AI Guardrails](#4-ai-guardrails---safety--compliance)
  - [Human-in-the-Loop](#5-human-in-the-loop-hitl)
  - [Observability](#6-agent-observability)
- [Try It Now - Examples](#-try-it-now)
- [Complete API Reference](#-complete-api-reference)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ⚡ What Makes GoAI Different?

### 🔐 Complete Data Sovereignty
Your data never leaves your infrastructure. Run LLMs on-premises with full audit trails. Perfect for healthcare, finance, and government sectors.

### 🤖 Production-Ready AI Agents
- **11 pre-built agent templates** (researcher, code reviewer, data analyst, etc.)
- **Tool-calling framework** (calculator, web search, Python execution)
- **Plan-and-Execute pattern** for complex multi-step tasks
- **Multi-agent collaboration** (sequential, parallel, debate, hierarchical)

### 📚 Enterprise RAG with 5 Retrieval Modes
- **Simple** - Direct Q&A
- **Conversational** - Multi-turn with history
- **Multi-Query** - Complex question expansion
- **Step-Back** - Abstract reasoning
- **HyDE** - Hypothetical document embeddings

### 🛡️ AI Safety & Governance
- **Guardrails** - Prompt injection detection, PII redaction, harmful content blocking
- **Human-in-the-Loop** - Approval workflows for sensitive actions
- **Observability Dashboard** - Real-time monitoring, cost tracking, execution traces

### 📊 Built-in AI Evaluations
- LLM-as-Judge quality metrics
- Regression detection
- Systematic testing frameworks
- Dataset management

### 🔌 Integration & Automation
- **MCP Protocol** - Standardized tool integration
- **Webhooks & Triggers** - Event-driven automation
- **YAML Workflows** - Orchestration with conditional logic

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- **Python 3.10+** (3.12.6 recommended)
- **Node.js 18+** (for React UI)
- **OpenAI API Key** (optional - for cloud LLM features)

### Installation

#### Option 1: Run Directly (Windows - Recommended for Development)

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# 3. Start backend server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 4. In a new terminal, start UI
cd frontend
npm install
npm run dev
```

**Quick Start Scripts (Windows):**
- Double-click `start_server.bat` - Starts backend on port 8000
- Double-click `start_ui.bat` - Starts UI on port 3000

#### Option 2: Docker Compose (Production)

```bash
# Start all services
docker-compose up -d

# Verify services
curl http://localhost:8000/health
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend UI** | http://localhost:3000 | React dashboard |
| **Backend API** | http://localhost:8000 | REST API |
| **API Docs** | http://localhost:8000/api/docs | Interactive Swagger UI |
| **Observability** | http://localhost:8000/api/v1/observability/dashboard/html | Agent monitoring |

### Verify Installation

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test configuration
curl http://localhost:8000/config
```

**Expected Response:**
```json
{
  "openai_configured": true,
  "anthropic_configured": false,
  "environment": "dev"
}
```

---

## 🏗️ Architecture Overview

GoAI uses a **5-layer sovereign stack** architecture:

```
┌────────────────────────────────────────────────────────────┐
│                   LAYER 5: OPERATIONS                      │
│    Monitoring • Backups • Disaster Recovery • Deployment  │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│              LAYER 4: APPLICATIONS (Use Cases)             │
│  RAG Chat • Policy Assistant • Document Validator         │
│  Ticket Analyzer • Meeting Notes • KYC Verification       │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                  LAYER 3: KNOWLEDGE                        │
│  Ingestion Pipeline → Extract → Chunk → Embed → Index    │
│  FAISS Vector Store • ACL • Metadata Store (PostgreSQL)   │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                   LAYER 2: GATEWAY                         │
│  FastAPI Router • Auth (JWT/RBAC) • Rate Limiter         │
│  Audit Logger • Metrics (Prometheus) • Error Handler      │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                  LAYER 1: INFERENCE                        │
│  LLM Router (OpenAI, Anthropic, Ollama)                  │
│  GPU Infrastructure (vLLM) • Model Fallback Chain        │
└────────────────────────────────────────────────────────────┘
```

### Request Flow Example

**User asks: "What's our vacation policy?"**

```
1. React UI (Port 3000)
   ↓ POST /api/v1/rag/query

2. FastAPI Gateway
   ↓ Auth check → Rate limit → Audit log

3. RAG Engine
   ↓ Create embedding → Search FAISS → Get top 5 chunks

4. LLM Router
   ↓ Select provider (OpenAI) → Call GPT-4
   ↓ Prompt: System + Context + Query

5. OpenAI API
   ↓ Returns: "Employees receive 20 days PTO per year..."

6. RAG Engine
   ↓ Add citations → Save to conversation history

7. React UI
   ✓ Display answer with sources
```

---

## 💡 Key Concepts Explained

### 1. AI Agents - Autonomous Task Execution

**What they are:**
AI agents are autonomous programs that can think, act, and iterate until a task is complete.

**Capabilities:**
- 🧠 **Think** - Use LLMs to reason about problems
- 🔧 **Act** - Call tools (calculator, web search, code execution)
- 👀 **Observe** - See results and decide next steps
- 🔄 **Iterate** - Continue until task is complete (max 5 iterations)

**Example Agent Execution:**

```
User: "What's 15% tip on a $125 bill?"

Iteration 1:
  LLM thinks: "I need to calculate 15% of 125"
  Calls: calculator("125 * 0.15")
  Gets: 18.75

Iteration 2:
  LLM thinks: "I have the answer"
  Returns: "A 15% tip on $125 is $18.75"
```

**Code Location:** [`modules/agents/engine.py`](modules/agents/engine.py#L93-L341)

**Available Tools:**

| Tool | Description | Example |
|------|-------------|---------|
| `calculator` | Math expressions | `{"expression": "sqrt(144) * 2"}` |
| `get_datetime` | Current date/time | `{}` |
| `web_search` | DuckDuckGo search | `{"query": "Python FastAPI", "num_results": 5}` |
| `execute_python` | Run Python (sandboxed) | `{"code": "print(sum(range(10)))"}` |
| `fetch_url` | Fetch webpage | `{"url": "https://example.com"}` |
| `parse_json` | Parse JSON strings | `{"json_string": "{\"key\": \"value\"}"}` |

**11 Pre-built Agent Templates:**

| Template | Pattern | Best For |
|----------|---------|----------|
| `researcher` | Plan-Execute | Deep research with web search |
| `data_analyst` | Plan-Execute | Data analysis & statistics |
| `code_reviewer` | Simple | Code reviews & security analysis |
| `code_generator` | Simple | Writing clean, documented code |
| `writer` | Simple | Content creation & editing |
| `summarizer` | Simple | Document summarization |
| `customer_support` | Simple | Customer service responses |
| `sql_expert` | Simple | SQL queries & optimization |
| `planner` | Plan-Execute | Project planning & breakdown |
| `research_team` | Multi-Agent | Team-based research |
| `code_review_team` | Multi-Agent | Multi-perspective code review |

### 2. RAG (Retrieval-Augmented Generation)

**The Problem:** LLMs don't know about YOUR company's documents, policies, or proprietary data.

**The Solution:** RAG combines document retrieval with LLM generation.

**How It Works:**

```
┌─────────────────────────────────────────────────────┐
│                  1. INGEST PHASE                    │
│                                                     │
│  Upload PDF/DOCX → Extract Text → Split Chunks     │
│         ↓                                           │
│  Create Embeddings → Store in FAISS Vector DB      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  2. QUERY PHASE                     │
│                                                     │
│  User Question → Create Embedding → Search FAISS   │
│         ↓                                           │
│  Retrieve Top-K Chunks → Send to LLM with Context  │
│         ↓                                           │
│  LLM Generates Answer → Add Citations → Return     │
└─────────────────────────────────────────────────────┘
```

**5 Retrieval Modes:**

| Mode | How It Works | Best For |
|------|--------------|----------|
| **Simple** | Direct query → retrieve → generate | Basic Q&A |
| **Conversational** | Includes conversation history | Multi-turn chat |
| **Multi-Query** | Generates 3-5 variations of query | Complex questions |
| **Step-Back** | Asks broader question first | Abstract reasoning |
| **HyDE** | Generates hypothetical answer to search | Semantic matching |

**Code Location:** [`modules/rag/engine.py`](modules/rag/engine.py)

### 3. Multi-Agent Collaboration

**Multiple AI agents working together on complex tasks.**

**Collaboration Patterns:**

#### Sequential (Chain of Specialists)
```
Research Agent → Analyzes data
       ↓
Writing Agent → Creates report
       ↓
Review Agent → Checks quality
       ↓
Final Output
```

#### Parallel (Divide and Conquer)
```
Agent 1: Research competitors ─┐
Agent 2: Analyze pricing ──────├─→ Aggregator → Final Report
Agent 3: Survey customers ─────┘
```

#### Debate (Multiple Perspectives)
```
Pro Agent: Arguments FOR feature
Con Agent: Arguments AGAINST feature
Moderator: Synthesizes both views → Decision
```

#### Hierarchical (Leader-Worker)
```
Manager Agent: Plans & coordinates
       ↓
Worker 1 → Task A
Worker 2 → Task B
Worker 3 → Task C
       ↓
Manager: Aggregates results
```

**Code Location:** [`modules/agents/multi_agent.py`](modules/agents/multi_agent.py)

### 4. AI Guardrails - Safety & Compliance

**Prevents AI from doing harmful or non-compliant things.**

**Guardrail Categories:**

#### Input Guardrails (Check User Messages)
- ❌ Prompt injection attempts ("Ignore previous instructions...")
- ❌ Harmful requests (weapons, illegal activities)
- ❌ Profanity and offensive language

#### Output Guardrails (Check AI Responses)
- 🔒 **PII Redaction** - Automatically redacts:
  - Social Security Numbers (123-45-6789 → [REDACTED])
  - Credit card numbers
  - Email addresses
  - Phone numbers
- ❌ Harmful content blocking
- ✅ Compliance checking

#### Tool Guardrails (Control Agent Actions)
- 🚫 Restrict dangerous tools (e.g., code execution)
- 💰 Enforce cost limits (max tokens per request)
- ⏱️ Rate limiting (requests per user/hour)

**Example:**

```json
Input: "The user's SSN is 123-45-6789 and email is john@example.com"

After Guardrails:
{
  "content": "The user's SSN is [REDACTED] and email is [REDACTED]",
  "modified": true,
  "violations": ["pii_detected"]
}
```

**Code Location:** [`modules/agents/guardrails.py`](modules/agents/guardrails.py)

### 5. Human-in-the-Loop (HITL)

**Requires human approval before sensitive actions.**

**How It Works:**

```
Agent wants to: "Delete 10,000 customer records"
       ↓
HITL System:
  1. Pauses agent execution
  2. Creates approval request
  3. Notifies admin (email/webhook)
  4. Waits for response (timeout: 2 hours)
       ↓
Admin Decision:
  ✅ Approve → Agent continues
  ❌ Reject → Agent stops with error
  ⏱️ Timeout → Auto-reject
```

**Built-in Approval Policies:**

| Category | Actions | Timeout |
|----------|---------|---------|
| **High Risk** | payment, delete, sensitive_data | 2 hours |
| **External** | send_email, external_api, publish | 1 hour |
| **Data Modification** | database_modify, file_write | 30 min |
| **Cost Control** | high_cost (>$10) | 1 hour |

**Code Location:** [`modules/agents/hitl.py`](modules/agents/hitl.py)

### 6. Agent Observability

**Real-time monitoring and analytics for all agent operations.**

**What It Tracks:**

- 📊 **Execution Traces** - Every step an agent takes
- 💰 **Cost Tracking** - Automatic per-model cost calculation
  - GPT-4: ~$0.03 per 1K input tokens
  - GPT-3.5: ~$0.0015 per 1K input tokens
- 🔧 **Tool Usage** - Which tools are called most
- ⚠️ **Error Monitoring** - Real-time failure tracking
- 📈 **Performance Metrics** - Response times, success rates
- 🔴 **Live Streaming** - SSE events for real-time updates

**Dashboard Access:**
- Visual: http://localhost:8000/api/v1/observability/dashboard/html
- API: http://localhost:8000/api/v1/observability/dashboard

**Code Location:** [`modules/agents/observability.py`](modules/agents/observability.py)

---

## 🧪 Try It Now

### 1. Test Agent Tools (No API Key Required)

```bash
# Calculator
curl -X POST http://localhost:8000/api/v1/agents/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"tool_name": "calculator", "arguments": {"expression": "(100 * 25) + 500"}}'
# Returns: {"result": 3000}

# Get Current Date/Time
curl -X POST http://localhost:8000/api/v1/agents/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"tool_name": "get_datetime", "arguments": {}}'

# Web Search
curl -X POST http://localhost:8000/api/v1/agents/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"tool_name": "web_search", "arguments": {"query": "FastAPI best practices", "num_results": 3}}'
```

### 2. Test RAG Pipeline (Requires API Key)

```bash
# Step 1: Ingest a Document
curl -X POST http://localhost:8000/api/v1/ingest/text \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Our company vacation policy: All employees receive 20 days paid time off per year. Unused days can carry over up to 5 days maximum. Requests must be submitted 2 weeks in advance.",
    "filename": "vacation_policy.txt"
  }'

# Step 2: Query the Document
curl -X POST http://localhost:8000/api/v1/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How many vacation days do employees get?",
    "mode": "simple"
  }'
# Returns answer with source citations
```

### 3. Test AI Agent with Plan-and-Execute

```bash
curl -X POST http://localhost:8000/api/v1/agents/plan-execute \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Research the top 3 Python web frameworks and compare their features"
  }'
```

### 4. Test Agent Template

```bash
# List all templates
curl http://localhost:8000/api/v1/agents/templates

# Run the "writer" template
curl -X POST http://localhost:8000/api/v1/agents/templates/writer/run \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Write a professional email to a client apologizing for a delayed shipment",
    "template_id": "writer"
  }'
```

### 5. Test Guardrails

```bash
# Check for PII in output
curl -X POST http://localhost:8000/api/v1/guardrails/check/output \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The customer SSN is 123-45-6789 and their email is john.doe@example.com"
  }'
# Returns: Content with [REDACTED] replacements
```

### 6. Test Multi-Agent Collaboration

```bash
curl -X POST http://localhost:8000/api/v1/multi-agent/run \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Analyze the pros and cons of implementing a new feature",
    "pattern": "debate",
    "agents": [
      {"role": "advocate", "system_prompt": "You argue FOR the feature"},
      {"role": "critic", "system_prompt": "You argue AGAINST the feature"}
    ]
  }'
```

---

## 🔧 Complete API Reference

### 📊 API Module Overview

**32 API modules** covering all platform capabilities:

| Category | Modules | Count |
|----------|---------|:-----:|
| **🧠 Intelligence** | LLM, Streaming, Agents, Multi-Agent, Plan-Execute, Templates | 6 |
| **📚 Knowledge** | RAG, Ingest, Retrieve, Memory | 4 |
| **📊 Analysis** | Sentiment, SQL Agent, Validator, OCR | 4 |
| **🔄 Automation** | Orchestrator, Triggers, MCP Protocol | 3 |
| **📈 Quality** | AI Evaluations, Feedback, Activity | 3 |
| **🛡️ Governance** | Guardrails, Approvals (HITL), Observability | 3 |
| **🔐 Platform** | Auth, Upload, Export, Prompts, Performance, Telemetry | 6 |
| **🎯 Domain** | EBC Tickets, Customer KYC, Meeting Notes | 3 |

### 🤖 AI Agents Endpoints

```bash
# Run agent
POST /api/v1/agents/run
Body: {"task": "Your task", "tools": ["calculator", "web_search"]}

# Stream agent execution (SSE)
POST /api/v1/agents/stream

# Plan-and-Execute
POST /api/v1/agents/plan-execute
Body: {"task": "Complex multi-step task"}

# List available tools
GET /api/v1/agents/tools

# Execute tool directly
POST /api/v1/agents/tools/execute

# List agent templates
GET /api/v1/agents/templates

# Run agent from template
POST /api/v1/agents/templates/{template_id}/run
```

### 📚 RAG & Knowledge Endpoints

```bash
# Simple RAG query
POST /api/v1/rag/query
Body: {"query": "Your question", "mode": "simple", "top_k": 5}

# Conversational RAG (with history)
POST /api/v1/rag/chat
Body: {"query": "Follow-up question", "conversation_id": "conv-123"}

# Ingest text
POST /api/v1/ingest/text
Body: {"content": "Document text", "filename": "doc.txt"}

# Ingest document (PDF, DOCX, etc.)
POST /api/v1/ingest/document
Form-data: file

# Semantic search (without generation)
POST /api/v1/retrieve/
Body: {"query": "Search query", "top_k": 10}

# Get RAG statistics
GET /api/v1/rag/stats
```

### 🛡️ AI Guardrails Endpoints

```bash
# Check user input safety
POST /api/v1/guardrails/check/input
Body: {"content": "User message", "user_id": "user-123"}

# Check AI output (with PII redaction)
POST /api/v1/guardrails/check/output
Body: {"content": "AI response"}

# Check if tool call is allowed
POST /api/v1/guardrails/check/tool
Body: {"tool_name": "execute_python", "user_id": "user-123"}

# List all guardrail rules
GET /api/v1/guardrails/rules

# Get statistics
GET /api/v1/guardrails/stats

# View recent violations
GET /api/v1/guardrails/violations
```

### 👤 Human-in-the-Loop Endpoints

```bash
# Create approval request
POST /api/v1/approvals/requests
Body: {"action": "Delete records", "category": "delete"}

# List pending approvals
GET /api/v1/approvals/pending

# Approve request
POST /api/v1/approvals/requests/{id}/approve
Body: {"reason": "Approved by admin", "responded_by": "admin@example.com"}

# Reject request
POST /api/v1/approvals/requests/{id}/reject

# Check if approval required
POST /api/v1/approvals/check
Body: {"category": "payment", "context": {"amount": 500}}
```

### 👁️ Observability Endpoints

```bash
# Visual dashboard (HTML)
GET /api/v1/observability/dashboard/html

# Dashboard data (JSON)
GET /api/v1/observability/dashboard

# List execution traces
GET /api/v1/observability/traces

# Get trace details
GET /api/v1/observability/traces/{trace_id}

# Tool usage statistics
GET /api/v1/observability/stats/tools

# Cost breakdown
GET /api/v1/observability/stats/cost

# Real-time event stream (SSE)
GET /api/v1/observability/stream
```

### 👥 Multi-Agent Endpoints

```bash
# Run multi-agent task
POST /api/v1/multi-agent/run
Body: {
  "task": "Your task",
  "pattern": "sequential|parallel|debate|hierarchical",
  "agents": [...]
}

# List collaboration patterns
GET /api/v1/multi-agent/patterns
```

### 📊 AI Evaluations Endpoints

```bash
# Create evaluation dataset
POST /api/v1/evals/datasets
Body: {
  "name": "Test Dataset",
  "test_cases": [...]
}

# Run evaluation
POST /api/v1/evals/run
Body: {"dataset_id": "dataset-123", "model": "gpt-4"}

# List metrics
GET /api/v1/evals/metrics

# Get evaluation results
GET /api/v1/evals/runs
```

For complete API documentation, visit: **http://localhost:8000/api/docs**

---

## 📁 Project Structure

```
goai-platform-v1/
│
├── main.py                      # FastAPI entry point - 121 lines
├── requirements.txt             # Python dependencies - 71 packages
├── .env                         # Configuration (API keys, database)
├── docker-compose.yaml          # Multi-container orchestration
│
├── start_server.bat             # Windows: Start backend
├── start_ui.bat                 # Windows: Start frontend
│
├── api/v1/                      # REST API Layer (32 modules, ~10,641 lines)
│   ├── agents.py                # Agent execution endpoints
│   ├── rag.py                   # RAG query endpoints
│   ├── llm.py                   # Direct LLM access
│   ├── stream.py                # SSE streaming
│   ├── memory.py                # User memory system
│   ├── evals.py                 # AI evaluations
│   ├── mcp.py                   # Model Context Protocol
│   ├── triggers.py              # Webhooks & automation
│   ├── guardrails.py            # AI safety controls
│   ├── approvals.py             # Human-in-the-Loop
│   ├── observability.py         # Agent monitoring
│   ├── meeting_notes.py         # Meeting summarization
│   └── [20 more modules...]
│
├── core/                        # Core Infrastructure
│   ├── llm/
│   │   ├── router.py            # Multi-provider LLM routing
│   │   └── ollama.py            # Local model support
│   ├── vector/
│   │   └── retriever.py         # FAISS vector search
│   ├── auth/                    # JWT authentication & RBAC
│   ├── cache/                   # Redis caching layer
│   ├── database/                # SQLAlchemy ORM
│   ├── orchestrator/            # YAML workflow engine
│   ├── telemetry/               # Metrics & tracing
│   ├── performance/             # Optimization utilities
│   ├── security/                # Security controls
│   └── audit/                   # Audit logging
│
├── modules/                     # Feature Modules
│   ├── agents/                  # AI Agent Framework
│   │   ├── engine.py            # Core agent logic (341 lines)
│   │   ├── tools.py             # Tool registry (calculator, web, etc.)
│   │   ├── planner.py           # Plan-and-Execute pattern
│   │   ├── templates.py         # 11 pre-built agent templates
│   │   ├── multi_agent.py       # Multi-agent collaboration
│   │   ├── guardrails.py        # AI safety guardrails
│   │   ├── hitl.py              # Human-in-the-Loop approvals
│   │   └── observability.py     # Agent monitoring & tracing
│   │
│   ├── rag/                     # RAG Pipeline
│   │   ├── engine.py            # 5 retrieval modes
│   │   ├── advanced.py          # Advanced RAG patterns
│   │   └── storage.py           # Persistent storage
│   │
│   ├── ingestion/               # Document Processing
│   ├── retrieval/               # Semantic Search
│   ├── evals/                   # AI Quality Evaluation
│   ├── mcp/                     # Model Context Protocol
│   ├── sentiment/               # Sentiment Analysis
│   ├── sql_agent/               # Natural Language to SQL
│   ├── validator/               # Document Validation
│   ├── meeting_notes/           # Meeting Summarization
│   ├── customer_kyc/            # KYC Verification
│   ├── ebc_tickets/             # Ticket Management
│   └── voice/                   # Voice Processing
│
├── frontend/                    # React Frontend (Port 3000)
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AgentsPage.tsx
│   │   │   ├── RAGPage.tsx
│   │   │   ├── MultiAgentPage.tsx
│   │   │   ├── KYCPage.tsx
│   │   │   └── [more pages...]
│   │   └── components/          # Shared UI components
│   ├── package.json
│   └── vite.config.ts
│
├── use_cases/                   # Example Implementations
│   ├── document_qa/             # Document Q&A pattern
│   ├── customer_kyc/            # KYC verification
│   └── meeting_notes/           # Meeting notes processing
│
├── workflows/                   # YAML Workflow Definitions
│   ├── rag_pipeline.yaml
│   └── document_analysis.yaml
│
├── docs/                        # Comprehensive Documentation (9 files)
│   ├── ARCHITECTURE.md          # System architecture diagrams
│   ├── CORE_MODULES.md          # Module specifications
│   ├── QUICK_REFERENCE.md       # Developer cheat sheet
│   ├── SECURITY_GOVERNANCE.md   # Security controls
│   ├── DEVELOPMENT_CYCLE.md     # Development workflow
│   ├── USE_CASE_BLUEPRINT.md    # Building use cases
│   ├── OPERATIONAL_PLAYBOOKS.md # Operations guides
│   └── OBSERVABILITY_MONITORING.md # Monitoring setup
│
├── tests/                       # Test Suite
│   ├── test_agents.py
│   ├── test_rag.py
│   └── [more tests...]
│
└── scripts/                     # Utility Scripts
    ├── seed_data.py
    └── create_tables.py
```

**Code Statistics:**
- **113 Python files**
- **~10,641 lines** of API code
- **32 API modules**
- **11 pre-built agent templates**

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Environment
ENV=dev
LOG_LEVEL=INFO

# LLM Providers (at least one required)
OPENAI_API_KEY=sk-your-openai-key              # Required for cloud LLMs
ANTHROPIC_API_KEY=sk-ant-your-key              # Optional
COHERE_API_KEY=your-cohere-key                 # Optional

# Local Models (Optional)
OLLAMA_HOST=http://localhost:11434             # For local Llama/Mistral

# Database
DATABASE_URL=sqlite:///./data/goai.db          # Development (default)
# DATABASE_URL=postgresql://user:pass@localhost:5432/goai  # Production

# Cache
REDIS_URL=redis://localhost:6379               # Optional (uses in-memory if not set)

# Vector Store
VECTOR_DIMENSION=1536                          # OpenAI embedding dimension
VECTOR_BACKEND=faiss

# Security
SECRET_KEY=your-secret-key-here                # For JWT tokens (generate strong key)
JWT_EXPIRATION=3600                            # Token expiration in seconds

# Observability
ENABLE_TELEMETRY=true
PROMETHEUS_PORT=9090
```

### Using Local Models with Ollama

Run AI models locally without cloud API costs:

```bash
# 1. Install Ollama (Windows)
# Download from: https://ollama.com/download

# 2. Pull a model
ollama pull llama3.2         # 3B parameter model
ollama pull mistral          # 7B parameter model
ollama pull codellama        # Code-specialized model

# 3. Start Ollama
ollama serve

# 4. Update .env
OLLAMA_HOST=http://localhost:11434

# 5. Restart GoAI Platform
uvicorn main:app --reload
```

**Available Local Models:**
- `llama3.2` - General purpose (3B params)
- `mistral` - Fast and capable (7B params)
- `codellama` - Code generation (7B/13B/34B params)
- `llama2` - Predecessor to Llama 3 (7B/13B/70B params)

---

## 🚢 Deployment

### Development (Local)

```bash
# Backend
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm run dev
```

### Production with Docker Compose

```bash
# Start all services
docker-compose up -d

# Services started:
# - postgres:5432 (PostgreSQL)
# - redis:6379 (Redis)
# - goai_platform:8000 (Backend API)
# - goai_console:3000 (Frontend UI)

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production with GPU Support (vLLM)

For high-performance local model inference:

```bash
# Start vLLM with GPU
docker-compose -f docker-compose.vllm.yml up -d

# Verify GPU access
docker exec -it vllm nvidia-smi
```

### Cloud Deployment Options

**AWS:**
- **EC2** - t3.large or larger (8GB+ RAM)
- **RDS** - PostgreSQL 14+
- **ElastiCache** - Redis 7
- **S3** - Document storage
- **CloudWatch** - Monitoring

**GCP:**
- **Compute Engine** - n1-standard-2 or larger
- **Cloud SQL** - PostgreSQL
- **Memorystore** - Redis
- **Cloud Storage** - Documents

**Azure:**
- **Virtual Machines** - Standard_D2s_v3 or larger
- **Azure Database for PostgreSQL**
- **Azure Cache for Redis**
- **Blob Storage**

---

## 🔒 Security

### Built-in Security Features

- ✅ **JWT-based authentication** with refresh tokens
- ✅ **Role-based access control (RBAC)** - Admin, User, Viewer
- ✅ **Document-level ACL** - Control who can access which documents
- ✅ **Audit logging** - Every API call logged with user, timestamp, action
- ✅ **Rate limiting** - Per user/role (configurable)
- ✅ **Input validation** - Pydantic models for all requests
- ✅ **Webhook signature verification** - HMAC-SHA256
- ✅ **PII detection and redaction** - SSN, credit cards, emails
- ✅ **Prompt injection detection** - Blocks manipulation attempts
- ✅ **Content filtering** - Harmful content blocking

### Security Checklist

Before deploying to production:

- [ ] Change default `SECRET_KEY` in `.env` (use 256-bit random key)
- [ ] Set up HTTPS/TLS (use Let's Encrypt or cloud provider certificates)
- [ ] Configure firewall rules (only allow ports 80, 443, 22)
- [ ] Enable audit logging (`ENABLE_AUDIT_LOG=true`)
- [ ] Set appropriate rate limits per role
- [ ] Configure document ACLs for sensitive data
- [ ] Set up database backups (daily recommended)
- [ ] Enable Redis password authentication
- [ ] Configure CORS allowed origins (remove wildcards)
- [ ] Test disaster recovery procedures
- [ ] Review and customize guardrail rules
- [ ] Set up monitoring and alerting

### Generating Secure Keys

```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate webhook secret
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 📖 Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) | API cheat sheet, common patterns | Developers |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow diagrams | Architects |
| [CORE_MODULES.md](docs/CORE_MODULES.md) | Detailed module specifications | Developers |
| [SECURITY_GOVERNANCE.md](docs/SECURITY_GOVERNANCE.md) | Security controls, compliance | Security Team |
| [DEVELOPMENT_CYCLE.md](docs/DEVELOPMENT_CYCLE.md) | Dev workflow, contribution guide | Contributors |
| [USE_CASE_BLUEPRINT.md](docs/USE_CASE_BLUEPRINT.md) | Building custom use cases | Product/Dev |
| [OPERATIONAL_PLAYBOOKS.md](docs/OPERATIONAL_PLAYBOOKS.md) | Deployment, troubleshooting | SRE/Ops |
| [OBSERVABILITY_MONITORING.md](docs/OBSERVABILITY_MONITORING.md) | Monitoring, alerting setup | SRE/Ops |

---

## 🧪 Testing

### Run Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest tests/ -v

# Run specific module
pytest tests/test_agents.py -v

# Run with coverage
pytest tests/ --cov=modules --cov-report=html

# View coverage report
open htmlcov/index.html
```

### Test a Use Case

```bash
# Document Q&A use case
python use_cases/document_qa/test_use_case.py

# Meeting notes use case
python use_cases/meeting_notes/test_use_case.py

# Customer KYC use case
python use_cases/customer_kyc/test_use_case.py
```

---

## 🎓 Learning Path

### For Beginners

1. **Start with API Docs** - http://localhost:8000/api/docs
2. **Test Simple Tools** - calculator, date/time (no API key needed)
3. **Try RAG** - Upload a document, ask questions about it
4. **Run Agent Template** - Use pre-built "writer" or "summarizer"
5. **Explore UI** - http://localhost:3000

### For Developers

1. **Read Architecture** - [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
2. **Study Agent Engine** - [`modules/agents/engine.py`](modules/agents/engine.py)
3. **Create Custom Tool** - Add to [`modules/agents/tools.py`](modules/agents/tools.py)
4. **Build Agent Template** - Add to [`modules/agents/templates.py`](modules/agents/templates.py)
5. **Create Use Case** - Follow [`docs/USE_CASE_BLUEPRINT.md`](docs/USE_CASE_BLUEPRINT.md)

### For DevOps

1. **Set up PostgreSQL + Redis** - Production database
2. **Configure Ollama** - Local model inference
3. **Deploy with Docker** - `docker-compose up -d`
4. **Set up Monitoring** - Prometheus + Grafana
5. **Configure Backups** - Database + vector store

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** - Maintain test coverage
5. **Run tests** - `pytest tests/ -v`
6. **Commit** - `git commit -m 'Add amazing feature'`
7. **Push** - `git push origin feature/amazing-feature`
8. **Open Pull Request**

### Code Style

- **Python** - Follow PEP 8, use Black formatter
- **TypeScript/React** - Follow ESLint rules
- **Docstrings** - Required for all public functions
- **Type hints** - Required for all Python functions
- **Tests** - Required for all new features

### Areas for Contribution

- 🧰 **New Agent Tools** - Add tools to `modules/agents/tools.py`
- 🎭 **Agent Templates** - Create templates in `modules/agents/templates.py`
- 📚 **RAG Modes** - Implement new retrieval strategies
- 🔌 **Integrations** - MCP servers, external APIs
- 📖 **Documentation** - Improve guides and examples
- 🧪 **Tests** - Increase test coverage
- 🐛 **Bug Fixes** - Fix issues from GitHub Issues

---

## 📞 Support

### Getting Help

- **📖 Documentation** - Check [`docs/`](docs/) folder
- **💬 Discussions** - GitHub Discussions for questions
- **🐛 Bug Reports** - GitHub Issues
- **🔒 Security Issues** - Email security@yourcompany.com (DO NOT open public issues)

### Troubleshooting

**Server won't start:**
```bash
# Check Python version
python --version  # Should be 3.10+

# Check dependencies
pip install -r requirements.txt

# Check port availability
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Linux/Mac
```

**UI won't connect to backend:**
- Check CORS settings in [`main.py`](main.py#L55-L61)
- Verify backend is running: `curl http://localhost:8000/health`
- Check browser console for errors

**Out of memory errors:**
- Reduce batch size in RAG queries
- Reduce `VECTOR_DIMENSION` in `.env`
- Use PostgreSQL instead of SQLite for large datasets

---

## 📈 Version History

| Version | Date | Highlights |
|---------|------|------------|
| **1.5.0** | Dec 2024 | AI Guardrails (input/output/tool/PII safety) |
| **1.4.0** | Dec 2024 | Agent Templates (11), HITL Approvals, Observability Dashboard |
| **1.3.0** | Dec 2024 | Bug fixes, singleton patterns, webhook security |
| **1.2.0** | Dec 2024 | AI Evaluations, MCP Protocol, Triggers/Webhooks |
| **1.1.0** | Dec 2024 | Enhanced tools, memory system, prompt library |
| **1.0.0** | Nov 2024 | Initial sovereign release |

---

## 📜 License

**Enterprise License** - See [LICENSE](LICENSE) file for details.

For commercial licensing inquiries, contact: licensing@yourcompany.com

---

## 🙏 Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com) - Modern web framework
- [React](https://react.dev) - UI library
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [OpenAI](https://openai.com) - GPT models
- [Anthropic](https://anthropic.com) - Claude models
- [Ollama](https://ollama.com) - Local model runtime

---

<div align="center">

### 🏛️ GoAI Sovereign AI Platform v1

**Enterprise AI Under Your Complete Control**

*Built for organizations that value data sovereignty*

[⭐ Star on GitHub](https://github.com/your-org/goai-platform-v1) • [📖 Read Docs](docs/) • [🐛 Report Bug](https://github.com/your-org/goai-platform-v1/issues) • [✨ Request Feature](https://github.com/your-org/goai-platform-v1/issues)

</div>
