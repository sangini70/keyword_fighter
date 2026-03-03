
import React, { useState, useEffect } from 'react';
import { analyzeNaverTrendCategory, naverTrendCategories } from '../services/keywordService';
import type { NaverTrendAnalysis, NaverTrendCategory, FrequentKeyword, BlogPostData, BlogStrategySuggestion } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import CopyButton from './CopyButton';

const FrequentKeywordsDisplay: React.FC<{ keywords: FrequentKeyword[], onKeywordClick: (keyword: string) => void }> = ({ keywords, onKeywordClick }) => {
    if (keywords.length === 0) {
        return <p className="text-slate-400 text-sm">핵심 키워드를 추출할 수 없었습니다.</p>;
    }
    
    const maxFrequency = Math.max(...keywords.map(k => k.frequency), 1);

    return (
        <div className="space-y-3">
            {keywords.map(({ keyword, frequency }) => (
                <div key={keyword} className="flex items-center gap-4 text-sm">
                    <button
                        onClick={() => onKeywordClick(keyword)}
                        className="font-bold text-cyan-300 text-left hover:underline focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1 w-32 shrink-0 truncate"
                        title={`'${keyword}' 경쟁력 분석하기`}
                    >
                        {keyword}
                    </button>
                    <div className="flex-grow bg-slate-700 rounded-full h-5">
                        <div
                            className="bg-gradient-to-r from-green-500 to-cyan-500 h-5 rounded-full flex items-center justify-end px-2"
                            style={{ width: `${(frequency / maxFrequency) * 100}%` }}
                        >
                            <span className="text-white font-semibold text-xs">{frequency}회</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const BlogPostsTable: React.FC<{ posts: BlogPostData[] }> = ({ posts }) => {
     if (posts.length === 0) {
        return <p className="text-slate-400 text-sm">관련 블로그 포스트를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
                <thead className="bg-slate-700/50 text-slate-300 uppercase tracking-wider">
                    <tr>
                        <th scope="col" className="p-3 text-left w-16">No.</th>
                        <th scope="col" className="p-3 text-left">블로그 제목</th>
                        <th scope="col" className="p-3 text-left w-24">바로가기</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {posts.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                            <td className="p-3 text-slate-400 text-center">{item.id}</td>
                            <td className="p-3 font-medium text-slate-200">{item.title}</td>
                            <td className="p-3">
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-cyan-400 hover:underline transition-colors duration-200"
                                  aria-label={`${item.title} (새 탭에서 열기)`}
                                >
                                    보기
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const SuggestionAccordion: React.FC<{ title: string, icon: React.ReactNode, suggestions: BlogStrategySuggestion[] }> = ({ title, icon, suggestions }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h5 className="flex items-center text-md font-bold text-slate-200 mb-4">{icon}{title}</h5>
                <p className="text-slate-400 text-sm">AI가 추천 제목을 생성하지 못했습니다.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h5 className="flex items-center text-md font-bold text-slate-200 mb-4">{icon}{title}</h5>
            <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                    <div key={suggestion.id} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                            aria-expanded={openIndex === index}
                        >
                            <span className="font-bold text-cyan-300 flex-1 pr-4">{index + 1}. {suggestion.title}</span>
                            <svg className={`w-5 h-5 text-slate-400 transform transition-transform shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {openIndex === index && (
                            <div className="p-4 border-t border-slate-700 bg-slate-900/50 animate-fade-in space-y-4">
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
    );
}

interface NaverTrendsResultsProps {
    onKeywordClick: (keyword: string) => void;
}

const NaverTrendsResults: React.FC<NaverTrendsResultsProps> = ({ onKeywordClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<NaverTrendCategory | null>(null);
    const [analysisResult, setAnalysisResult] = useState<NaverTrendAnalysis | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedCategory) return;

        const fetchAnalysis = async () => {
            setLoading(true);
            setError(null);
            setAnalysisResult(null);
            try {
                const results = await analyzeNaverTrendCategory(selectedCategory.slug);
                setAnalysisResult(results);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [selectedCategory]);

    const handleCategorySelect = (category: NaverTrendCategory) => {
        setSelectedCategory(category);
    };
    
    const renderContent = () => {
        if (!selectedCategory && !loading) {
            return (
                <div className="text-center p-8 bg-slate-800/50 rounded-lg shadow-md min-h-[300px] flex items-center justify-center animate-fade-in">
                    <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-green-500/10 text-green-400 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <p className="text-slate-300 text-lg">분석을 시작할 카테고리를 선택해주세요.</p>
                        <p className="text-slate-500 text-sm">위 목록에서 관심 있는 분야를 클릭하면 AI가 심층 분석을 시작합니다.</p>
                    </div>
                </div>
            );
        }
        
        if (loading) return <LoadingSpinner />;
        
        if (error && selectedCategory) {
            if (error.startsWith('LOGIN_REQUIRED:')) {
                 return (
                     <div className="text-center p-8 bg-slate-800/50 rounded-lg border-2 border-dashed border-yellow-500/50 animate-fade-in">
                        <div className="w-16 h-16 mx-auto bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">네이버 로그인 필요</h4>
                        <p className="text-slate-400 mt-2 mb-6 max-w-md mx-auto">
                           Naver Creator Advisor의 정책 변경으로 트렌드 데이터를 보려면 로그인이 필요합니다.
                           보안 상의 이유로 이 앱에서 직접 로그인할 수는 없지만, 아래 버튼을 눌러 공식 페이지에서 최신 트렌드를 확인하실 수 있습니다.
                        </p>
                        <a
                            href={`https://creator-advisor.naver.com/creator/insight?service=blog&metric=popular_keywords&category=${selectedCategory.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-500 transition duration-300"
                        >
                            <span>'{selectedCategory.name}' 트렌드 바로가기</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                );
            }
            if (error.includes("API 키가 설정되지 않았습니다")) {
                return <ErrorMessage message={`${error} '상위 블로그 분석'을 위해 우측 상단 설정(⚙️)에서 키를 등록해주세요.`} />;
            }
            return <ErrorMessage message={error} />;
        }
        
        if (!analysisResult) return <p className="text-slate-400 text-center p-8">데이터가 없습니다.</p>;

        return (
            <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                     <h4 className="text-2xl font-bold text-cyan-300">'{selectedCategory.name}' 카테고리 심층 트렌드 분석</h4>
                     <p className="text-slate-400">상위 블로그, 핵심 키워드, AI 공략법 제안</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <section className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <h5 className="flex items-center text-md font-bold text-slate-200 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                '{selectedCategory.name}' 카테고리 상위 10개 블로그
                            </h5>
                            <BlogPostsTable posts={analysisResult.blogPosts} />
                        </section>
                        <section className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <h5 className="flex items-center text-md font-bold text-slate-200 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                                상위 10개 블로그 제목 핵심 키워드 (빈도순)
                            </h5>
                            <FrequentKeywordsDisplay keywords={analysisResult.frequentKeywords} onKeywordClick={onKeywordClick} />
                        </section>
                    </div>
                    <div className="space-y-6">
                        <SuggestionAccordion 
                            title="핵심 키워드 기반 블로그 제목 제안"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21v-1m-4.663-2H16.34" /></svg>}
                            suggestions={analysisResult.keywordBasedSuggestions}
                        />
                        <SuggestionAccordion 
                            title="상위 제목 구조 분석 기반 블로그 제목 제안"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                            suggestions={analysisResult.analysisBasedSuggestions}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 shadow-lg border border-slate-700 animate-fade-in space-y-6 min-h-[400px]">
            <h3 className="flex items-center text-lg font-bold text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="ml-2">Naver 트렌드 분석</span>
            </h3>

            <div className="flex flex-wrap gap-2 border-b-2 border-slate-700 pb-3">
                {naverTrendCategories.map(category => (
                    <button
                        key={category.slug}
                        onClick={() => handleCategorySelect(category)}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 ${
                            selectedCategory?.slug === category.slug 
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default NaverTrendsResults;
