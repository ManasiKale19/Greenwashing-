
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, AlertTriangle, Shield, Search } from 'lucide-react';

export const Home: React.FC = () => {
   return (
      <div className="flex flex-col font-sans">

         {/* 1. HERO PARALLAX: AI Truth Detection */}
         <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div
               className="absolute inset-0 bg-cover bg-center bg-fixed"
               style={{ backgroundImage: 'url("https://images.pexels.com/photos/3401354/pexels-photo-3401354.jpeg?_gl=1*1v438yy*_ga*MTYxNTAzNzI1Ny4xNzY1MTE4NzA1*_ga_8JE65Q40S6*czE3NjUxMTg3MDQkbzEkZzEkdDE3NjUxMTg3MTEkajUzJGwwJGgw")' }}
            ></div>
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 text-center px-6 animate-fade-in-up">
               <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                  Deception <br /> Detected
               </h1>
               <p className="text-xl md:text-2xl text-white/90 font-light max-w-4xl mx-auto mb-10 tracking-wide">
                  GreenIntellect uses advanced tech to expose corporate greenwashing <br /> We analyze claims vs reality, bringing truth to transparency.
               </p>
               <Link
                  to="/analytics"
                  className="inline-flex items-center px-10 py-4 bg-green-500 text-black rounded-full font-bold tracking-widest uppercase text-xs hover:bg-green-400 transition shadow-xl border border-green-400"
               >
                  Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
            </div>
         </section>

         {/* 2. NARRATIVE: The Problem */}
         <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
               <span className="text-red-600 font-bold tracking-widest uppercase text-xs mb-4 block">The Corporate Reality</span>
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest-900 mb-8 leading-tight">
                  Marketing vs. Metrics
               </h2>
               <p className="text-lg text-gray-600 leading-relaxed mb-12">
                  In an era where "sustainability" is a buzzword, corporations often prioritize perception over planet.
                  Greenwashing misleads investors, confuses consumers, and hinders genuine progress.
                  We exist to separate the marketing spin from the measurable data.
               </p>
               <div className="grid md:grid-cols-2 gap-12 text-left">
                  <div className="bg-red-50 p-8 rounded-xl border border-red-100">
                     <h3 className="font-serif text-2xl font-bold text-red-900 mb-4 flex items-center"><AlertTriangle className="mr-2 h-6 w-6" /> Vague Claims</h3>
                     <p className="text-gray-600">Terms like "Eco-friendly" or "Natural" often lack scientific backing. Our NLP models detect these non-specific keywords instantly.</p>
                  </div>
                  <div className="bg-green-50 p-8 rounded-xl border border-green-100">
                     <h3 className="font-serif text-2xl font-bold text-green-900 mb-4 flex items-center"><CheckCircle className="mr-2 h-6 w-6" /> Concrete Data</h3>
                     <p className="text-gray-600">We verify numerical targets (e.g. "Net Zero by 2030") against historical performance and external audits.</p>
                  </div>
               </div>
            </div>
         </section>



         {/* 4. INVESTOR SECTION: Why It Matters */}
         <section className="py-32 bg-forest-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
               <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                     <span className="text-forest-600 font-bold tracking-widest uppercase text-xs mb-4 block">For Stakeholders</span>
                     <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest-900 mb-6">
                        Protect Your Portfolio. <br /> Demand Accountability.
                     </h2>
                     <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Investing in greenwashing is a liability. Regulatory fines and reputational damage can crash stock prices overnight. GreenIntellect gives you the due diligence tool you need to spot the fakes before the market does.
                     </p>

                     <ul className="space-y-6">
                        <li className="flex items-start">
                           <div className="flex-shrink-0 p-1 bg-green-100 rounded-full mr-4">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                           </div>
                           <div>
                              <h4 className="font-bold text-forest-900">Sentiment Gap Analysis</h4>
                              <p className="text-sm text-gray-500">We reveal the difference between what a company SAYS and what the public KNOWS.</p>
                           </div>
                        </li>
                        <li className="flex items-start">
                           <div className="flex-shrink-0 p-1 bg-green-100 rounded-full mr-4">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                           </div>
                           <div>
                              <h4 className="font-bold text-forest-900">Compliance Risk Engine</h4>
                              <p className="text-sm text-gray-500">Auto-detection of regulatory violations and "hidden" non-compliance patterns.</p>
                           </div>
                        </li>
                     </ul>

                     <div className="mt-12">
                        <Link to="/analytics" className="px-8 py-4 bg-forest-900 text-white rounded-lg font-bold shadow-lg hover:bg-forest-800 transition">
                           Verify a Company Now
                        </Link>
                     </div>
                  </div>

                  <div className="relative">
                     <div className="absolute inset-0 bg-forest-200 transform rotate-3 rounded-2xl"></div>
                     <img
                        src="https://mma.prnewswire.com/media/2600060/Adani_Enterprises_Logo.jpg?p=publish"
                        alt="Adani Port"
                        className="relative rounded-2xl shadow-2xl w-full object-cover h-[450px] hover:grayscale-0 transition duration-700"
                     />
                     <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg border border-forest-100">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-xs font-bold text-forest-500 uppercase">Live Detection</span>
                           <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                        </div>
                        <div className="text-xl font-serif font-bold text-forest-900">Adani Ports</div>
                        <div className="text-sm text-red-600 font-bold mt-1">Status: High Risk • Greenwashing Likely</div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 5. PARALLAX HERO 2: Data Integrity */}
         <section className="relative h-[60vh] flex items-center justify-center">
            <div
               className="absolute inset-0 bg-cover bg-center bg-fixed"
               style={{ backgroundImage: 'url("https://images.pexels.com/photos/3401354/pexels-photo-3401354.jpeg?_gl=1*1v438yy*_ga*MTYxNTAzNzI1Ny4xNzY1MTE4NzA1*_ga_8JE65Q40S6*czE3NjUxMTg3MDQkbzEkZzEkdDE3NjUxMTg3MTEkajUzJGwwJGgw")' }}
            ></div>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 text-center px-6">
               <h2 className="text-5xl font-serif font-bold text-white mb-6">Data You Can Trust</h2>
               <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  We process thousands of data points to deliver a simple, binary verdict: <br />
                  <span className="font-bold text-green-400">Authentic</span> or <span className="font-bold text-red-400">Deceptive</span>.
               </p>
            </div>
         </section>

         {/* 6. FINAL CTA */}
         <section className="py-24 bg-white text-center">
            <div className="max-w-3xl mx-auto px-6">
               <h2 className="text-4xl font-serif font-bold text-forest-900 mb-6">Join the Transparency Movement</h2>
               <p className="text-gray-600 mb-10 text-lg">
                  Stop guessing. Start verifying. Use GreenIntellect to ensure your investments and choices align with reality
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/analytics" className="px-10 py-4 bg-forest-800 text-white rounded-full font-bold hover:bg-forest-900 transition shadow-lg">
                     Get Started
                  </Link>
               </div>
            </div>
         </section>

      </div>
   );
};
