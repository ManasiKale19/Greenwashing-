
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Company } from '../types';
import { ArrowLeft, TrendingUp, ShieldAlert, FileText, CheckCircle, Users, AlertTriangle, Loader2, BarChart2 } from 'lucide-react';
import {
   PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis,
   Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export const CompanyDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const [company, setCompany] = useState<Company | undefined>(undefined);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const loadCompany = async () => {
         const data = await db.getCompany(id || '');
         setCompany(data);
         setLoading(false);
      };
      loadCompany();
   }, [id]);

   if (loading) {
      return <div className="min-h-screen pt-24 flex items-center justify-center"><Loader2 className="animate-spin text-forest-600 h-10 w-10" /></div>;
   }

   if (!company) {
      return <div className="min-h-screen pt-24 p-12 text-center text-gray-500">Company not found or deleted.</div>;
   }

   const analysis = company.analysis;

   if (!analysis) {
      return (
         <div className="min-h-screen pt-24 p-12 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Data Error</h2>
            <p className="text-gray-500">Analysis data is missing for this company.</p>
            <Link to="/analytics" className="text-forest-600 hover:underline mt-4 block">Back to Analytics</Link>
         </div>
      );
   }

   // Determine label. Priority: greenwashingLabel (Binary Truth) -> risk_assessment (Nuance)
   let riskLevel = analysis.risk_assessment?.overall_risk_level || "Low";

   // Sync with Analytics page logic: If label is 1, it MUST be at least High/Medium
   if (analysis.greenwashingLabel === 1 && !riskLevel.toLowerCase().includes("high") && !riskLevel.toLowerCase().includes("medium")) {
      riskLevel = "High";
   }

   const isGw = analysis.greenwashingLabel === 1;

   // Check if we have actual scraped data to show. 
   // CSV imports usually have 0 links and 0 reviews.
   const hasScrapedData = (analysis.external_summary?.evidence_links?.length || 0) > 0 || (analysis.reviews_analysis?.review_sources?.length || 0) > 0;

   let verdict = "";
   let headerColor = "";

   const r = riskLevel.toLowerCase();

   if (r.includes("greenwashing") || r.includes("high") || r.includes("critical")) {
      verdict = "Greenwashing";
      headerColor = "bg-red-900";
   } else if (r.includes("at risk") || r.includes("medium")) {
      verdict = "At Risk";
      headerColor = "bg-orange-700";
   } else {
      verdict = "No Risk";
      headerColor = "bg-green-900";
   }

   return (
      <div className="min-h-screen bg-forest-50 pt-24 pb-24 font-sans">
         {/* Header */}
         <div className={`${headerColor} text-white py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto">
               <Link to="/analytics" className="inline-flex items-center text-white/70 hover:text-white mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Analytics
               </Link>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                     <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{company.name}</h1>
                     {/* Gemini Generated Description */}
                     {(analysis as any).company_description && (
                        <p className="text-white/90 text-sm md:text-base max-w-2xl leading-relaxed mb-4 italic font-serif">
                           "{(analysis as any).company_description}"
                        </p>
                     )}
                     <div className="flex items-center space-x-4 text-white/80 text-sm">
                        <span>Confidence: {analysis.confidence_score}</span>
                        <span>•</span>
                        <span>Updated: {analysis.last_updated ? new Date(analysis.last_updated).toLocaleDateString() : 'N/A'}</span>
                     </div>
                  </div>
                  <div className="mt-6 md:mt-0 text-right">
                     <div className="text-3xl font-extrabold mb-1 tracking-tight uppercase">{verdict}</div>
                     <div className="text-sm font-medium opacity-80">Final Verdict</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

               {/* LEFT COLUMN: Main Analysis */}
               <div className="lg:col-span-2 space-y-8">

                  {/* Simplified View for Imported Data (Hide empty scraped sections) */}
                  {hasScrapedData && (
                     <>
                        {/* External Summary - Only show for scraped companies */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-forest-100">
                           <h2 className="text-xl font-serif text-forest-900 mb-6 flex items-center">
                              <TrendingUp className="h-5 w-5 mr-2 text-forest-600" />
                              External Data and News Scraping
                           </h2>
                           <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-forest-500">
                                 <h4 className="font-bold text-gray-900 text-sm mb-1">Public Sentiment</h4>
                                 <p className="text-gray-700">{analysis.external_summary?.public_sentiment || "N/A"}</p>
                              </div>
                              <p className="text-gray-600 leading-relaxed italic">"{analysis.external_summary?.recent_news_summary}"</p>

                              <div className="mt-4">
                                 <h4 className="font-bold text-gray-900 text-sm mb-2">Key Highlights</h4>
                                 <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                                    {analysis.external_summary?.key_highlights?.map((h, i) => (
                                       <li key={i}>{h}</li>
                                    )) || <li>No highlights available.</li>}
                                 </ul>
                              </div>
                              {analysis.external_summary?.possible_bias && (
                                 <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded mt-2">
                                    <strong>Bias Detected:</strong> {analysis.external_summary.possible_bias}
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* SHAP-Style Score Analysis */}
                        {(analysis as any).detailed_scores?.feature_contributions && (
                           <div className="bg-white p-8 rounded-lg shadow-sm border border-forest-100">
                              <h2 className="text-xl font-serif text-forest-900 mb-6 flex items-center">
                                 <BarChart2 className="h-5 w-5 mr-2 text-forest-600" />
                                 Data Contribution
                              </h2>
                              <p className="text-gray-500 text-sm mb-6">
                                 See exactly how the final score was calculated based on positive and negative factors.
                                 <span className="block text-xs mt-1 text-gray-400">Base Neutral Score: 50 points</span>
                              </p>

                              <div className="space-y-4">
                                 {[
                                    { label: "Internal Sentiment", value: (analysis as any).detailed_scores.feature_contributions.internal_sentiment_impact, desc: "Impact of company's own claims" },
                                    { label: "External News", value: (analysis as any).detailed_scores.feature_contributions.external_news_impact, desc: "Impact of news sentiment" },
                                    { label: "Public Reviews", value: (analysis as any).detailed_scores.feature_contributions.reviews_impact, desc: "Impact of employee/customer reviews" },
                                    { label: "Concrete Data Bonus", value: (analysis as any).detailed_scores.feature_contributions.concrete_data_bonus, desc: "Bonus for verifiable metrics" },
                                    { label: "Vague Language Penalty", value: (analysis as any).detailed_scores.feature_contributions.vague_language_penalty, desc: "Penalty for non-specific claims" },
                                    { label: "Contradiction Penalty", value: (analysis as any).detailed_scores.feature_contributions.contradiction_penalty, desc: "Penalty for contradicting evidence" },
                                 ].map((item, i) => (
                                    <div key={i} className="flex items-center text-sm">
                                       <div className="w-1/3 pr-4">
                                          <div className="font-medium text-gray-900">{item.label}</div>
                                          <div className="text-xs text-gray-500">{item.desc}</div>
                                       </div>
                                       <div className="w-2/3 flex items-center">
                                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                             {/* Negative bar (right aligned in left half? No, let's just do simple bars) */}
                                             {/* Simple visualization: 0 is center? No, let's just show bar width based on absolute value and color by sign */}
                                             <div
                                                className={`h-full ${item.value >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(Math.abs(item.value) * 2, 100)}%` }} // Scale factor for visibility
                                             ></div>
                                          </div>
                                          <div className={`w-12 text-right font-bold ${item.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                             {item.value > 0 ? '+' : ''}{item.value}
                                          </div>
                                       </div>
                                    </div>
                                 ))}

                                 <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Calculated Score</span>
                                    <span className="text-xl font-extrabold text-forest-700">{(analysis as any).detailed_scores.feature_contributions.total_calculated_score}/100</span>
                                 </div>
                              </div>
                           </div>
                        )}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-forest-100">
                           <h2 className="text-2xl font-serif text-forest-900 mb-6 flex items-center">
                              <FileText className="h-6 w-6 mr-2 text-forest-600" />
                              Full Analysis Report
                           </h2>

                           {/* Verdict Explanation */}
                           <div className={`p-6 rounded-lg mb-6 ${isGw ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
                              <h3 className="text-lg font-bold mb-3 flex items-center">
                                 {isGw ? <AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> : <CheckCircle className="h-5 w-5 mr-2 text-green-600" />}
                                 {isGw ? "⚠️ Why This Company is Flagged as Greenwashing" : "✓ Why This Company is NOT Flagged as Greenwashing"}
                              </h3>
                              <p className="text-gray-700 leading-relaxed mb-4">
                                 {isGw
                                    ? `Based on comprehensive analysis of ${(analysis as any).external_summary?.evidence_links?.length || 0} news articles and ${(analysis as any).reviews_analysis?.total_reviews_analyzed || 0} reviews, we detected significant contradictions between the company's environmental claims and external evidence. The analysis revealed ${(analysis as any).contradictions_detected?.length || 0} major contradictions and ${(analysis as any).hidden_patterns?.length || 0} suspicious patterns.`
                                    : `After analyzing ${(analysis as any).external_summary?.evidence_links?.length || 0} news articles and ${(analysis as any).reviews_analysis?.total_reviews_analyzed || 0} reviews from multiple independent sources, we found the company's environmental claims to be substantiated by external evidence. No major contradictions were detected between internal documents and public reporting.`
                                 }
                              </p>

                              {/* Contradictions Detected */}
                              {(analysis as any).contradictions_detected && (analysis as any).contradictions_detected.length > 0 && (
                                 <div className="mt-4">
                                    <h4 className="font-bold text-red-800 mb-2">🚨 Contradictions Found:</h4>
                                    <div className="space-y-3">
                                       {(analysis as any).contradictions_detected.map((contradiction: any, i: number) => (
                                          <div key={i} className="bg-white p-4 rounded border-l-4 border-red-500">
                                             <div className="font-semibold text-red-900">{contradiction.claim_type}</div>
                                             <div className="text-sm text-gray-600 mt-1">Severity: {contradiction.severity}</div>
                                             <a href={contradiction.evidence_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-2 block">
                                                📰 Evidence: {contradiction.evidence_title}
                                             </a>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* Hidden Patterns */}
                              {(analysis as any).hidden_patterns && (analysis as any).hidden_patterns.length > 0 && (
                                 <div className="mt-4">
                                    <h4 className="font-bold text-orange-800 mb-2">🔍 Hidden Patterns Detected:</h4>
                                    <div className="space-y-2">
                                       {(analysis as any).hidden_patterns.map((pattern: any, i: number) => (
                                          <div key={i} className="bg-white p-3 rounded border-l-4 border-orange-400">
                                             <div className="font-semibold text-orange-900">{pattern.pattern}</div>
                                             <div className="text-sm text-gray-600 mt-1">{pattern.description}</div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* Evidence Links - News Articles */}
                           {(analysis as any).external_summary?.evidence_links && (analysis as any).external_summary.evidence_links.length > 0 && (
                              <div className="mb-6">
                                 <h3 className="text-lg font-bold text-gray-900 mb-3">📰 News Articles Analyzed ({(analysis as any).external_summary.evidence_links.length})</h3>
                                 <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {(analysis as any).external_summary.evidence_links.map((link: any, i: number) => (
                                       <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                          className="block p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition">
                                          <div className="font-medium text-blue-600 hover:underline">{link.title}</div>
                                          <div className="text-xs text-gray-500 mt-1">Type: {link.type}</div>
                                       </a>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Evidence Links - Reviews */}
                           {(analysis as any).reviews_analysis?.review_sources && (analysis as any).reviews_analysis.review_sources.length > 0 && (
                              <div className="mb-6">
                                 <h3 className="text-lg font-bold text-gray-900 mb-3">💬 Reviews Analyzed ({(analysis as any).reviews_analysis.review_sources.length})</h3>
                                 <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {(analysis as any).reviews_analysis.review_sources.map((review: any, i: number) => (
                                       <a key={i} href={review.url} target="_blank" rel="noopener noreferrer"
                                          className="block p-3 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition">
                                          <div className="font-medium text-blue-600 hover:underline">{review.title}</div>
                                          <div className="text-xs text-gray-500 mt-1">Platform: {review.platform}</div>
                                       </a>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Internal Document Findings */}
                           <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                 <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Major Findings from PDF</h4>
                                 <ul className="space-y-2">
                                    {analysis.internal_documents_analysis?.major_findings?.map((f, i) => (
                                       <li key={i} className="flex items-start text-sm text-gray-600">
                                          <span className="mr-2">•</span> {f}
                                       </li>
                                    )) || <li>No findings available.</li>}
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="font-bold text-red-800 mb-2 text-sm uppercase tracking-wide">Compliance Risks</h4>
                                 <ul className="space-y-2">
                                    {analysis.internal_documents_analysis?.compliance_risks?.map((r, i) => (
                                       <li key={i} className="flex items-start text-sm text-red-600 bg-red-50 p-2 rounded">
                                          <ShieldAlert className="h-4 w-4 mr-2 flex-shrink-0" /> {r}
                                       </li>
                                    )) || <li className="text-sm text-gray-400">No specific risks flagged.</li>}
                                 </ul>
                              </div>
                           </div>

                           {/* Future Commitments & Goals */}
                           <div className="mt-6 pt-6 border-t border-gray-200">
                              <h4 className="font-bold text-gray-800 mb-3">🎯 Future Commitments And Goals</h4>
                              <div className="bg-blue-50 p-4 rounded">
                                 <ul className="space-y-2 text-sm text-gray-700">
                                    {analysis.internal_documents_analysis?.performance_indicators?.map((indicator, i) => (
                                       <li key={i} className="flex items-start">
                                          <span className="mr-2">→</span> {indicator}
                                       </li>
                                    )) || <li>No future commitments identified in documents.</li>}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </>
                  )}

                  {/* Recommended Actions */}
                  <div className="bg-forest-50 p-8 rounded-lg border border-forest-200">
                     <h3 className="text-xl font-serif text-forest-900 mb-6">Recommended Actions</h3>
                     {/* 3-Column Layout for wider screens */}
                     <div className="grid md:grid-cols-3 gap-6">
                        {/* Customers */}
                        <div>
                           <h4 className="font-bold text-forest-800 text-xs uppercase mb-2">For Customers</h4>
                           <ul className="text-sm space-y-2 text-forest-700">
                              {analysis.recommended_actions?.for_customers?.map((a, i) => <li key={i} className="flex"><span className="mr-2">•</span>{a}</li>)}
                           </ul>
                        </div>
                        {/* Investors */}
                        <div>
                           <h4 className="font-bold text-forest-800 text-xs uppercase mb-2">For Investors</h4>
                           <ul className="text-sm space-y-2 text-forest-700">
                              {analysis.recommended_actions?.for_investors?.map((a, i) => <li key={i} className="flex"><span className="mr-2">•</span>{a}</li>)}
                           </ul>
                        </div>
                        {/* Leadership */}
                        <div>
                           <h4 className="font-bold text-forest-800 text-xs uppercase mb-2">For Leadership</h4>
                           <ul className="text-sm space-y-2 text-forest-700">
                              {analysis.recommended_actions?.for_company_leadership?.map((a, i) => <li key={i} className="flex"><span className="mr-2">•</span>{a}</li>)}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               {/* RIGHT COLUMN: Metrics & Risk */}
               <div className="space-y-8">

                  {/* Risk Assessment Card */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-forest-100">
                     <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <AlertTriangle className={`h-5 w-5 mr-2 ${isGw ? 'text-red-500' : 'text-orange-500'}`} />
                        Risk Assessment
                     </h2>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-500">Overall Level</span>
                           <span className={`font-bold px-2 py-1 rounded ${isGw ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {analysis.risk_assessment?.overall_risk_level || "N/A"}
                           </span>
                        </div>
                        <hr className="border-gray-100" />
                        <div className="grid grid-cols-2 gap-4 text-xs">
                           <div>
                              <span className="block text-gray-400">Financial</span>
                              <span className="font-medium">{analysis.risk_assessment?.financial_risk}</span>
                           </div>
                           <div>
                              <span className="block text-gray-400">Reputation</span>
                              <span className="font-medium">{analysis.risk_assessment?.reputation_risk}</span>
                           </div>
                           <div>
                              <span className="block text-gray-400">Compliance</span>
                              <span className="font-medium">{analysis.risk_assessment?.compliance_risk}</span>
                           </div>
                           <div>
                              <span className="block text-gray-400">Market</span>
                              <span className="font-medium">{analysis.risk_assessment?.market_risk}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Feature Contribution Analysis */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-forest-100">
                     <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        Score Analysis And Feature Contribution
                     </h2>
                     <p className="text-xs text-gray-500 mb-6 w-full text-justify">
                        This analysis is based entirely on imported data features trained on our Ensemble Model. The chart below visualizes the contribution of each metric to the final Greenwashing Label. High values in 'Vague Keyword Ratio' or 'External Sentiment Gap' typically signify higher risk.
                     </p>

                     {/* Feature Bar Chart */}
                     {(analysis as any).detailed_scores && (
                        <div className="h-64 relative mb-6">
                           <ResponsiveContainer width="100%" height="100%">
                              {/* Normalization Helper */}
                              {(() => {
                                 const normalize = (val: number) => {
                                    if (!val) return 0;
                                    // Square root scaling: Boosts small values significantly while keeping max ~100
                                    // e.g. 0.002 -> 4.4, 0.05 -> 22, 0.8 -> 89
                                    return Math.min(Math.sqrt(Math.abs(val)) * 100, 100);
                                 };

                                 const scores = (analysis as any).detailed_scores || {};

                                 const chartData = [
                                    { subject: 'Vague Keywords', A: normalize(scores['vague_keyword_ratio']), fullMark: 100, raw: scores['vague_keyword_ratio'] },
                                    { subject: 'Concrete Claims', A: normalize(scores['concrete_claim_ratio']), fullMark: 100, raw: scores['concrete_claim_ratio'] },
                                    { subject: 'Sentiment Gap', A: normalize(scores['external_sentiment_gap']), fullMark: 100, raw: scores['external_sentiment_gap'] },
                                    { subject: 'Emission Sentiment', A: normalize(scores['emission_sentiment']), fullMark: 100, raw: scores['emission_sentiment'] },
                                    { subject: 'Energy Sentiment', A: normalize(scores['energy_sentiment']), fullMark: 100, raw: scores['energy_sentiment'] },
                                    { subject: 'Waste Sentiment', A: normalize(scores['waste_sentiment']), fullMark: 100, raw: scores['waste_sentiment'] },
                                    { subject: 'Green Freq', A: normalize(scores['green_keyword_frequency']), fullMark: 100, raw: scores['green_keyword_frequency'] },
                                    { subject: 'Focus Score', A: normalize(scores['relative_focus_score']), fullMark: 100, raw: scores['relative_focus_score'] },
                                 ];

                                 return (
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                       <PolarGrid gridType="polygon" />
                                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 11, fontWeight: 'bold' }} />
                                       <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                       <Radar
                                          name="Risk Profile"
                                          dataKey="A"
                                          stroke="#059669"
                                          strokeWidth={3}
                                          fill="#10b981"
                                          fillOpacity={0.5}
                                       />
                                       <Tooltip formatter={(value: any, name: any, props: any) => [
                                          props.payload.raw !== undefined ? props.payload.raw.toFixed(4) : value,
                                          'Raw Score'
                                       ]} />
                                       <Legend />
                                    </RadarChart>
                                 );
                              })()}
                           </ResponsiveContainer>
                        </div>
                     )}
                     {/* Detailed Metrics Grid (All CSV Columns) */}
                     {(analysis as any).detailed_scores && (
                        <div className="mb-8">
                           <h4 className="font-bold text-gray-800 mb-4 text-lg">📊 Detailed Analysis Scores</h4>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries((analysis as any).detailed_scores)
                                 .filter(([key]) => key !== 'Relative Focus Score' && key !== 'feature_contributions')
                                 .map(([key, value]) => {
                                    // Fix display name (handle typos from CSV)
                                    let displayName = key.replace(/frequecy/i, "Frequency").replace(/_/g, " ");
                                    // Capitalize words
                                    displayName = displayName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

                                    return (
                                       <div key={key} className="bg-white p-4 rounded border border-gray-200 flex flex-col justify-center hover:border-forest-400 transition-colors">
                                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 truncate" title={displayName}>{displayName}</div>
                                          <div className="text-lg md:text-xl font-mono font-bold text-gray-900 break-words">
                                             {typeof value === 'number' ? (value % 1 !== 0 ? value.toFixed(3) : value) : value}
                                          </div>
                                       </div>
                                    );
                                 })}
                           </div>
                        </div>
                     )}

                     {/* Glossary / Definitions */}
                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-xs text-gray-600 space-y-2">
                        <h4 className="font-bold text-gray-800 mb-2">Understanding the Metrics:</h4>
                        <p><span className="font-semibold text-blue-600">Vague Keyword Ratio:</span> The proportion of words or statements that are vague or non-specific regarding environmental claims. A higher ratio suggests ambiguous language.</p>
                        <p><span className="font-semibold text-blue-600">Concrete Claim Ratio:</span> Frequency of specific, verifiable data points. A higher ratio indicates more transparency.</p>
                        <p><span className="font-semibold text-blue-600">External Sentiment Gap:</span> Difference between company claims and public opinion. A significant negative gap is a red flag.</p>
                        <p><span className="font-semibold text-blue-600">Relative Focus Score:</span> Measures how central environmental topics are to the company's overall reporting.</p>
                        <p><span className="font-semibold text-blue-600">Sentiment Scores:</span> Specific tone analysis (Emission, Energy, Waste). Disparities here may suggest selective disclosure.</p>
                     </div>

                     <div className="mt-4 space-y-3">
                        <div className="bg-white p-4 rounded border border-gray-100">
                           <h4 className="font-bold text-gray-800 text-sm mb-2">Why this classification?</h4>
                           <p className="text-sm text-gray-600 leading-relaxed">
                              {isGw
                                 ? "Our AI Ensemble Model flagged this company as 'Greenwashing (High/Medium)' primarily due to a high disparity between the Vague Keyword Ratio and Concrete Claim Ratio. The negative External Sentiment Gap further reinforces the likelihood of misleading claims."
                                 : "The company is classified as 'Low Risk' because it demonstrates a high Concrete Claim Ratio and a positive alignment between internal reports and external sentiment."}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-forest-100">
                     <h2 className="text-lg font-bold text-gray-900 mb-4">Opportunities</h2>
                     <ul className="space-y-2">
                        {analysis.opportunities_and_strengths?.map((op, i) => (
                           <li key={i} className="flex items-start text-sm text-green-700">
                              <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                              {op}
                           </li>
                        ))}
                     </ul>
                  </div>

               </div>

            </div>
         </div>
      </div>
   );
};
