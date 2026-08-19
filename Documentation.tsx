import React, { useState } from 'react';
import { FileText, Users, ChevronRight, Menu } from 'lucide-react';

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('abstract');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed navbar + padding
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const NavItem = ({ id, label }: { id: string, label: string }) => (
    <button
      onClick={() => scrollTo(id)}
      className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-2 ${activeSection === id
          ? 'border-forest-700 text-forest-900 bg-forest-50'
          : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col md:flex-row pt-20">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-white border-r border-gray-200 h-auto md:h-[calc(100vh-80px)] sticky top-20 overflow-y-auto z-10 hidden md:block">
        <div className="p-6">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</h5>
          <nav className="space-y-1">
            <NavItem id="title" label="Title Page" />
            <NavItem id="abstract" label="Abstract" />
            <NavItem id="intro" label="1. Introduction" />
            <NavItem id="literature" label="2. Literature Survey" />
            <NavItem id="system" label="3. Implemented System" />
            <NavItem id="results" label="4. Results & Discussion" />
            <NavItem id="summary" label="5. Summary" />
            <NavItem id="references" label="References" />
            <NavItem id="acknowledgement" label="Acknowledgement" />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:px-12 md:py-16 space-y-16">

        {/* Title Page */}
        <section id="title" className="text-center space-y-6 pb-12 border-b border-gray-100 scroll-mt-24">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Tracking green commitment: An NLP approach to detect greenwashing in industry reports
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Submitted in partial fulfillment of the requirement of University of Mumbai for the Degree of Bachelor of Technology in Computer Engineering
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12 bg-gray-50 p-8 rounded-xl border border-gray-100 text-left">
            <div>
              <h6 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Submitted By</h6>
              <ul className="space-y-2 font-medium text-gray-900">
                <li className="flex items-center"><span className="w-2 h-2 bg-forest-500 rounded-full mr-3"></span>Mannat Nayyar</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-forest-500 rounded-full mr-3"></span>Manasi Kale</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-forest-500 rounded-full mr-3"></span>Tanush Shyam</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-forest-500 rounded-full mr-3"></span>Shabarinath R</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Supervisor</h6>
              <div className="font-medium text-gray-900 mb-6">Dr. Dhiraj Amin</div>
              <h6 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Institution</h6>
              <div className="text-sm text-gray-600">Department of Computer Engineering<br />Pillai College of Engineering<br />New Panvel – 410 206</div>
            </div>
          </div>
        </section>

        {/* Abstract */}
        <section id="abstract" className="scroll-mt-24 space-y-6">
          <div className="flex items-center space-x-3 text-forest-700">
            <FileText className="h-6 w-6" />
            <h2 className="text-2xl font-bold tracking-tight">Abstract</h2>
          </div>
          <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none text-justify">
            <p>
              Greenwashing, the practice of corporations making misleading environmental claims to appear more sustainable than they actually are, poses significant challenges to stakeholders seeking authentic environmental responsibility. This study presents a machine learning framework that leverages environmental keywords and sentiment analysis to automatically detect potential greenwashing practices. We developed a multi-feature approach incorporating keyword frequency analysis, sentiment discrepancy detection, and aspect-based sentiment evaluation to classify corporate communications as either greenwashing or legitimate environmental claims.
            </p>
            <p className="mt-4">
              Our methodology was evaluated using six different machine learning algorithms Logistic Regression, Decision Tree, Random Forest, Support Vector Machine (SVM), Naïve Bayes and XG Boost along with an ensemble soft-voting classifier. The experimental results demonstrate that textual features (keyword frequency, vague keyword ratios, and concrete claim ratios) and sentiment discrepancy features (overall sentiment scores and external sentiment gaps) are highly predictive of greenwashing behavior. While individual classifiers such as Random Forest and SVM achieved moderate cross-validation performance (accuracy ~0.68–0.71), the ensemble model outperformed all single algorithms, achieving 82.35% accuracy and a weighted F1-score of 0.7797 on the test set. These findings highlight that ensemble learning provides a robust and scalable solution for regulators, investors, and stakeholders to automatically identify potentially misleading environmental claims in corporate communications.
            </p>
          </div>
        </section>

        {/* Chapter 1 */}
        <section id="intro" className="scroll-mt-24 space-y-6 pt-8 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 1: Introduction</h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <h3 className="text-xl font-bold text-gray-800">1.1 Fundamentals</h3>
            <p>
              Corporate environmental responsibility has become a major concern for stakeholders, investors, and consumers. Rising awareness has increased pressure on firms to showcase sustainability, but this has also led to greenwashing, where companies exaggerate or falsify environmental claims. Such practices mislead decision-makers and undermine genuine sustainability efforts. Traditional detection methods rely on manual expert review, which is limited by scalability, subjectivity, time constraints, and cost. With the rapid growth of corporate communications and advanced marketing tactics, distinguishing authentic efforts from greenwashing is increasingly difficult. The framework combines keyword indicators, sentiment metrics, and aspect-based sentiment to build a rich feature set for detecting misleading environmental claims.
            </p>

            <h3 className="text-xl font-bold text-gray-800">1.2 Objectives</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To collect and preprocess corporate environmental disclosure data for greenwashing detection.</li>
              <li>To extract linguistic and sentiment-based features reflecting claim tone and credibility.</li>
              <li>To analyze sentiment alignment between corporate reports and external sources.</li>
              <li>To implement and evaluate machine learning models for classifying potential greenwashing.</li>
              <li>To optimize features and visualize model performance using standard evaluation metrics.</li>
              <li>To promote transparency in sustainability reporting through automated analysis.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800">1.3 Scope</h3>
            <p>
              The scope of this project encompasses the application of Machine Learning and Natural Language Processing (NLP) techniques to identify and analyze potential greenwashing practices within corporate industry reports. The study involves the collection of sustainability-related documents such as annual reports, ESG (Environmental, Social, and Governance) disclosures, and environmental performance statements published by companies. These documents will serve as the primary data source for analysis. The project will focus on extracting and processing textual information from these reports to identify patterns, keywords, and linguistic features commonly associated with misleading or vague environmental claims. Using NLP methods such as text classification, sentiment analysis, and keyword extraction, the system will be trained with Machine learning algorithms to differentiate between authentic green communication and potentially deceptive content. The project will not include any manual or field verification of claims but will be limited to the analysis of written content.
            </p>

            <h3 className="text-xl font-bold text-gray-800">1.4 Organization of the Project Report</h3>
            <p>
              The report is organized as follows: The introduction is given in Chapter 1, which describes the fundamental concepts related to greenwashing, Machine Learning, and Natural Language Processing (NLP). It also states the motivation, objectives, and scope of the project. Chapter 2 presents the literature review, discussing existing techniques for greenwashing detection along with their advantages and limitations. Chapter 3 explains the theoretical background and the proposed methodology, including data preprocessing, feature extraction, model implementation, and evaluation. Chapter 4 highlights the societal and technical applications of the project, emphasizing its contribution to corporate transparency. Chapter 5 summarizes the overall work, key findings, and suggests future enhancements for improving the system.
            </p>
          </div>
        </section>

        {/* Chapter 2 */}
        <section id="literature" className="scroll-mt-24 space-y-6 pt-8 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 2: Literature Survey</h2>
          <div className="space-y-8">
            <div className="p-6 bg-forest-50 border border-forest-100 rounded-lg">
              <h4 className="font-bold text-forest-900 mb-2">2.1 Introduction</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                With growing awareness of environmental sustainability, organizations are increasingly expected to demonstrate genuine commitments to eco-friendly practices. However, many continue engaging in greenwashing. This literature review explores existing methods for greenwashing detection with emphasis on NLP-based approaches such as deceptive language analysis, sentiment scoring, and machine learning classification.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-gray-900">2.2 Literature Review Summary</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600 border border-gray-200">
                  <thead className="bg-gray-100 text-gray-900 font-bold">
                    <tr>
                      <th className="px-4 py-2 border-b">Paper / Author</th>
                      <th className="px-4 py-2 border-b">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">Using NLP For Detecting Greenwashing (Saxena, 2023)</td>
                      <td className="px-4 py-3">Proposed framework using RoBERTa and DistilRoBERTa. Developed "Greenwashing Indicators" for index portfolios.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Leveraging Language Models (Capetz et al., 2023)</td>
                      <td className="px-4 py-3">Used ClimateBERT. Achieved 86.34% accuracy. Limited by dataset size and domain tuning.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Optimized ML Framework (Zeng et al., 2025)</td>
                      <td className="px-4 py-3">Proposed XGBoost with SHAP and IHPO. Achieved R² of 0.9790. High computational cost.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">NLP-Based Pattern Detection Service (Kim et al., 2023)</td>
                      <td className="px-4 py-3">Rule-based pattern list + logistic regression. Processed 1000 reports with 72% success.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Aspect-Action Analysis (Ong et al., 2025)</td>
                      <td className="px-4 py-3">Introduced A3CG dataset to link claims to actions. Improves explainability but limited by data scarcity.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-2">2.3 Summary/Inference</h4>
              <p className="text-gray-600 leading-relaxed">
                AI and deep learning play a crucial role in detecting and measuring greenwashing. While methods like BERT improve transparency, challenges such as data limitations and rating inconsistencies persist. Our proposed system aims to address these by combining multiple feature sets (text, sentiment, aspect-based) into an ensemble model.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 3 */}
        <section id="system" className="scroll-mt-24 space-y-6 pt-8 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 3: Implemented System</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <h3 className="text-xl font-bold text-gray-800">3.1 Overview</h3>
            <p>
              Greenwashing detection in this project involves the integration of Natural Language Processing (NLP), sentiment analysis, and machine learning techniques to identify misleading or exaggerated environmental claims. Methods such as keyword frequency analysis and TF–IDF are used to evaluate sustainability terms.
            </p>

            <h3 className="text-xl font-bold text-gray-800">3.1.2 Proposed System Architecture</h3>
            <p>The system follows a pipeline:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Data Input:</strong> Corporate sustainability reports, ESG disclosures.</li>
              <li><strong>Preprocessing:</strong> Text cleaning, tokenization, normalization.</li>
              <li><strong>Feature Extraction:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 text-sm">
                  <li>Text Features: Green Keyword Freq, Concrete Claim Ratio, Vague Keyword Ratio.</li>
                  <li>Sentiment Features: Overall Sentiment Score (FinBERT), External Sentiment Gap.</li>
                  <li>Aspect-Based Features: Emission, Energy, Waste Sentiments.</li>
                </ul>
              </li>
              <li><strong>Machine Learning Models:</strong> Logistic Regression, Decision Tree, Random Forest, SVM, Naïve Bayes, XGBoost.</li>
              <li><strong>Ensemble Classifier:</strong> Soft voting ensemble combining probabilities.</li>
              <li><strong>Output:</strong> Binary decision (Greenwashing / Not Detected) with interpretative insights.</li>
            </ol>

            <h3 className="text-xl font-bold text-gray-800">3.2 Implementation Details</h3>
            <p>
              <strong>Data Preprocessing:</strong> Dataset of 84 companies. Missing values handled via mean imputation. 80-20 train-test split.<br />
              <strong>Classification Target:</strong> High/Medium risk → 1 (Greenwashing), Low risk → 0 (Not Greenwashing).<br />
              <strong>Feature Selection:</strong> Forward feature selection was used. Logistic Regression peaked at 2 features; Random Forest used all 9 features.<br />
              <strong>Ensemble:</strong> Combined Random Forest, SVM, Decision Tree, and Logistic Regression.
            </p>
          </div>
        </section>

        {/* Chapter 4 */}
        <section id="results" className="scroll-mt-24 space-y-6 pt-8 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 4: Results Discussion</h2>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <h3 className="text-xl font-bold text-gray-800">4.1 Dataset</h3>
            <p>The dataset contains 84 companies with 9 computed features derived from corporate sustainability reports.</p>

            <h3 className="text-xl font-bold text-gray-800">4.3 Performance Evaluation</h3>
            <p>
              Multiple classification algorithms were trained. Random Forest and SVM showed notably higher cross-validation accuracy.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden my-6">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-900">
                Model Performance Comparison
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Cross-Validation F1-Score (Weighted)</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span>Random Forest</span> <span className="font-mono font-bold">0.6248</span></li>
                    <li className="flex justify-between"><span>SVM</span> <span className="font-mono font-bold">0.6110</span></li>
                    <li className="flex justify-between"><span>Decision Tree</span> <span className="font-mono">0.5852</span></li>
                    <li className="flex justify-between"><span>Logistic Regression</span> <span className="font-mono">0.5779</span></li>
                    <li className="flex justify-between"><span>XGBoost</span> <span className="font-mono">0.5553</span></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Ensemble Test Performance</h5>
                  <div className="text-center p-4 bg-forest-50 rounded-lg">
                    <div className="text-4xl font-bold text-forest-700">82.35%</div>
                    <div className="text-xs text-forest-600 uppercase tracking-widest mt-1">Accuracy</div>
                    <div className="mt-2 text-sm font-mono text-gray-600">F1-Score: 0.7797</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800">Confusion Matrix Analysis</h3>
            <p>
              The model correctly classified 13 "Not Greenwashing" cases (100% specificity). It identified 1 "Greenwashing" case correctly but missed 3 (False Negatives). This indicates high precision but room for improvement in recall.
            </p>
          </div>
        </section>

        {/* Chapter 5 */}
        <section id="summary" className="scroll-mt-24 space-y-6 pt-8 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Chapter 5: Summary</h2>
          <p className="text-gray-600 leading-relaxed">
            The report presents a comprehensive framework that integrates Natural Language Processing (NLP) and Machine Learning (ML) to detect corporate greenwashing in sustainability and ESG disclosures. By analyzing textual, sentiment, and aspect-based features, the system identifies exaggerated, vague, or inconsistent environmental claims. Models including SVM, Random Forest, and XGBoost were trained on sustainability reports, with an ensemble soft-voting approach achieving the best performance at 82.35% accuracy and a weighted F1-score of 0.78. This method significantly improves the efficiency, consistency, and reliability of sustainability evaluations compared to traditional manual assessments.
          </p>
        </section>

        {/* Acknowledgement */}
        <section id="acknowledgement" className="scroll-mt-24 space-y-6 pt-8 border-t border-gray-100 pb-20">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Acknowledgement</h2>
          <p className="text-gray-600 leading-relaxed italic">
            I wish to express my deepest gratitude to all those who contributed to the realization of this project. Foremost, I extend my sincere appreciation to my project guide, Dr. Dhiraj Amin for his invaluable mentorship. I am also thankful to Prof. Payel Thakur and Prof. K. Charumathi, our project coordinators. I am deeply indebted to Dr. Sharvari Govilkar, Head of the Department, and Dr. Sandeep Joshi, Principal, for their visionary leadership. Finally, I owe an immeasurable debt to my family and friends.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700">Mannat Nayyar</span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700">Manasi Kale</span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700">Tanush Shyam</span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700">Shabarinath R</span>
          </div>
        </section>

      </main>
    </div>
  );
};