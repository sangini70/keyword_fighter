
import React, { useState } from 'react';
import type { NewsBlogStrategyReportData } from '../types';
import CopyButton from './CopyButton';

const AnalysisCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 h-full">
        <h4 className="flex items-center text-md font-bold text-cyan-300 mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{content}</p>
    </div>
);

const NewsBlogStrategyReport: React.FC<{ data: NewsBlogStrategyReportData }> = ({ data }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const formatAllDataForCopy = () => {
        let text = `[뉴스 기반 AI 블로그 공략법]\n\n`;
        text += `== 핵심 분석 ==\n`;
        text += `핵심 쟁점: ${data.analysis.coreIssue}\n`;
        text += `사용자 흥미 포인트: ${data.analysis.userInterestPoint}\n`;
        text += `콘텐츠 기회: ${data.analysis.opportunity}\n\n`;
        
        text += `== 세부 콘텐츠 제안 (${data.suggestions.length}개) ==\n\n`;
        data.suggestions.forEach((suggestion, index) => {
            text += `${index + 1}. 제목: ${suggestion.title}\n`;
            text += `   - 썸네일 문구: ${suggestion.thumbnailCopy}\n`;
            text += `   - 공략법: ${suggestion.strategy}\n\n`;
        });
        
        return text.trim();
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 shadow-lg border border-slate-700 animate-fade-in space-y-6">
            <h3 className="flex items-center justify-between text-lg font-bold text-yellow-400">
                <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="ml-2">뉴스 기반 AI 블로그 공략법</span>
                </span>
                <CopyButton textToCopy={formatAllDataForCopy()} />
            </h3>

            <div className="space-y-4">
                 <h4 className="text-slate-300 font-bold">핵심 분석</h4>
                 <div className="grid md:grid-cols-3 gap-4">
                    <AnalysisCard 
                        title="핵심 쟁점" 
                        content={data.analysis.coreIssue}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3m-3 4h3" /></svg>}
                    />
                    <AnalysisCard 
                        title="사용자 흥미 포인트" 
                        content={data.analysis.userInterestPoint}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <AnalysisCard 
                        title="콘텐츠 기회" 
                        content={data.analysis.opportunity}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.343 5.757a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM2 10a1 1 0 01-1-1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.95 14.95a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" /></svg>}
                    />
                 </div>
            </div>

            <div>
                 <h4 className="text-slate-300 font-bold mb-3">세부 콘텐츠 제안 ({data.suggestions.length}개)</h4>
                 <div className="space-y-2">
                     {data.suggestions.map((suggestion, index) => (
                        <div key={suggestion.id} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                                aria-expanded={openIndex === index}
                                aria-controls={`news-suggestion-content-${index}`}
                            >
                                <span className="font-bold text-cyan-300 flex-1 pr-4">{index + 1}. {suggestion.title}</span>
                                <svg
                                    className={`w-5 h-5 text-slate-400 transform transition-transform shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div id={`news-suggestion-content-${index}`} className="p-4 border-t border-slate-700 bg-slate-900/50 animate-fade-in space-y-4">
                                    <div className="flex justify-end -mb-2">
                                        <CopyButton textToCopy={`제목: ${suggestion.title}\n썸네일 문구: ${suggestion.thumbnailCopy}\n공략법: ${suggestion.strategy}`} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-bold mb-1">썸네일 문구:</p>
                                        <p className="text-yellow-300 whitespace-pre-wrap text-sm font-semibold bg-slate-800 p-2 rounded-md">{suggestion.thumbnailCopy}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-bold mb-1">공략법:</p>
                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{suggestion.strategy}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default NewsBlogStrategyReport;
