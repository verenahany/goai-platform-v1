import { useState, useEffect, useRef } from 'react';
import {
  UserCheck, FileText, AlertTriangle, CheckCircle,
  XCircle, Clock, Shield, Plus, Eye, RefreshCw, Scan
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface DocumentInput {
  document_type: string;
  document_number: string;
  issuing_country: string;
  issue_date: string;
  expiry_date: string;
  content: string;
}

interface CustomerInput {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  source_of_funds: string;
}

interface KYCCase {
  id: string;
  customer_id: string;
  status: string;
  risk_level: string;
  overall_score: number;
  created_at: string;
  request_data: {
    customer: CustomerInput;
  };
  response_data: {
    summary: string;
    recommendation: string;
    risk_assessment: {
      risk_factors: string[];
    };
  };
}

const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport', icon: '🛂' },
  { value: 'drivers_license', label: "Driver's License", icon: '🚗' },
  { value: 'national_id', label: 'National ID', icon: '🆔' },
  { value: 'proof_of_address', label: 'Proof of Address', icon: '🏠' },
  { value: 'utility_bill', label: 'Utility Bill', icon: '💡' },
  { value: 'bank_statement', label: 'Bank Statement', icon: '🏦' },
];

export default function KYCPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'verify' | 'cases' | 'stats'>('verify');
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<KYCCase[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCase, setSelectedCase] = useState<KYCCase | null>(null);
  const [result, setResult] = useState<any>(null);

  const [customer, setCustomer] = useState<CustomerInput>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    source_of_funds: '',
  });

  const [documents, setDocuments] = useState<DocumentInput[]>([{
    document_type: 'passport',
    document_number: '',
    issuing_country: '',
    issue_date: '',
    expiry_date: '',
    content: '',
  }]);

  const [ocrLoading, setOcrLoading] = useState<number | null>(null);
  const [ocrProviders, setOcrProviders] = useState<string[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/ocr/providers')
      .then(res => res.json())
      .then(data => setOcrProviders(data.available_providers || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'cases') loadCases();
    if (activeTab === 'stats') loadStats();
  }, [activeTab]);

  const loadCases = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/kyc/cases');
      const data = await res.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Failed to load cases:', error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/kyc/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleVerify = async () => {
    if (!customer.first_name || !customer.last_name) {
      showToast('Please enter customer name', 'error');
      return;
    }

    if (!documents[0].content) {
      showToast('Please provide document content', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/kyc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          documents,
          verification_type: 'standard',
          model: 'gpt-4o-mini'
        })
      });

      if (!res.ok) throw new Error('Verification failed');

      const data = await res.json();
      setResult(data);
      showToast('KYC verification completed', 'success');

    } catch (error) {
      showToast('Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addDocument = () => {
    setDocuments([...documents, {
      document_type: 'proof_of_address',
      document_number: '',
      issuing_country: '',
      issue_date: '',
      expiry_date: '',
      content: '',
    }]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const updateDocument = (index: number, field: string, value: string) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('File too large. Max 20MB.', 'error');
      return;
    }

    setOcrLoading(index);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documents[index].document_type);
      formData.append('extract_structured', 'true');

      const res = await fetch('http://localhost:8000/api/v1/ocr/extract/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'OCR extraction failed');
      }

      const data = await res.json();
      updateDocument(index, 'content', data.text);

      if (data.structured_data) {
        const sd = data.structured_data;
        if (sd.passport_number || sd.license_number || sd.id_number) {
          updateDocument(index, 'document_number', sd.passport_number || sd.license_number || sd.id_number || '');
        }
        if (sd.issuing_country || sd.issuing_state) {
          updateDocument(index, 'issuing_country', sd.issuing_country || sd.issuing_state || '');
        }
        if (sd.date_of_issue || sd.issue_date) {
          updateDocument(index, 'issue_date', sd.date_of_issue || sd.issue_date || '');
        }
        if (sd.date_of_expiry || sd.expiry_date) {
          updateDocument(index, 'expiry_date', sd.date_of_expiry || sd.expiry_date || '');
        }
      }

      showToast(`Text extracted successfully (${data.processing_time_ms}ms)`, 'success');

    } catch (error: any) {
      showToast(error.message || 'OCR extraction failed', 'error');
    } finally {
      setOcrLoading(null);
    }
  };

  const loadSampleData = () => {
    setCustomer({
      first_name: 'John',
      last_name: 'Smith',
      date_of_birth: '1985-06-15',
      nationality: 'United States',
      email: 'john.smith@email.com',
      phone: '+1-555-123-4567',
      address: '123 Main Street, New York, NY 10001',
      occupation: 'Software Engineer',
      source_of_funds: 'Employment Income',
    });
    setDocuments([{
      document_type: 'passport',
      document_number: 'US123456789',
      issuing_country: 'United States',
      issue_date: '2020-01-15',
      expiry_date: '2030-01-14',
      content: `PASSPORT
United States of America

Surname: SMITH
Given Names: JOHN
Nationality: AMERICAN
Date of Birth: 15 JUN 1985
Sex: M
Place of Birth: NEW YORK
Date of Issue: 15 JAN 2020
Date of Expiry: 14 JAN 2030
Passport No: US123456789`,
    }]);
    showToast('Sample data loaded', 'success');
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: 'var(--accent-tertiary)' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: 'var(--accent-warning)' };
      case 'high': return { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)', text: '#fb923c' };
      case 'critical': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: 'var(--accent-danger)' };
      default: return { bg: 'var(--bg-tertiary)', border: 'var(--border-color)', text: 'var(--text-secondary)' };
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-tertiary)' };
      case 'rejected': return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--accent-danger)' };
      case 'manual_review': return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--accent-warning)' };
      case 'escalated': return { bg: 'rgba(251, 146, 60, 0.1)', text: '#fb923c' };
      default: return { bg: 'var(--bg-tertiary)', text: 'var(--text-muted)' };
    }
  };

  return (
    <>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">
              <UserCheck size={22} style={{ color: 'var(--accent-secondary)' }} />
              Customer KYC
            </h1>
            <p className="page-subtitle">Know Your Customer - AI-Powered Verification</p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'verify', label: 'New Verification', icon: Plus },
              { id: 'cases', label: 'Cases', icon: FileText },
              { id: 'stats', label: 'Statistics', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '13px' }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="page-content">
        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="grid-2" style={{ gap: 24 }}>
            {/* Left: Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Customer Info Card */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <UserCheck size={18} style={{ marginRight: 8, color: 'var(--accent-secondary)' }} />
                    Customer Information
                  </h2>
                  <button onClick={loadSampleData} className="btn btn-secondary btn-sm">
                    Load Sample
                  </button>
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={customer.first_name}
                    onChange={e => setCustomer({...customer, first_name: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Last Name *"
                    value={customer.last_name}
                    onChange={e => setCustomer({...customer, last_name: e.target.value})}
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={customer.date_of_birth}
                    onChange={e => setCustomer({...customer, date_of_birth: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Nationality"
                    value={customer.nationality}
                    onChange={e => setCustomer({...customer, nationality: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={customer.email}
                    onChange={e => setCustomer({...customer, email: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={customer.phone}
                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={customer.address}
                    onChange={e => setCustomer({...customer, address: e.target.value})}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <input
                    type="text"
                    placeholder="Occupation"
                    value={customer.occupation}
                    onChange={e => setCustomer({...customer, occupation: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Source of Funds"
                    value={customer.source_of_funds}
                    onChange={e => setCustomer({...customer, source_of_funds: e.target.value})}
                  />
                </div>
              </div>

              {/* Documents */}
              {documents.map((doc, index) => (
                <div key={index} className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <FileText size={18} style={{ marginRight: 8, color: 'var(--accent-primary)' }} />
                      Document {index + 1}
                    </h2>
                    {documents.length > 1 && (
                      <button
                        onClick={() => removeDocument(index)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-danger)' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <select
                      value={doc.document_type}
                      onChange={e => updateDocument(index, 'document_type', e.target.value)}
                      className="document-type-select"
                    >
                      {DOCUMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>

                    <div className="grid-2" style={{ gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Document Number"
                        value={doc.document_number}
                        onChange={e => updateDocument(index, 'document_number', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Issuing Country"
                        value={doc.issuing_country}
                        onChange={e => updateDocument(index, 'issuing_country', e.target.value)}
                      />
                      <input
                        type="date"
                        placeholder="Issue Date"
                        value={doc.issue_date}
                        onChange={e => updateDocument(index, 'issue_date', e.target.value)}
                      />
                      <input
                        type="date"
                        placeholder="Expiry Date"
                        value={doc.expiry_date}
                        onChange={e => updateDocument(index, 'expiry_date', e.target.value)}
                      />
                    </div>

                    {/* OCR Upload */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 16,
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px dashed var(--border-color)'
                    }}>
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[index] = el}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                          e.target.value = '';
                        }}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        disabled={ocrLoading === index}
                        className="btn btn-primary"
                        style={{ flexShrink: 0 }}
                      >
                        {ocrLoading === index ? (
                          <>
                            <RefreshCw size={14} className="spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Scan size={14} />
                            Upload & OCR
                          </>
                        )}
                      </button>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Upload ID photo for automatic text extraction
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Supports: JPEG, PNG, WebP • Max 20MB
                          {ocrProviders.length > 0 && (
                            <span style={{ marginLeft: 8, color: 'var(--accent-tertiary)' }}>
                              • OCR: {ocrProviders.includes('gpt4_vision') ? 'GPT-4V' : ocrProviders[0]}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <textarea
                      placeholder="Document content will appear here after OCR, or paste text manually *"
                      value={doc.content}
                      onChange={e => updateDocument(index, 'content', e.target.value)}
                      rows={6}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
                    />
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={addDocument} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Plus size={16} />
                  Add Document
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      Run KYC Verification
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Results */}
            <div>
              {result ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Status Card */}
                  <div className="card" style={{
                    background: getStatusColor(result.status).bg,
                    border: `1px solid ${getStatusColor(result.status).text}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      {result.status === 'approved' ? (
                        <CheckCircle size={48} style={{ color: 'var(--accent-tertiary)' }} />
                      ) : result.status === 'rejected' ? (
                        <XCircle size={48} style={{ color: 'var(--accent-danger)' }} />
                      ) : result.status === 'escalated' ? (
                        <AlertTriangle size={48} style={{ color: '#fb923c' }} />
                      ) : (
                        <Clock size={48} style={{ color: 'var(--accent-warning)' }} />
                      )}
                      <div>
                        <p style={{ fontSize: 28, fontWeight: 800, textTransform: 'capitalize', marginBottom: 4 }}>
                          {result.status.replace('_', ' ')}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          ID: {result.verification_id}
                        </p>
                      </div>
                    </div>

                    <div className="grid-3" style={{ gap: 12 }}>
                      <div className="stat-card" style={{ padding: 16 }}>
                        <p className="stat-value" style={{ fontSize: 32 }}>{result.overall_score}</p>
                        <p className="stat-label">Overall Score</p>
                      </div>
                      <div className="stat-card" style={{ padding: 16 }}>
                        <span className="tag" style={{
                          background: getRiskColor(result.risk_assessment.risk_level).bg,
                          color: getRiskColor(result.risk_assessment.risk_level).text,
                          border: `1px solid ${getRiskColor(result.risk_assessment.risk_level).border}`,
                          fontSize: 11,
                          fontWeight: 700
                        }}>
                          {result.risk_assessment.risk_level.toUpperCase()}
                        </span>
                        <p className="stat-label" style={{ marginTop: 8 }}>Risk Level</p>
                      </div>
                      <div className="stat-card" style={{ padding: 16 }}>
                        <p className="stat-value" style={{ fontSize: 24 }}>{result.processing_time_ms}ms</p>
                        <p className="stat-label">Time</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="card">
                    <h3 className="card-title" style={{ marginBottom: 12 }}>📋 Recommendation</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{result.recommendation}</p>
                  </div>

                  {/* Summary */}
                  <div className="card">
                    <h3 className="card-title" style={{ marginBottom: 12 }}>📝 Verification Summary</h3>
                    <div style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontSize: 13 }}>
                      {result.summary}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {result.risk_assessment.risk_factors.length > 0 && (
                    <div className="card">
                      <h3 className="card-title" style={{ marginBottom: 12 }}>⚠️ Risk Factors</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {result.risk_assessment.risk_factors.map((factor: string, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <AlertTriangle size={16} style={{ color: 'var(--accent-warning)' }} />
                            <span style={{ color: 'var(--text-secondary)' }}>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Actions */}
                  {result.required_actions?.length > 0 && (
                    <div className="card">
                      <h3 className="card-title" style={{ marginBottom: 12 }}>📌 Required Actions</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {result.required_actions.map((action: string, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'rgba(139, 92, 246, 0.2)',
                              color: 'var(--accent-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              fontWeight: 700
                            }}>
                              {i + 1}
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card" style={{
                  height: 'calc(100vh - 300px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Shield size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <p style={{ fontSize: 15, marginBottom: 8 }}>Enter customer details and run verification</p>
                    <p style={{ fontSize: 12 }}>Results will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">KYC Cases</h2>
              <button onClick={loadCases} className="btn btn-secondary btn-sm">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            {cases.length === 0 ? (
              <div style={{
                padding: 60,
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <FileText size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <p style={{ marginBottom: 8 }}>No KYC cases yet</p>
                <p style={{ fontSize: 13 }}>Run a verification to create your first case</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</th>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk</th>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</th>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map(c => (
                      <tr key={c.id} style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: 12 }}>
                          <p style={{ fontWeight: 600, marginBottom: 4 }}>
                            {c.request_data.customer.first_name} {c.request_data.customer.last_name}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.id}</p>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span className="tag" style={{
                            background: getStatusColor(c.status).bg,
                            color: getStatusColor(c.status).text
                          }}>
                            {c.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span className="tag" style={{
                            background: getRiskColor(c.risk_level).bg,
                            color: getRiskColor(c.risk_level).text,
                            border: `1px solid ${getRiskColor(c.risk_level).border}`
                          }}>
                            {c.risk_level.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{c.overall_score}</span>
                        </td>
                        <td style={{ padding: 12, color: 'var(--text-secondary)', fontSize: 13 }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: 12 }}>
                          <button
                            onClick={() => setSelectedCase(c)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--accent-secondary)',
                              cursor: 'pointer',
                              padding: 6
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="grid-4">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <FileText size={20} />
                </div>
                <div className="stat-value">{stats.total_cases}</div>
                <div className="stat-label">Total Cases</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <CheckCircle size={20} />
                </div>
                <div className="stat-value">{stats.approval_rate}%</div>
                <div className="stat-label">Approval Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <Shield size={20} />
                </div>
                <div className="stat-value">{stats.average_score}</div>
                <div className="stat-label">Avg Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <Clock size={20} />
                </div>
                <div className="stat-value">{stats.by_status?.manual_review || 0}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>

            <div className="grid-2">
              {/* Status Breakdown */}
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 16 }}>By Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(stats.by_status || {}).map(([status, count]) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="tag" style={{
                        background: getStatusColor(status).bg,
                        color: getStatusColor(status).text
                      }}>
                        {status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Breakdown */}
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 16 }}>By Risk Level</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(stats.by_risk_level || {}).map(([risk, count]) => (
                    <div key={risk} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="tag" style={{
                        background: getRiskColor(risk).bg,
                        color: getRiskColor(risk).text,
                        border: `1px solid ${getRiskColor(risk).border}`
                      }}>
                        {risk.toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 24
        }}
        onClick={() => setSelectedCase(null)}
        >
          <div className="card" style={{
            maxWidth: 700,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Case Details</h3>
              <button
                onClick={() => setSelectedCase(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 20
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="grid-2" style={{ gap: 16 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Customer</p>
                  <p style={{ fontWeight: 600 }}>
                    {selectedCase.request_data.customer.first_name} {selectedCase.request_data.customer.last_name}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Status</p>
                  <span className="tag" style={{
                    background: getStatusColor(selectedCase.status).bg,
                    color: getStatusColor(selectedCase.status).text
                  }}>
                    {selectedCase.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Risk Level</p>
                  <span className="tag" style={{
                    background: getRiskColor(selectedCase.risk_level).bg,
                    color: getRiskColor(selectedCase.risk_level).text,
                    border: `1px solid ${getRiskColor(selectedCase.risk_level).border}`
                  }}>
                    {selectedCase.risk_level.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Score</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{selectedCase.overall_score}/100</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Summary</p>
                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedCase.response_data.summary}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Recommendation</p>
                <p style={{ color: 'var(--text-primary)' }}>{selectedCase.response_data.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
