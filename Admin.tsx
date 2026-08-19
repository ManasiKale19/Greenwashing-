
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { AnalysisRequest, RequestStatus, Company, AnalysisData, FinalScore } from '../types';
import { Check, X, Loader2, Play, Upload, Trash2, FileSpreadsheet, AlertTriangle, RefreshCw } from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvLoading, setCsvLoading] = useState(false);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = async () => {
    const allRequests = await db.getRequests();
    const allCompanies = await db.getCompanies();
    // Filter out approved items from requests list to keep it clean
    setRequests(allRequests.filter(r => r.status !== RequestStatus.APPROVED));
    setCompanies(allCompanies);
  };

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company and its data?')) {
      await db.deleteCompany(id);
      await refreshData(); // Wait for data to refresh before updating UI
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('WARNING: Are you sure you want to DELETE ALL COMPANIES?\n\nThis action cannot be undone.')) {
      if (window.confirm('Double check: Really delete everything?')) {
        try {
          await db.clearCompanies();
          await refreshData();
          alert('All companies have been deleted.');
        } catch (e) {
          alert('Failed to delete all companies: ' + e);
        }
      }
    }
  };

  const handleCleanupRequests = async () => {
    if (window.confirm('Remove all completed and rejected requests? Pending requests will remain.')) {
      try {
        await db.cleanupRequests();
        await refreshData();
        alert('Cleanup complete.');
      } catch (e) {
        alert('Failed to cleanup: ' + e);
      }
    }
  };

  const handleDeleteRequest = async (req: AnalysisRequest) => {
    if (!window.confirm(`Force delete request "${req.companyName}"?\n\nThis will remove it permanently without notifying the user.`)) return;
    try {
      await db.deleteRequest(req.id);
      alert("Request deleted.");
      refreshData();
    } catch (e) {
      alert("Failed to delete request: " + e);
    }
  };

  const handleProcess = async (req: AnalysisRequest) => {
    if (!window.confirm(`Approve and analyze "${req.companyName}"?\n\nThis will:\n• Extract text from PDF\n• Scrape company data\n• Run NLP/ML analysis\n• Generate report\n\nEstimated time: 2-5 minutes`)) return;

    setProcessingId(req.id);
    try {
      await db.approveRequest(req.id);
      alert(`✓ Analysis completed for ${req.companyName}!\n\nThe company now appears in the Analytics page.`);
    } catch (e) {
      console.error(e);
      alert(`✗ Analysis failed: ${e}\n\nPlease try again or reject the request.`);
    } finally {
      setProcessingId(null);
      refreshData();
    }
  };

  const handleApprove = async (req: AnalysisRequest) => {
    // Legacy - now handled by handleProcess
    console.log("Already approved via handleProcess");
  };

  const handleReject = async (req: AnalysisRequest) => {
    const reason = window.prompt(`Reject "${req.companyName}"?\n\nPlease provide a reason (will be sent to user):`);
    if (reason === null || reason.trim() === '') return;

    try {
      await db.rejectRequest(req.id, reason);
      alert(`✗ Request rejected and deleted.\n\nReason: ${reason}`);
      refreshData();
    } catch (e) {
      console.error(e);
      alert("Failed to reject request: " + e);
    }
  };

  // CSV PARSING LOGIC
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvLoading(true);
    try {
      const result = await db.uploadCSV(file);
      alert(result.message);
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to upload CSV: " + err);
    } finally {
      setCsvLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif text-forest-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={csvLoading}
              className="flex items-center px-4 py-2 bg-forest-800 text-white rounded-lg hover:bg-forest-900 transition shadow-sm"
            >
              {csvLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 mr-2" />}
              Import CSV Data
            </button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleCSVUpload}
            />
          </div>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Pending Analysis Requests</h2>
            <div className="flex space-x-3">
              <button
                onClick={handleCleanupRequests}
                className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cleanup Processed
              </button>
              <button onClick={refreshData} className="text-forest-600 hover:text-forest-800"><RefreshCw className="h-4 w-4" /></button>
            </div>
          </div>
          {requests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pending requests</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.map((req) => (
                <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{req.companyName}</h3>
                    <p className="text-sm text-gray-500">{req.documentName ? `Document: ${req.documentName}` : 'No document attached'}</p>
                    <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(req.submissionDate).toLocaleDateString()}</p>
                  </div>

                  {/* Reject Reason Display (if somehow we are showing rejected items here) */}
                  {req.status === RequestStatus.REJECTED && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                      Reason: {req.rejectionReason}
                    </div>
                  )}

                  <div className="flex space-x-3 items-center">
                    {(req.status === RequestStatus.PENDING || req.status === 'pending') && !req.analysisResult && (
                      <>
                        <button
                          onClick={() => handleProcess(req)}
                          disabled={processingId === req.id}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-bold shadow-sm"
                        >
                          {processingId === req.id ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Approve & Analyze
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          disabled={processingId === req.id}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-bold shadow-sm"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </>
                    )}

                    {req.status === RequestStatus.PENDING && req.analysisResult && (
                      <>
                        <div className="text-right mr-4 hidden md:block">
                          <div className="text-xs font-bold uppercase text-gray-500">AI Recommendation</div>
                          <div className={`font-bold ${req.analysisResult.final_company_score?.rating_out_of_100 < 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {req.analysisResult.final_company_score?.label} ({req.analysisResult.final_company_score?.rating_out_of_100})
                          </div>
                        </div>
                        <button onClick={() => handleApprove(req)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200" title="Approve & Publish">
                          <Check className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleReject(req)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200" title="Reject with Reason">
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Always visible Trash Button for Stuck Requests */}
                    <button
                      onClick={() => handleDeleteRequest(req)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition"
                      title="Force Delete Request"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Database Management Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Manage Database ({companies.length} Entries)</h2>
            <div className="flex space-x-3 items-center">
              <button
                onClick={handleDeleteAll}
                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition font-bold"
              >
                Delete All Data
              </button>
              <button onClick={refreshData} className="text-sm text-forest-600 font-bold hover:underline">Refresh</button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => {
                  const riskStr = company.analysis.risk_assessment?.overall_risk_level?.toLowerCase() || "";
                  let statusLabel = "No Risk";
                  let statusColor = "text-green-700 bg-green-50";

                  if (riskStr.includes("greenwashing") || riskStr.includes("high") || riskStr.includes("critical")) {
                    statusLabel = "Greenwashing";
                    statusColor = "text-red-700 bg-red-50";
                  } else if (riskStr.includes("at risk") || riskStr.includes("medium")) {
                    statusLabel = "At Risk";
                    statusColor = "text-orange-700 bg-orange-50";
                  }

                  return (
                    <tr key={company.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`font-bold px-3 py-1 rounded-full text-xs ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompany(company.id);
                          }}
                          className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
