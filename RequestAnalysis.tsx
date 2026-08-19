
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { AnalysisRequest, RequestStatus } from '../types';
import { Upload, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export const RequestAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const user = db.getCurrentUser();
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        description: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [myRequests, setMyRequests] = useState<AnalysisRequest[]>([]);

    useEffect(() => {
        if (user) {
            db.getUserRequests(user.id).then(setMyRequests);
        }
    }, [user, submitted]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to submit a request.");
            navigate('/login');
            return;
        }

        if (!file) {
            alert("Please attach a PDF document for analysis.");
            return;
        }

        try {
            await db.uploadFileForAnalysis(formData.name, file);
            setSubmitted(true);
            // Reset form for next entry but keep view
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', website: '', description: '' });
                setFile(null);
            }, 2000);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit analysis request. Please try again.");
        }
    };

    const StatusBadge = ({ status, reason }: { status: RequestStatus, reason?: string }) => {
        if (status === RequestStatus.APPROVED) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" /> Approved
                </span>
            );
        }
        if (status === RequestStatus.REJECTED) {
            return (
                <div className="flex flex-col items-start">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" /> Rejected
                    </span>
                    {reason && <span className="text-xs text-red-600 mt-1 max-w-[200px] leading-tight">Reason: {reason}</span>}
                </div>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" /> Pending Review
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-forest-50 py-16 px-4 pt-32">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Form Section */}
                <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-forest-100 h-fit">
                    {submitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="h-16 w-16 text-forest-600 mx-auto mb-6" />
                            <h2 className="text-3xl font-serif text-forest-900 mb-4">Request Submitted</h2>
                            <p className="text-gray-600 mb-8">
                                Thank you for contributing. Check your status in the dashboard panel.
                            </p>
                            <button
                                onClick={() => navigate('/analytics')}
                                className="px-6 py-3 bg-forest-700 text-white rounded-full hover:bg-forest-800 transition shadow-lg"
                            >
                                Go to Analytics
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl font-serif text-forest-900 mb-2">Request Analysis</h1>
                            <p className="text-gray-600 mb-8">Submit a company for AI-powered evaluation.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none bg-white"
                                        placeholder="e.g. Acme Corp"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none bg-white"
                                        placeholder="https://..."
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Description / Claims</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none bg-white"
                                        placeholder="Paste specific sustainability claims or a general description here..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents (PDF)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-forest-500 transition cursor-pointer relative bg-forest-50/50">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">
                                            {file ? file.name : "Click to upload annual reports or ESG docs"}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-forest-800 text-white font-bold rounded-lg hover:bg-forest-900 transition shadow-lg"
                                    >
                                        Submit for Review
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Status Window */}
                <div className="bg-white rounded-xl shadow-sm border border-forest-100 overflow-hidden h-fit">
                    <div className="p-6 bg-forest-50 border-b border-forest-100">
                        <h2 className="text-xl font-serif text-forest-900 flex items-center">
                            <Clock className="h-5 w-5 mr-2" /> My Request History
                        </h2>
                    </div>

                    {myRequests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            You haven't submitted any requests yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {myRequests.map((req) => (
                                <div key={req.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{req.companyName}</h3>
                                        <span className="text-xs text-gray-400">{new Date(req.submissionDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-500">Document: {req.documentName || "N/A"}</span>
                                        <StatusBadge status={req.status} reason={req.rejectionReason} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
