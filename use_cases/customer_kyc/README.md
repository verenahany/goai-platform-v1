# Customer KYC Use Case

> AI-Powered Know Your Customer Verification System

## Overview

The Customer KYC module provides automated identity verification, risk assessment, and compliance checking for customer onboarding. It leverages AI to extract information from documents, assess risk levels, and generate verification reports.

## Features

| Feature | Description |
|---------|-------------|
| 📄 **Document Verification** | Extract and validate ID documents (passport, driver's license, national ID) |
| ⚠️ **Risk Assessment** | Score customers based on risk factors (0-100 scale) |
| ✅ **Compliance Check** | Verify regulatory requirements (AML, KYC guidelines) |
| 🔍 **PEP/Sanctions Screening** | Check against watchlists (simulated in demo) |
| 📊 **Verification Reports** | Generate detailed reports with recommendations |
| 📈 **Analytics Dashboard** | Track verification statistics and trends |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Customer KYC Module                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   API Layer  │───▶│   Engine     │───▶│  Database    │  │
│  │  (FastAPI)   │    │  (Business)  │    │  (SQLite)    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                               │
│         │                   │                               │
│         ▼                   ▼                               │
│  ┌──────────────┐    ┌──────────────┐                      │
│  │   Models     │    │   Prompts    │                      │
│  │  (Pydantic)  │    │  (LLM Sys)   │                      │
│  └──────────────┘    └──────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/kyc/verify` | Perform full KYC verification |
| `GET` | `/api/v1/kyc/cases` | List all KYC cases |
| `GET` | `/api/v1/kyc/cases/{id}` | Get specific case details |
| `PUT` | `/api/v1/kyc/cases/{id}` | Update case (manual review) |
| `GET` | `/api/v1/kyc/stats` | Get verification statistics |
| `GET` | `/api/v1/kyc/document-types` | List supported document types |
| `GET` | `/api/v1/kyc/risk-levels` | List risk level definitions |

## Quick Start

### 1. Verify a Customer

```bash
curl -X POST http://localhost:8000/api/v1/kyc/verify \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "first_name": "John",
      "last_name": "Smith",
      "date_of_birth": "1985-06-15",
      "nationality": "United States",
      "email": "john@email.com"
    },
    "documents": [{
      "document_type": "passport",
      "document_number": "US123456789",
      "issuing_country": "United States",
      "expiry_date": "2030-01-14",
      "content": "PASSPORT\nUnited States of America\n..."
    }]
  }'
```

### 2. Check Statistics

```bash
curl http://localhost:8000/api/v1/kyc/stats
```

## Risk Levels

| Level | Score Range | Action Required |
|-------|-------------|-----------------|
| 🟢 **LOW** | 0-25 | Auto-approve |
| 🟡 **MEDIUM** | 26-50 | Manual review within 24h |
| 🟠 **HIGH** | 51-75 | Escalate to compliance officer |
| 🔴 **CRITICAL** | 76-100 | Immediate escalation, do not proceed |

## Risk Factors

The system evaluates:

- **High Risk (+20-30 points)**
  - PEP (Politically Exposed Person) match
  - Sanctions list match
  - High-risk country of origin
  - Inconsistent document information

- **Medium Risk (+10-15 points)**
  - Minor document discrepancies
  - Recently issued documents
  - Incomplete information

- **Low Risk (+0-5 points)**
  - Standard employment
  - Local resident
  - Complete documentation

## Compliance Checks

1. ✅ Valid government-issued ID provided
2. ✅ Document not expired
3. ✅ Name matches across documents
4. ✅ Age verification (18+)
5. ✅ Source of funds (for high-risk customers)

## Verification Statuses

| Status | Description |
|--------|-------------|
| `approved` | All checks passed, customer can be onboarded |
| `manual_review` | Minor issues need human verification |
| `escalated` | High risk, requires compliance officer review |
| `rejected` | Critical issues, cannot proceed |

## Document Types

- 🛂 **Passport** - International travel document
- 🚗 **Driver's License** - Government-issued driving permit
- 🆔 **National ID** - Government-issued identification
- 🏠 **Proof of Address** - Residential address verification
- 💡 **Utility Bill** - Recent utility statement
- 🏦 **Bank Statement** - Financial account statement

## Response Example

```json
{
  "verification_id": "kyc-abc123def456",
  "customer_id": "cust-12345678",
  "status": "approved",
  "overall_score": 92,
  "risk_assessment": {
    "risk_level": "low",
    "risk_score": 8,
    "risk_factors": [],
    "pep_match": false,
    "sanctions_match": false
  },
  "compliance_check": {
    "is_compliant": true,
    "checks_passed": [
      "Valid government-issued ID provided",
      "All documents valid and not expired",
      "Name verification completed",
      "Age verification passed (18+)"
    ],
    "checks_failed": []
  },
  "recommendation": "Approve John Smith for onboarding. All verification checks passed.",
  "summary": "KYC verification for John Smith has been completed successfully...",
  "processing_time_ms": 1234,
  "model_used": "gpt-4o-mini"
}
```

## UI Features

The KYC page in the UI console provides:

1. **New Verification Tab**
   - Customer information form
   - Document upload with content extraction
   - Real-time verification results
   - Sample data loader for testing

2. **Cases Tab**
   - List of all KYC cases
   - Filter by status and risk level
   - Case detail modal

3. **Statistics Tab**
   - Total cases count
   - Approval rate
   - Average score
   - Breakdown by status and risk level

## Integration with Core Platform

The KYC module integrates with:

| Core Module | Integration |
|-------------|-------------|
| **LLM Router** | Document analysis and risk assessment |
| **Auth Service** | User authentication and case ownership |
| **Telemetry** | Logging and metrics |
| **SQLite DB** | Persistent case storage |

## Extending the Module

### Add New Document Types

1. Edit `modules/customer_kyc/models.py`:
```python
class DocumentType(str, Enum):
    # ... existing types
    TAX_RETURN = "tax_return"
```

2. Update prompts in `modules/customer_kyc/prompts.py`

### Add Custom Risk Factors

Edit `modules/customer_kyc/engine.py`:
```python
# In _assess_risk method
if customer.occupation in HIGH_RISK_OCCUPATIONS:
    risk_score += 15
    risk_factors.append(f"High-risk occupation: {customer.occupation}")
```

### Connect Real Watchlists

Replace simulated lists in `prompts.py` with API calls:
```python
# Instead of SIMULATED_PEP_LIST
async def check_pep_list(name: str) -> bool:
    response = await httpx.get(f"{WATCHLIST_API}/pep?name={name}")
    return response.json().get("match", False)
```

## Testing

```bash
# Run all KYC tests
python -m pytest tests/test_kyc.py -v

# Test verification endpoint
curl -X POST http://localhost:8000/api/v1/kyc/verify \
  -H "Content-Type: application/json" \
  -d @test_data/sample_kyc_request.json
```

## Compliance Notes

- All KYC data is stored with full audit trail
- Data retention: 7 years (configurable)
- PII is handled according to GDPR guidelines
- All verification decisions are logged

## Files

```
use_cases/customer_kyc/
├── intent.yaml          # Business intent and scope
├── workflow.yaml        # Orchestration workflow
├── README.md            # This documentation

modules/customer_kyc/
├── __init__.py          # Module exports
├── models.py            # Pydantic models
├── prompts.py           # LLM system prompts
├── engine.py            # Business logic

api/v1/customer_kyc.py   # API endpoints

frontend/src/pages/KYCPage.tsx    # UI component
```

---

**Version:** 1.0.0  
**Author:** GoAI Platform Team  
**Last Updated:** November 2025

