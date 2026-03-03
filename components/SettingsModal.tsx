import React, { useState, useEffect, useRef } from 'react';
import { saveNaverApiKeys, loadNaverApiKeys, clearNaverApiKeys } from '../services/apiKeys';
import { testNaverApiConnection } from '../services/keywordService';

interface SettingsModalProps {
    onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [testStatus, setTestStatus] = useState<TestStatus>('idle');
    const [testMessage, setTestMessage] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const keys = loadNaverApiKeys();
        if (keys) {
            setClientId(keys.clientId);
            setClientSecret(keys.clientSecret);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleTestConnection = async () => {
        setTestStatus('testing');
        setTestMessage('');
        try {
            await testNaverApiConnection(clientId, clientSecret);
            setTestStatus('success');
            setTestMessage('성공적으로 연결되었습니다!');
        } catch (error) {
            setTestStatus('error');
            if (error instanceof Error) {
                setTestMessage(`연결 실패: ${error.message}`);
            } else {
                setTestMessage('알 수 없는 오류로 연결에 실패했습니다.');
            }
        }
    };
    
    const handleClear = () => {
        clearNaverApiKeys();
        setClientId('');
        setClientSecret('');
        setTestStatus('idle');
        setTestMessage('API 키가 삭제되었습니다.');
    };

    const handleSave = () => {
        saveNaverApiKeys(clientId, clientSecret);
        onClose();
    };

    const getStatusColor = () => {
        if (testStatus === 'success') return 'text-green-400';
        if (testStatus === 'error') return 'text-red-400';
        return 'text-slate-400';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div ref={modalRef} className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-slate-700 shrink-0">
                    <h2 className="text-xl font-bold text-cyan-400">Naver API 설정</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">
                        '상위 블로그 분석' 기능을 사용하려면 Naver 검색 API 키가 필요합니다. 
                        <a href="https://developers.naver.com/apps/#/register" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline"> Naver Developers</a>에서 애플리케이션을 등록하고 클라이언트 ID와 시크릿을 발급받으세요.
                    </p>
                    <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-slate-300 mb-1">
                            클라이언트 ID (Client ID)
                        </label>
                        <input
                            id="clientId"
                            type="text"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full bg-slate-800 text-white placeholder-slate-500 border-2 border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="clientSecret" className="block text-sm font-medium text-slate-300 mb-1">
                            클라이언트 시크릿 (Client Secret)
                        </label>
                        <input
                            id="clientSecret"
                            type="password"
                            value={clientSecret}
                            onChange={(e) => setClientSecret(e.target.value)}
                            className="w-full bg-slate-800 text-white placeholder-slate-500 border-2 border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleTestConnection}
                            disabled={!clientId || !clientSecret || testStatus === 'testing'}
                            className="flex-1 bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center"
                        >
                            {testStatus === 'testing' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    테스트 중...
                                </>
                            ) : (
                                "연결 테스트"
                            )}
                        </button>
                        <div className={`text-sm h-5 ${getStatusColor()}`}>{testMessage}</div>
                    </div>
                </main>
                <footer className="p-4 flex justify-between items-center border-t border-slate-700 shrink-0 bg-slate-800/50">
                    <button 
                        onClick={handleClear}
                        className="text-sm text-red-400 hover:text-red-300 hover:underline focus:outline-none"
                    >
                        저장된 키 삭제
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!clientId || !clientSecret}
                        className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-md hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-300"
                    >
                        저장
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;
