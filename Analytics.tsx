
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, AlertTriangle, ArrowUpRight, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../services/db';
import { Company } from '../types';

export const Analytics: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadData = async () => {
      const data = await db.getCompanies();
      setCompanies(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter Logic
  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <Loader2 className="h-10 w-10 text-forest-600 animate-spin" />
      </div>
    );
  }

  // Helpers
  // We now rely strictly on greenwashingLabel: 1 = Greenwashing, 0 = No Greenwashing
  const isGreenwashing = (c: Company) => c.analysis.greenwashingLabel === 1;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 text-lg">Autonomous AI Research & Greenwashing Detection.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link to="/request" className="px-6 py-3 bg-forest-900 text-white rounded-lg font-bold hover:bg-forest-800 transition shadow-lg shadow-forest-100">
              + New Analysis Request
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">Total Evaluated</h3>
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-gray-900">{companies.length}</span>
            </div>
          </div>

          {/* No Risk */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">No Risk</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-green-700">
                {companies.filter(c => {
                  const r = c.analysis.risk_assessment?.overall_risk_level?.toLowerCase() || "";
                  return !r.includes('greenwashing') && !r.includes('at risk') && !r.includes('high') && !r.includes('medium');
                }).length}
              </span>
            </div>
          </div>

          {/* At Risk */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">At Risk</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-orange-700">
                {companies.filter(c => {
                  const r = c.analysis.risk_assessment?.overall_risk_level?.toLowerCase() || "";
                  return r.includes('at risk') || r.includes('medium');
                }).length}
              </span>
            </div>
          </div>

          {/* Greenwashing */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">Greenwashing</h3>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <span className="text-4xl font-extrabold text-red-700">
              {companies.filter(c => {
                const r = c.analysis.risk_assessment?.overall_risk_level?.toLowerCase() || "";
                // Strict check: Only Greenwashing/High/Critical. 
                // Explicitly exclude At Risk/Medium to prevent overlap if shared keys exist.
                return (r.includes('greenwashing') || r.includes('high') || r.includes('critical')) && !r.includes('at risk');
              }).length}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 mb-8">
          <div className="flex-1 flex items-center px-4">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search companies by name..."
              className="flex-1 border-none focus:ring-0 text-gray-700 placeholder-gray-400 outline-none h-12 bg-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
            />
          </div>
          <button className="px-6 py-2 bg-white text-gray-600 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        {/* List */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No companies found matching your search.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentItems.map(company => {
                const riskLevel = company.analysis.risk_assessment?.overall_risk_level?.toLowerCase() || "";

                let labelText = "No Risk";
                let labelColor = "text-green-700 bg-green-50 border-green-100";

                // STRICT logic: Greenwashing (Red) vs At Risk (Orange) vs No Risk (Green)
                if (riskLevel.includes('greenwashing') || riskLevel.includes('high') || riskLevel.includes('critical')) {
                  labelText = "Greenwashing";
                  labelColor = "text-red-700 bg-red-50 border-red-100";
                } else if (riskLevel.includes('at risk') || riskLevel.includes('medium')) {
                  labelText = "At Risk";
                  labelColor = "text-orange-700 bg-orange-50 border-orange-100";
                }

                return (
                  <Link key={company.id} to={`/company/${company.id}`} className="group flex flex-col bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-forest-200 transition duration-300 overflow-hidden">
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-forest-700 transition-colors">
                          {company.name}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border text-center ${labelColor}`}>
                          {labelText}
                        </div>
                      </div>

                      <div className="mb-6 space-y-2">
                        {(company.analysis as any).detailed_scores && (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Green Keyword Freq</span>
                              <span className="font-bold text-green-700">{(company.analysis as any).detailed_scores.green_keyword_frequency}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Vague Ratio</span>
                              <span className="font-bold text-orange-700">{(company.analysis as any).detailed_scores.vague_keyword_ratio}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Concrete Ratio</span>
                              <span className="font-bold text-blue-700">{(company.analysis as any).detailed_scores.concrete_claim_ratio}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                          <span className="text-gray-500">Risk Level</span>
                          <span className={`font-bold ${labelText === 'Greenwashing' ? 'text-red-600' : (labelText === 'At Risk' ? 'text-orange-600' : 'text-gray-700')}`}>
                            {company.analysis.risk_assessment?.overall_risk_level || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed border-t border-gray-100 pt-4">
                        {company.analysis.external_summary?.recent_news_summary || company.description}
                      </p>

                      <div className="pt-4 border-t border-gray-100 flex items-center text-forest-700 font-bold text-sm group-hover:text-forest-900">
                        View Full Analysis <ArrowUpRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border border-gray-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
