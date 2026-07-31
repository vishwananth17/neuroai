<div align="center">

# ⚖️ Corporate Agent
### AI-Powered ADGM Legal Document Review using RAG + LLM

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=26&pause=1000&color=00C2FF&center=true&vCenter=true&width=700&lines=AI+Legal+Document+Analyzer;Retrieval-Augmented+Generation+(RAG);LLM-Powered+Legal+Assistant;Automated+Compliance+Review;Built+with+Python+%7C+LangChain+%7C+OpenAI" />

<p align="center">
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
<img src="https://img.shields.io/badge/LangChain-000000?style=for-the-badge"/>
<img src="https://img.shields.io/badge/FAISS-009688?style=for-the-badge"/>
<img src="https://img.shields.io/badge/RAG-AI-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/LLM-GPT-green?style=for-the-badge"/>
<img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge"/>
</p>

</div>

---

# 📖 Overview

Corporate Agent is an **AI-powered Legal Document Review System**
built specifically for **ADGM (Abu Dhabi Global Market)** legal documents.

Instead of manually checking hundreds of pages, lawyers simply upload documents.

The AI automatically

✅ Detects document type

✅ Finds missing documents

✅ Flags legal risks

✅ Reviews clauses

✅ Retrieves ADGM regulations using RAG

✅ Suggests improvements using LLM

✅ Generates reviewed DOCX + JSON report

---

# 🚀 System Workflow

```mermaid
flowchart LR

A[Upload ADGM Documents]
-->B(Document Parser)

B-->C{Document Detection}

C-->D[Checklist Validation]

D-->E[Risk Detection]

E-->F[RAG Search]

F-->G[LLM Analysis]

G-->H[Generate Suggestions]

H-->I[Reviewed DOCX]

H-->J[JSON Report]
```

---

# 🧠 RAG Architecture

```mermaid
flowchart TD

User(User Uploads Query)

User --> Parser

Parser --> Chunking

Chunking --> Embeddings

Embeddings --> VectorDB[(FAISS)]

VectorDB --> Retriever

Retriever --> Prompt

Prompt --> GPT[LLM]

GPT --> Answer

Answer --> ReviewedDocument

```

---

# ⚙️ AI Review Pipeline

```text

        📄 Upload Document
                │
                ▼
     ┌────────────────────┐
     │ Document Detection │
     └────────────────────┘
                │
                ▼
     ┌────────────────────┐
     │ Clause Extraction  │
     └────────────────────┘
                │
                ▼
     ┌────────────────────┐
     │ Missing Documents  │
     └────────────────────┘
                │
                ▼
     ┌────────────────────┐
     │ Red Flag Detector  │
     └────────────────────┘
                │
                ▼
     ┌────────────────────┐
     │  RAG Retrieval     │
     └────────────────────┘
                │
                ▼
     ┌────────────────────┐
     │ GPT Recommendations│
     └────────────────────┘
                │
                ▼
      Reviewed DOCX + JSON

```

---

# 🔥 Features

## 📑 Automated Document Analysis

- Detects ADGM legal document types
- Reviews contracts automatically
- Finds missing clauses

---

## ⚠️ Risk Detection

Flags

- Missing Signatories
- Non-ADGM References
- Missing Approvals
- Ambiguous Language
- Compliance Issues

---

## 📚 RAG Knowledge Base

Uses Retrieval-Augmented Generation to search

- ADGM Regulations
- Legal References
- Corporate Policies
- Compliance Documents

before generating answers.

---

## 🤖 LLM Assistant

Provides

- Legal Explanation
- Clause Suggestions
- Compliance Advice
- Smart Summaries

---

## 📄 Output Generation

Produces

✔ Reviewed DOCX

✔ JSON Summary

✔ Compliance Report

✔ AI Suggestions

---

# 📊 Project Architecture

```mermaid
graph TB

subgraph User

A[Lawyer]

end

subgraph Backend

B[FastAPI]

C[Document Parser]

D[Checklist Engine]

E[Risk Detector]

F[LangChain]

G[OpenAI]

H[FAISS]

end

subgraph Output

I[Reviewed DOCX]

J[JSON Report]

end

A --> B

B --> C

C --> D

D --> E

E --> F

F --> H

H --> G

G --> I

G --> J
```

---

# 📈 Review Process Animation

```text

Uploading Document...

██████████░░░░░░░░ 35%

Parsing...

████████████████░░ 72%

Searching ADGM Database...

██████████████████ 90%

Generating AI Suggestions...

██████████████████████ 100%

✓ Review Completed

```

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Python | Backend |
| FastAPI | API |
| LangChain | RAG |
| OpenAI GPT | LLM |
| FAISS | Vector Search |
| DOCX | Document Processing |
| JSON | Report Generation |
| NLP | Text Processing |

---

# 📂 Folder Structure

```text
Corporate-Agent/

│

├── app/

│ ├── parser.py

│ ├── rag.py

│ ├── llm.py

│ ├── checklist.py

│ ├── reviewer.py

│

├── vector_db/

├── prompts/

├── uploads/

├── outputs/

├── docs/

└── main.py

```

---

# 💡 Example Workflow

```text

Upload:
↓

Shareholder Agreement.docx

↓

Document Detection

↓

Checklist Validation

↓

Risk Detection

↓

RAG Search

↓

GPT Review

↓

Reviewed Agreement.docx

↓

JSON Report

```

---

# 📊 AI Decision Flow

```mermaid
sequenceDiagram

participant User

participant API

participant Parser

participant RAG

participant GPT

User->>API: Upload Document

API->>Parser: Parse DOCX

Parser->>RAG: Search ADGM Rules

RAG->>GPT: Relevant Context

GPT->>API: Suggestions

API->>User: Reviewed DOCX + JSON
```

---

# 🌟 Highlights

- AI Legal Assistant
- Retrieval-Augmented Generation
- LLM Reasoning
- Document Intelligence
- Clause Analysis
- Compliance Automation
- Legal NLP
- JSON Report Generation
- DOCX Review Engine

---

<div align="center">

## ⭐ If you like this project, don't forget to Star it!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,100:0072ff&height=120&section=footer"/>

</div>
