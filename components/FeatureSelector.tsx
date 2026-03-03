

import React from 'react';
import type { Feature } from '../types';

interface FeatureSelectorProps {
    selectedFeature: Feature;
    onSelectFeature: (feature: Feature) => void;
    loading: boolean;
    onFetchRecommendations: () => void;
    recoLoading: boolean;
    onReset: () => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ selectedFeature, onSelectFeature, loading, onFetchRecommendations, recoLoading, onReset }) => {
    // Buttons are on a single, non-wrapping row.
    // Text size is reduced and padding adjusted to fit all buttons on most screens.
    // Text is allowed to wrap inside the button, which will determine the button height.
    const baseButtonClasses = "text-center font-semibold text-xs px-2 py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-1";
    
    const selectedClasses = "bg-cyan-600 text-white shadow-lg";
    const unselectedClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";
    
    const sustainableButtonBase = "border border-purple-500 bg-transparent text-purple-400 hover:bg-purple-500 hover:text-white focus:ring-purple-500";
    const sustainableButtonSelected = "bg-purple-600 text-white border border-purple-600 focus:ring-purple-500 shadow-lg";
    
    const naverButtonBase = "border border-green-500 bg-transparent text-green-400 hover:bg-green-500 hover:text-white focus:ring-green-500";
    const naverButtonSelected = "bg-green-600 text-white border border-green-600 focus:ring-green-500 shadow-lg";

    const recoButtonClasses = "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 disabled:bg-slate-700 disabled:text-slate-400";
    
    // flex-grow-0 ensures it doesn't expand horizontally. height will be stretched by flex container.
    const resetButtonClasses = "flex-grow-0 text-center font-bold p-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bg-slate-600 text-white hover:bg-slate-500 focus:ring-slate-500 disabled:bg-slate-700 disabled:text-slate-400";

    const anyLoading = loading || recoLoading;
    
    return (
        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700 mb-4">
            {/* Use flex without wrap to enforce a single row. items-stretch is default and will make buttons equal height. */}
            <div className="flex flex-row gap-2"> 
                <button
                    onClick={() => onSelectFeature('keywords')}
                    className={`${baseButtonClasses} ${selectedFeature === 'keywords' ? selectedClasses : unselectedClasses}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'keywords'}
                >
                    자동완성 키워드 분석
                </button>
                <button
                    onClick={() => onSelectFeature('related-keywords')}
                    className={`${baseButtonClasses} ${selectedFeature === 'related-keywords' ? selectedClasses : unselectedClasses}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'related-keywords'}
                >
                    AI 연관검색어 분석
                </button>
                <button
                    onClick={() => onSelectFeature('blogs')}
                    className={`${baseButtonClasses} ${selectedFeature === 'blogs' ? naverButtonSelected : naverButtonBase}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'blogs'}
                >
                    상위 블로그 분석
                </button>
                 <button
                    onClick={() => onSelectFeature('naver-news')}
                    className={`${baseButtonClasses} ${selectedFeature === 'naver-news' ? naverButtonSelected : naverButtonBase}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'naver-news'}
                >
                    Naver 실시간 뉴스
                </button>
                <button
                    onClick={() => onSelectFeature('competition')}
                    className={`${baseButtonClasses} ${selectedFeature === 'competition' ? selectedClasses : unselectedClasses}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'competition'}
                >
                    키워드 경쟁력 분석
                </button>
                <button
                    onClick={() => onSelectFeature('naver-trends')}
                    className={`${baseButtonClasses} ${selectedFeature === 'naver-trends' ? naverButtonSelected : naverButtonBase}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'naver-trends'}
                >
                    Naver 트렌드 분석
                </button>
                <button
                    onClick={onFetchRecommendations}
                    disabled={anyLoading}
                    className={`${baseButtonClasses} ${recoButtonClasses}`}
                >
                    {recoLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>분석 중...</span>
                        </div>
                    ) : (
                        '오늘의 전략 키워드'
                    )}
                </button>
                <button
                    onClick={() => onSelectFeature('sustainable-topics')}
                    className={`${baseButtonClasses} ${selectedFeature === 'sustainable-topics' ? sustainableButtonSelected : sustainableButtonBase}`}
                    disabled={anyLoading}
                    aria-pressed={selectedFeature === 'sustainable-topics'}
                >
                    다각도 블로그 주제 발굴
                </button>
                <button
                    onClick={onReset}
                    disabled={anyLoading}
                    className={resetButtonClasses}
                    title="모든 결과와 입력을 초기화합니다."
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FeatureSelector;