
import React, { useState } from 'react';
import { useSearch } from './hooks/useKeywordSearch';
import KeywordInputForm from './components/KeywordInputForm';
import ResultsTable from './components/ResultsTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SearchEngineSelector from './components/SearchEngineSelector';
import FeatureSelector from './components/FeatureSelector';
import BlogResultsTable from './components/BlogResultsTable';
import CompetitionAnalysisResults from './components/CompetitionAnalysisResults';
import PromptResultDisplay from './components/PromptResultDisplay';
import BlogTopicSuggestions from './components/BlogTopicSuggestions';
import BlogStrategyReport from './components/BlogStrategyReport';
import RealtimeKeywordsSidebar from './components/RealtimeKeywordsSidebar';
import RecommendedKeywordsDisplay from './components/RecommendedKeywordsDisplay';
import SustainableTopicsResults from './components/SustainableTopicsResults';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import PeopleAlsoAsk from './components/PeopleAlsoAsk';
import SerpStrategyReport from './components/SerpStrategyReport';
import CurrentStatus from './components/CurrentStatus';
import NaverTrendsResults from './components/NaverTrendsResults';
import NaverNewsResults from './components/NaverNewsResults';
import NewsBlogStrategyReport from './components/NewsBlogStrategyReport';
import { generateTopicsFromMainKeyword, generateTopicsFromAllKeywords, generateBlogStrategy, fetchRecommendedKeywords, generateSustainableTopics, generateSerpStrategy, executePromptAsCompetitionAnalysis, fetchNaverNews, generateBlogStrategyFromNews } from './services/keywordService';
import type { SearchSource, Feature, KeywordData, BlogPostData, KeywordMetrics, GeneratedTopic, BlogStrategyReportData, RecommendedKeyword, SustainableTopicCategory, GoogleSerpData, SerpStrategyReportData, NaverNewsData, NewsBlogStrategyReportData } from './types';

