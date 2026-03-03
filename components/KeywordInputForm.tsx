

import React from 'react';
import type { Feature } from '../types';

interface KeywordInputFormProps {
    onSearch: (keyword: string) => void;
    loading: boolean;
    keyword: string;
    setKeyword: (keyword: string) => void;
    feature: Feature;
}

const KeywordInputForm: React.FC<KeywordInputFormProps> = ({ onSearch, loading, keyword, setKeyword, feature }) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(keyword);
    };

    const getButtonText = () => {
        switch (feature) {
            case 'blogs':
                return '상위 블로그 분석';
            case 'competition':
                return '키워드 분석 시작';
            case 'sustainable-topics':
                return '다각도 주제 발굴';
            case 'related-keywords':
                return 'AI 활용 연관 검색어 분석';
            case 'naver-news':
                return 'Naver 최신 뉴스 검색';
            case 'keywords':
            default:
                return '키워드 검색';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: 캠핑, 제주도 맛집"
                className="flex-grow bg-slate-800 text-white placeholder-slate-500 border-2 border-slate-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300 w-full"
                disabled={loading}
                aria-label="키워드 입력"
            />
            <button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center shrink-0"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        분석 중...
                    </>
                ) : (
                    getButtonText()
                )}
            </button>
        </form>
    );
};

export default KeywordInputForm;