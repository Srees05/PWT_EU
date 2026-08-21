# PWT_EU --- Playwright Enterprise Automation Framework

PWT_EU is a portfolio-grade **Playwright JavaScript automation
framework** demonstrating scalable UI and REST API automation, reusable
framework architecture, CI/CD execution, Docker/Kubernetes
orchestration, and GenAI/Agentic-AI-assisted failure investigation.

## Architecture

``` text
UI Automation ── Page Objects / Components ──┐
API Automation ─ Services / REST Utilities ──┼─> Playwright
AI Analysis ──── Failure Agent / MCP / LLM ──┘
                                                ↓
                                              GitHub
                                                ↓
                                              Jenkins
                                                ↓
                                              Docker
                                                ↓
                                         Local Registry
                                                ↓
                                           Kubernetes
                                          /          \
                                      Smoke        Regression
                                          \          /
                                           Blob Reports
                                                ↓
                                          Merged HTML Report
```

## Technology Stack

  Area                  Technology
  --------------------- -----------------------------------
  Automation            Playwright
  Language              JavaScript / Node.js
  UI Testing            Playwright Browser/Page
  API Testing           Playwright APIRequest
  Design                Page Object Model / Service Layer
  Contract Validation   AJV / JSON Schema
  GenAI                 Ollama / Llama 3.2
  Agentic AI            Failure Investigation Agent
  AI Integration        MCP
  CI/CD                 Jenkins
  Containerization      Docker
  Orchestration         Kubernetes
  Source Control        Git / GitHub
  Reporting             Playwright Blob + HTML Reports

## Design Principle

``` text
Tests
  ↓
Business / Application Layer
  ↓
Reusable Framework Layer
  ↓
Playwright
  ↓
Application / REST API
```

Tests describe business flows; low-level implementation remains in
reusable pages, services, components, and utilities.

## UI Automation

``` text
UI E2E Test
  ↓
Page Objects
  ↓
Reusable Components
  ↓
Fixtures / Utils
  ↓
Playwright Page
  ↓
Browser / Application
```

Page Objects include `LoginPage.js`, `ProductsPage.js`, `CartPage.js`,
and `CheckoutPage.js`. Reusable components cover common controls such as
tables, dropdowns, modals, navigation, pagination, search, toast
messages, file operations, and date pickers. Custom fixtures provide
reusable Page Object instances to tests.

Tags include `@smoke`, `@regression`, and `@e2e`.

## API Automation

API automation follows the same philosophy as UI automation:

``` text
UI  → Page Objects
API → Service Objects
```

``` text
API E2E Test
  ↓
Service Layer
  ↓
Generic REST Utilities
  ↓
Playwright APIRequest
  ↓
REST API / Microservice
```

### Service Layer

``` text
services/api/
├── AuthService.js
└── BookingService.js
```

`AuthService` encapsulates authentication and token handling.
`BookingService` encapsulates create, get, update, replace, and delete
booking operations so tests do not contain raw endpoints, headers,
cookies, or HTTP plumbing.

### Generic REST Utilities

``` text
utils/api/
├── ApiClient.js
├── ApiResponse.js
├── ApiAssertions.js
├── ApiDataFactory.js
└── SchemaValidator.js
```

-   **ApiClient** --- reusable GET, POST, PUT, PATCH, DELETE and common
    request options.
-   **ApiResponse** --- normalizes status, status text, success state,
    headers, and body.
-   **ApiAssertions** --- reusable HTTP, header, field, business-value,
    and negative assertions.
-   **ApiDataFactory** --- dynamic reusable API test data.
-   **SchemaValidator** --- AJV/JSON Schema contract validation.

### Contract Validation

``` text
schemas/
└── api/
    └── BookingSchema.json
```

The API framework validates three levels:

``` text
HTTP Validation
  ↓
Contract Validation
  ↓
Business Data Validation
```

## API E2E Scenarios

### API E2E 01 --- Booking Lifecycle

``` text
Authentication
  ↓
Create Booking
  ↓
Validate / Get Booking
  ↓
Schema Validation
  ↓
PATCH Booking
  ↓
Verify Updated Data
  ↓
Delete Booking
  ↓
GET Deleted Booking
  ↓
Validate 404
```

Tags: `@api @regression`

### API E2E 02 --- Auth, PATCH and Negative Validation

``` text
Authentication
  ↓
Create Booking
  ↓
GET + Contract Validation
  ↓
PATCH with Valid Token
  ↓
Verify Update
  ↓
PATCH with Invalid Token → Validate 403
  ↓
Verify Unauthorized Change Was Not Applied
  ↓
GET Non-existing Booking → Validate 404
  ↓
Cleanup
```

The second scenario proves that the reusable API framework supports
multiple test flows.

## GenAI / Agentic AI Failure Analysis

Purpose: reduce manual failure-investigation effort by collecting
evidence and generating an initial RCA.