const App: React.FC = () => {
    const { results, loading, error, search, initialLoad, setResults, setError, setInitialLoad, setLoading } = useSearch();
    const [source, setSource] = useState<SearchSource>('google');
    const [feature, setFeature] = useState<Feature>('competition');

    const [keyword, setKeyword] = useState<string>('');
    const [mainKeyword, setMainKeyword] = useState<string>('');
    const [blogTopics, setBlogTopics] = useState<GeneratedTopic[] | null>(null);
    const [topicTitle, setTopicTitle] = useState<string>('');
    const [topicLoading, setTopicLoading] = useState<boolean>(false);
    const [topicError, setTopicError] = useState<string | null>(null);

    const [blogStrategy, setBlogStrategy] = useState<BlogStrategyReportData | null>(null);
    const [strategyLoading, setStrategyLoading] = useState<boolean>(false);
    const [strategyError, setStrategyError] = useState<string | null>(null);
    
    const [serpStrategy, setSerpStrategy] = useState<SerpStrategyReportData | null>(null);
    const [serpStrategyLoading, setSerpStrategyLoading] = useState<boolean>(false);
    const [serpStrategyError, setSerpStrategyError] = useState<string | null>(null);

    const [recommendedKeywords, setRecommendedKeywords] = useState<RecommendedKeyword[] | null>(null);
    const [recoLoading, setRecoLoading] = useState<boolean>(false);
    const [recoError, setRecoError] = useState<string | null>(null);

    const [sustainableTopics, setSustainableTopics] = useState<SustainableTopicCategory[] | null>(null);
    const [sustainableTopicsLoading, setSustainableTopicsLoading] = useState<boolean>(false);
    const [sustainableTopicsError, setSustainableTopicsError] = useState<string | null>(null);

    const [naverNews, setNaverNews] = useState<NaverNewsData[] | null>(null);
    const [newsLoading, setNewsLoading] = useState<boolean>(false);
    const [newsError, setNewsError] = useState<string | null>(null);
    
    const [newsBlogStrategy, setNewsBlogStrategy] = useState<NewsBlogStrategyReportData | null>(null);
    const [newsBlogStrategyLoading, setNewsBlogStrategyLoading] = useState<boolean>(false);
    const [newsBlogStrategyError, setNewsBlogStrategyError] = useState<string | null>(null);

    const [promptResult, setPromptResult] = useState<KeywordMetrics | null>(null);
    const [promptResultLoading, setPromptResultLoading] = useState<boolean>(false);
    const [promptResultError, setPromptResultError] = useState<string | null>(null);

    const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

    const handleFeatureSelect = (newFeature: Feature) => {
        if (feature === newFeature) return;

        setResults([]);
        setError(null);
        setInitialLoad(true);
        setKeyword('');
        setMainKeyword('');
        setBlogTopics(null);
        setTopicTitle('');
        setTopicLoading(false);
        setTopicError(null);
        setBlogStrategy(null);
        setStrategyLoading(false);
        setStrategyError(null);
        setSerpStrategy(null);
        setSerpStrategyLoading(false);
        setSerpStrategyError(null);
        setRecommendedKeywords(null);
        setRecoLoading(false);
        setRecoError(null);
        setSustainableTopics(null);
        setSustainableTopicsError(null);
        setSustainableTopicsLoading(false);
        setNaverNews(null);
        setNewsLoading(false);
        setNewsError(null);
        setNewsBlogStrategy(null);
        setNewsBlogStrategyLoading(false);
        setNewsBlogStrategyError(null);
        
        setPromptResult(null);
        setPromptResultError(null);
        
        setFeature(newFeature);
    };

    const handleSearch = async (searchKeyword: string) => {
        if (!searchKeyword.trim()) return;

        // Reset all states
        setInitialLoad(false);
        setMainKeyword(searchKeyword);
        setResults([]);
        setError(null);
        setBlogTopics(null);
        setTopicError(null);
        setBlogStrategy(null);
        setStrategyError(null);
        setSerpStrategy(null);
        setSerpStrategyError(null);
        setRecommendedKeywords(null);
        setRecoError(null);
        setSustainableTopics(null);
        setSustainableTopicsError(null);
        setNaverNews(null);
        setNewsError(null);
        setNewsBlogStrategy(null);
        setNewsBlogStrategyLoading(false);
        setNewsBlogStrategyError(null);

        setPromptResult(null);
        setPromptResultError(null);

        if (feature === 'sustainable-topics') {
            setSustainableTopicsLoading(true);
            try {
                const data = await generateSustainableTopics(searchKeyword);
                setSustainableTopics(data);
            } catch (err) {
                if (err instanceof Error) {
                    setSustainableTopicsError(err.message);
                } else {
                    setSustainableTopicsError('지속 가능 주제를 생성하는 중 알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setSustainableTopicsLoading(false);
            }
        } else if (feature === 'naver-news') {
            setNewsLoading(true);
            try {
                const data = await fetchNaverNews(searchKeyword);
                setNaverNews(data);
            } catch (err) {
                if (err instanceof Error) {
                    setNewsError(err.message);
                } else {
                    setNewsError('실시간 뉴스를 가져오는 중 알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setNewsLoading(false);
            }
        } else {
            search(searchKeyword, feature, source);
        }
    };

    const handleKeywordClick = (clickedKeyword: string) => {
        setKeyword(clickedKeyword);
        handleSearch(clickedKeyword);
    };
    
    const handleTrendKeywordClick = (clickedKeyword: string) => {
        setFeature('competition');
        setKeyword(clickedKeyword);
        search(clickedKeyword, 'competition', source);
    };

    const isBlogResults = (data: (KeywordData | BlogPostData | KeywordMetrics | GoogleSerpData)[]): data is BlogPostData[] => {
        return data.length > 0 && 'url' in data[0];
    }
    
    const isCompetitionResult = (data: (KeywordData | BlogPostData | KeywordMetrics | GoogleSerpData)[]): data is KeywordMetrics[] => {
        return data.length > 0 && 'analysis' in data[0];
    }

    const isKeywordResults = (data: (KeywordData | BlogPostData | KeywordMetrics | GoogleSerpData)[]): data is KeywordData[] => {
        return data.length > 0 && 'keyword' in data[0] && !('url' in data[0]) && !('analysis' in data[0]);
    }

    const isGoogleSerpResult = (data: (KeywordData | BlogPostData | KeywordMetrics | GoogleSerpData)[]): data is GoogleSerpData[] => {
        return data.length > 0 && 'related_searches' in data[0] && 'people_also_ask' in data[0];
    }

    const handleGenerateTopics = async (type: 'main' | 'all') => {
        setTopicLoading(true);
        setTopicError(null);
        setBlogTopics(null);

        try {
            let topics;
            if (type === 'main') {
                setTopicTitle(`'${mainKeyword}' 키워드 블로그 주제 추천`);
                topics = await generateTopicsFromMainKeyword(mainKeyword);
            } else {
                const relatedKeywords = (results as KeywordData[]).map(r => r.keyword);
                setTopicTitle(`'${mainKeyword}' 및 자동완성 키워드 조합 블로그 주제 추천`);
                topics = await generateTopicsFromAllKeywords(mainKeyword, relatedKeywords);
            }
            setBlogTopics(topics);
        } catch (err) {
            if (err instanceof Error) {
                setTopicError(err.message);
            } else {
                setTopicError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setTopicLoading(false);
        }
    };
    
    const analyzeBlogStrategy = async () => {
        if (!loading && !error && feature === 'blogs' && isBlogResults(results) && results.length > 0) {
            setStrategyLoading(true);
            setStrategyError(null);
            try {
                const strategyData = await generateBlogStrategy(mainKeyword, results);
                setBlogStrategy(strategyData);
            } catch (err) {
                if (err instanceof Error) {
                    setStrategyError(err.message);
                } else {
                    setStrategyError('블로그 공략법을 생성하는 중 알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setStrategyLoading(false);
            }
        }
    };

    const analyzeSerpStrategy = async () => {
        if (!loading && !error && feature === 'related-keywords' && isGoogleSerpResult(results) && results.length > 0) {
            setSerpStrategyLoading(true);
            setSerpStrategyError(null);
            try {
                const strategyData = await generateSerpStrategy(mainKeyword, results[0]);
                setSerpStrategy(strategyData);
            } catch (err) {
                if (err instanceof Error) {
                    setSerpStrategyError(err.message);
                } else {
                    setSerpStrategyError('SERP 분석 리포트를 생성하는 중 알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setSerpStrategyLoading(false);
            }
        }
    };


    React.useEffect(() => {
        if (feature === 'blogs' && results.length > 0 && isBlogResults(results)) {
            analyzeBlogStrategy();
        } else {
            setBlogStrategy(null);
            setStrategyError(null);
        }
        
        if (feature === 'related-keywords' && results.length > 0 && isGoogleSerpResult(results)) {
            analyzeSerpStrategy();
        } else {
            setSerpStrategy(null);
            setSerpStrategyError(null);
        }

    }, [results, feature]);


    const handleFetchRecommendations = async () => {
        setRecoLoading(true);
        setRecoError(null);
        setRecommendedKeywords(null);

        // Clear all other states
        setResults([]);
        setError(null);
        setMainKeyword('');
        setBlogTopics(null);
        setTopicError(null);
        setBlogStrategy(null);
        setStrategyError(null);
        setSerpStrategy(null);
        setSerpStrategyError(null);
        setSustainableTopics(null);
        setSustainableTopicsError(null);
        setNaverNews(null);
        setNewsError(null);
        setNewsBlogStrategy(null);
        setNewsBlogStrategyError(null);
        setInitialLoad(false);

        setPromptResult(null);
        setPromptResultError(null);

        try {
            const recommendations = await fetchRecommendedKeywords();
            setRecommendedKeywords(recommendations);
        } catch (err) {
            if (err instanceof Error) {
                setRecoError(err.message);
            } else {
                setRecoError('전략 키워드를 분석하는 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setRecoLoading(false);
        }
    };
    
    const handleGenerateNewsStrategy = async () => {
        if (naverNews && naverNews.length > 0 && mainKeyword) {
            setNewsBlogStrategyLoading(true);
            setNewsBlogStrategyError(null);
            setNewsBlogStrategy(null);
            try {
                const strategy = await generateBlogStrategyFromNews(mainKeyword, naverNews);
                setNewsBlogStrategy(strategy);
            } catch (err) {
                if (err instanceof Error) {
                    setNewsBlogStrategyError(err.message);
                } else {
                    setNewsBlogStrategyError('뉴스 기반 블로그 전략 생성 중 알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setNewsBlogStrategyLoading(false);
            }
        }
    };

    const handlePromptExecute = async (promptText: string) => {
        // Clear all visible results from main features to make space for the prompt result
        setResults([]);
        setRecommendedKeywords(null);
        setSustainableTopics(null);
        setBlogTopics(null);
        setBlogStrategy(null);
        setSerpStrategy(null);
        setNaverNews(null);
        setNewsBlogStrategy(null);
        setInitialLoad(false); // So welcome/no-result messages don't conflict

        // Clear all main feature error states
        setError(null);
        setTopicError(null);
        setStrategyError(null);
        setSerpStrategyError(null);
        setRecoError(null);
        setSustainableTopicsError(null);
        setNewsError(null);
        setNewsBlogStrategyError(null);
        
        // Clear its own state first
        setPromptResult(null);
        setPromptResultError(null);
    
        setPromptResultLoading(true);
    
        try {
            const data = await executePromptAsCompetitionAnalysis(promptText);
            setPromptResult(data);
            setKeyword(data.keyword);
        } catch (err) {
            if (err instanceof Error) {
                setPromptResultError(err.message);
            } else {
                setPromptResultError('프롬프트 실행 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setPromptResultLoading(false);
        }
    };

    const handleReset = () => {
        setResults([]);
        setError(null);
        setInitialLoad(true);
        setSource('google');
        setFeature('competition');
        setKeyword('');
        setMainKeyword('');
        setBlogTopics(null);
        setTopicTitle('');
        setTopicLoading(false);
        setTopicError(null);
        setBlogStrategy(null);
        setStrategyLoading(false);
        setStrategyError(null);
        setSerpStrategy(null);
        setSerpStrategyLoading(false);
        setSerpStrategyError(null);
        setRecommendedKeywords(null);
        setRecoLoading(false);
        setRecoError(null);
        setSustainableTopics(null);
        setSustainableTopicsError(null);
        setSustainableTopicsLoading(false);
        setNaverNews(null);
        setNewsLoading(false);
        setNewsError(null);
        setNewsBlogStrategy(null);
        setNewsBlogStrategyLoading(false);
        setNewsBlogStrategyError(null);

        setPromptResult(null);
        setPromptResultError(null);
    };

    const getWelcomeMessage = () => {
        if (feature === 'keywords') return "분석할 키워드를 입력하고 '키워드 검색' 버튼을 눌러주세요.";
        if (feature === 'related-keywords') return "Google SERP를 분석하고 콘텐츠 전략을 수립할 기준 키워드를 입력해주세요.";
        if (feature === 'blogs') return "상위 10개 포스트를 조회할 키워드를 입력해주세요. (Naver API 키 설정 필요)";
        if (feature === 'naver-news') return "실시간으로 분석할 뉴스 키워드를 입력해주세요.";
        if (feature === 'sustainable-topics') return "하나의 키워드를 다양한 관점으로 확장할 '다각도 블로그 주제'를 발굴할 키워드를 입력해주세요.";
        if (feature === 'naver-trends') return "분석할 카테고리를 선택하여 Naver의 최신 인기 유입 검색어를 확인하세요.";
        return "경쟁력을 분석할 키워드를 입력하고 '키워드 검색' 버튼을 눌러주세요.";
    }
    
    const getNoResultsMessage = () => {
        if (feature === 'keywords') return "해당 키워드에 대한 자동완성검색어를 찾을 수 없습니다.";
        if (feature === 'related-keywords') return "해당 키워드에 대한 SERP 데이터(관련 검색어, PAA)를 찾을 수 없습니다.";
        if (feature === 'blogs') return "해당 키워드에 대한 블로그 포스트를 찾을 수 없습니다.";
        if (feature === 'naver-news') return "해당 키워드에 대한 최신 뉴스를 찾을 수 없습니다.";
        if (feature === 'sustainable-topics') return "해당 키워드에 대한 '다각도 블로그 주제'를 발굴할 수 없습니다.";
        if (feature === 'naver-trends') return "트렌드 데이터를 가져올 수 없습니다.";
        return "키워드 경쟁력 분석 결과를 가져올 수 없습니다. 다른 키워드로 시도해보세요.";
    }

    const anyLoading = loading || recoLoading || sustainableTopicsLoading || promptResultLoading || newsLoading || newsBlogStrategyLoading;

    return (
        <div className="bg-slate-900 text-white font-sans h-screen flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex flex-col flex-grow p-4 sm:p-8 min-h-0">
                <header className="relative text-center mb-8 shrink-0">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-2 title-effect">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            키워드 파이터
                        </span>
                        <span className="text-yellow-400"> for Gemini</span>
                    </h1>
                    <p className="text-lg text-slate-400">자동완성검색어, 블로그 순위, 키워드 경쟁력 분석을 한번에</p>
                    <div className="absolute top-0 right-0 flex items-center gap-2">
                        <button 
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center justify-center h-10 w-10"
                            aria-label="설정"
                            title="설정"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button 
                            onClick={() => setIsHelpModalOpen(true)}
                            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center justify-center h-10 w-10"
                            aria-label="사용법 보기"
                            title="사용법 보기"
                        >
                           <span className="text-xl" role="img" aria-label="노트 아이콘">📝</span>
                        </button>
                    </div>
                </header>
                
                <div className="flex flex-col lg:flex-row gap-8 flex-grow min-h-0">
                    <main className="flex-grow lg:w-2/3 overflow-y-auto custom-scrollbar">
                        <CurrentStatus />
                        <FeatureSelector 
                            selectedFeature={feature} 
                            onSelectFeature={handleFeatureSelect} 
                            loading={anyLoading}
                            onFetchRecommendations={handleFetchRecommendations}
                            recoLoading={recoLoading}
                            onReset={handleReset}
                        />
                        {feature === 'keywords' && (
                           <SearchEngineSelector selectedSource={source} onSelectSource={setSource} loading={anyLoading} />
                        )}
                         {feature !== 'naver-trends' && (
                            <KeywordInputForm onSearch={handleSearch} loading={anyLoading} keyword={keyword} setKeyword={setKeyword} feature={feature} />
                        )}
                        
                        <div className="mt-8 min-h-[300px]">
                            {feature === 'naver-trends' ? (
                                <NaverTrendsResults onKeywordClick={handleTrendKeywordClick} />
                            ) : (
                                <>
                                    {promptResultLoading && <LoadingSpinner />}
                                    {promptResultError && <ErrorMessage message={promptResultError} />}
                                    {promptResult && <PromptResultDisplay data={promptResult} />}
                                    
                                    {!promptResultLoading && !promptResultError && !promptResult && (
                                        <>
                                            {recoLoading && <LoadingSpinner />}
                                            {recoError && <ErrorMessage message={recoError} />}
                                            {recommendedKeywords && <RecommendedKeywordsDisplay data={recommendedKeywords} />}

                                            {!recoLoading && !recoError && !recommendedKeywords && (
                                                <>
                                                    {(loading || sustainableTopicsLoading || newsLoading) && <LoadingSpinner />}
                                                    {error && <ErrorMessage message={error} />}
                                                    {sustainableTopicsError && <ErrorMessage message={sustainableTopicsError} />}
                                                    {newsError && <ErrorMessage message={newsError} />}
                                                    
                                                    {!loading && !error && !sustainableTopicsLoading && !sustainableTopicsError && !newsLoading && !newsError &&(
                                                        <>
                                                            {isCompetitionResult(results) && <CompetitionAnalysisResults data={results[0]} />}
                                                            {isBlogResults(results) && (
                                                                <div className="space-y-6">
                                                                    <BlogResultsTable data={results} />
                                                                    {strategyLoading && <LoadingSpinner />}
                                                                    {strategyError && <ErrorMessage message={strategyError} />}
                                                                    {blogStrategy && <BlogStrategyReport data={blogStrategy} />}
                                                                </div>
                                                            )}
                                                            {isGoogleSerpResult(results) && (
                                                                <div className="space-y-6">
                                                                    <ResultsTable
                                                                        data={results[0].related_searches.map((kw, i) => ({ id: i + 1, keyword: kw }))}
                                                                        onKeywordClick={handleKeywordClick}
                                                                        onGenerateTopicsFromMain={() => {}}
                                                                        onGenerateTopicsFromAll={() => {}}
                                                                        loading={false}
                                                                        feature={feature}
                                                                    />
                                                                    <PeopleAlsoAsk data={results[0].people_also_ask} />
                                                                    {serpStrategyLoading && <LoadingSpinner />}
                                                                    {serpStrategyError && <ErrorMessage message={serpStrategyError} />}
                                                                    {serpStrategy && <SerpStrategyReport data={serpStrategy} />}
                                                                </div>
                                                            )}
                                                            {isKeywordResults(results) && (
                                                                <div className="space-y-6">
                                                                    <ResultsTable 
                                                                        data={results}
                                                                        onKeywordClick={handleKeywordClick}
                                                                        onGenerateTopicsFromMain={() => handleGenerateTopics('main')}
                                                                        onGenerateTopicsFromAll={() => handleGenerateTopics('all')}
                                                                        loading={topicLoading}
                                                                        feature={feature}
                                                                    />
                                                                    {topicLoading && <LoadingSpinner />}
                                                                    {topicError && <ErrorMessage message={topicError} />}
                                                                    {blogTopics && <BlogTopicSuggestions title={topicTitle} data={blogTopics} />}
                                                                </div>
                                                            )}
                                                            {sustainableTopics && <SustainableTopicsResults data={sustainableTopics} />}
                                                            
                                                            {naverNews && (
                                                                <div className="space-y-6">
                                                                    <NaverNewsResults
                                                                        data={naverNews}
                                                                        onGenerateStrategy={handleGenerateNewsStrategy}
                                                                        strategyLoading={newsBlogStrategyLoading}
                                                                        hasStrategy={!!newsBlogStrategy}
                                                                    />
                                                                    {newsBlogStrategyLoading && <LoadingSpinner />}
                                                                    {newsBlogStrategyError && <ErrorMessage message={newsBlogStrategyError} />}
                                                                    {newsBlogStrategy && <NewsBlogStrategyReport data={newsBlogStrategy} />}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                
                                                    {initialLoad && !anyLoading && !error && !recommendedKeywords && !sustainableTopicsError && !naverNews && (
                                                        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-md">
                                                            <p className="text-slate-400">{getWelcomeMessage()}</p>
                                                        </div>
                                                    )}
                                                    {!initialLoad && results.length === 0 && !sustainableTopics && !anyLoading && !error && !recommendedKeywords && !sustainableTopicsError && !naverNews && !newsBlogStrategy && (
                                                        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-md">
                                                            <p className="text-slate-400">{getNoResultsMessage()}</p>
                                                        </div>
                                                    )}
                                                </>
                                             )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </main>

                    <aside className="lg:w-1/3 overflow-y-auto custom-scrollbar">
                        <RealtimeKeywordsSidebar onPromptExecute={handlePromptExecute} />
                    </aside>
                </div>
                
                <footer className="mt-auto pt-4 text-slate-500 text-xs shrink-0 flex items-center justify-between">
                    <p>개발 및 운영: AIFACT GPT-PARK</p>
                    <a 
                        href="https://www.youtube.com/@AIFACT-GPTPARK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-3 rounded-md transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        <span>채널바로가기</span>
                    </a>
                </footer>
            </div>
            {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} />}
            {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
        </div>
    );
};

export default App;