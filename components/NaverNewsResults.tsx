
import React from 'react';
import type { NaverNewsData } from '../types';

interface NaverNewsResultsProps {
    data: NaverNewsData[];
    onGenerateStrategy: () => void;
    strategyLoading: boolean;
    hasStrategy: boolean;
}

const NaverNewsResults: React.FC<NaverNewsResultsProps> = ({ data, onGenerateStrategy, strategyLoading, hasStrategy }) => {

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 shadow-lg border border-slate-700 animate-fade-in space-y-4">
            <h3 className="flex items-center text-lg font-bold text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3m-3 4h3" /></svg>
                <span className="ml-2">Naver 실시간 뉴스 분석</span>
            </h3>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                             <p className="text-xs text-slate-400 mb-1">{formatDate(item.pubDate)}</p>
                             <h4 className="font-bold text-cyan-300 hover:underline mb-2">{item.title}</h4>
                             <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
                        </a>
                    </div>
                ))}
            </div>
             {!hasStrategy && (
                <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                    <button
                        onClick={onGenerateStrategy}
                        disabled={strategyLoading}
                        className="bg-yellow-600 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center w-full sm:w-auto mx-auto"
                    >
                        {strategyLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>AI 전략 생성 중...</span>
                            </>
                        ) : (
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21v-1m-4.663-2H16.34" /></svg>
                                <span>뉴스 기반 AI 블로그 공략법 제안받기</span>
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default NaverNewsResults;