``` text
Playwright Failure
  ↓
Custom Fixture / afterEach
  ↓
Failure Analyzer
  ↓
Failure Investigation Agent
  ↓
MCP Client
  ↓
MCP Server
  ↓
Project Tools
  ↓
Ollama / Llama
  ↓
Grounded RCA
  ↓
Playwright Report Attachment
```

The MCP server exposes controlled tools such as `read_project_file` and
`list_project_files`. RCA output includes confirmed facts, probable root
cause, supporting evidence, suggested fix, and additional investigation.

### Controlled AI Scope

The project intentionally limits AI to investigation rather than
silently modifying test code. Autonomous design/healing can introduce
false healing, missing business context, masked defects,
non-determinism, latency, cost, security/privacy, governance, and
auditability issues.

Preferred approach:

``` text
AI investigates → AI recommends → Human reviews → Code change
```

## Docker

``` bash
docker build -t pwt-eu:latest .
docker tag pwt-eu:latest localhost:5000/pwt-eu:latest
docker push localhost:5000/pwt-eu:latest
```

## Kubernetes

``` text
Kubernetes
├── pwt-eu-smoke-job      → @smoke
└── pwt-eu-regression-job → @regression
```

Jenkins replaces runtime placeholders `__ENV__`, `__BROWSER__`, and
`__WORKERS__`.

Example:

``` text
ENV      = qa
BROWSER  = chromium
WORKERS  = 1
```

## Jenkins Pipeline

``` text
Checkout
  ↓
Verify Kubernetes
  ↓
Build Docker Image
  ↓
Push to Registry
  ↓
Cleanup Old Jobs
  ↓
Generate Runtime Kubernetes YAML
  ↓
Start Smoke + Regression Jobs
  ↓
Wait for Test Completion
  ↓
Collect Blob Reports
  ↓
Merge Reports
  ↓
Validate Job Results
  ↓
Publish / Archive
  ↓
Cleanup Kubernetes Resources
```

## Reporting

``` text
Smoke Pod      → Smoke Blob ──────┐
Regression Pod → Regression Blob ─┼→ merged-blobs
                                  ↓
                         playwright merge-reports
                                  ↓
                         Playwright HTML Report
                                  ↓
                           Jenkins Artifacts
```

Pods remain temporarily alive after Playwright finishes so Jenkins can
collect artifacts before the containers exit with the original test
result.

## Local Commands

``` bash
# All tests
npx playwright test

# Chromium
npx playwright test --project=chromium

# Smoke
npx playwright test --grep "@smoke" --project=chromium

# Regression
npx playwright test --grep "@regression" --project=chromium

# API
npx playwright test --grep "@api" --project=chromium

# Discovery
npx playwright test --grep "@api" --project=chromium --list
npx playwright test --grep "@regression" --project=chromium --list

# HTML report
npx playwright show-report reports/html-report
```

## Kubernetes Commands

``` bash
kubectl apply -f k8s-playwright-runtime.yaml
kubectl get pods
kubectl get jobs
kubectl logs -f job/pwt-eu-regression-job
kubectl logs -f job/pwt-eu-smoke-job
kubectl delete job pwt-eu-smoke-job pwt-eu-regression-job --ignore-not-found=true
```

## Key Architecture Principles

-   **Modularity** --- UI, API, AI, CI/CD, reporting, and infrastructure
    are separated.
-   **Reusability** --- Page Objects, Service Objects, components, and
    utilities prevent duplication.
-   **Maintainability** --- application-specific logic is isolated from
    generic framework behavior.
-   **Scalability** --- new pages, services, and tests can be added
    without redesigning the framework.
-   **Separation of Concerns** --- E2E tests express business flows
    rather than technical plumbing.
-   **Observability** --- screenshots, video, traces, reports, and
    AI-assisted RCA provide execution evidence.
-   **CI/CD Readiness** --- the framework runs locally, in Docker,
    Kubernetes, and Jenkins.
-   **Controlled AI Usage** --- GenAI assists investigation without
    silently changing test behavior.

## Project Status

``` text
Playwright UI Automation              ✅
Reusable Page Object Architecture     ✅
Reusable Components / Fixtures        ✅
REST API Automation                   ✅
Reusable Service / REST Layers        ✅
Dynamic API Data                      ✅
API Assertions / Schema Validation    ✅
Positive + Negative API Testing       ✅
GenAI Failure Analysis                ✅
Agentic Failure Investigation         ✅
MCP + Ollama / Local LLM              ✅
AI RCA Report Attachment              ✅
Git / GitHub                          ✅
Docker / Local Registry               ✅
Kubernetes Smoke + Regression Jobs    ✅
Blob + Merged HTML Reporting          ✅
Jenkins Pipeline                      ✅
```

Validated execution path:

``` text
Local → Docker → Kubernetes → Jenkins → PASS
```

## Project Objective

PWT_EU demonstrates how modern test automation can evolve beyond
individual scripts into a scalable automation engineering solution
combining:

**UI Automation + REST API Automation + Reusable Architecture + CI/CD +
Containers + Kubernetes + GenAI-assisted Failure Investigation.**
