export interface NaverApiKeys {
    clientId: string;
    clientSecret: string;
}

const NAVER_API_KEYS_STORAGE_KEY = 'naver_api_keys_encrypted';

// Simple obfuscation using base64 encoding to prevent casual viewing of keys in local storage.
const encode = (data: string): string => {
    try {
        return btoa(encodeURIComponent(data));
    } catch (e) {
        console.error("Failed to encode data:", e);
        return "";
    }
};

const decode = (encoded: string): string => {
    try {
        return decodeURIComponent(atob(encoded));
    } catch (e) {
        console.error("Failed to decode data:", e);
        return "";
    }
};

export const saveNaverApiKeys = (clientId: string, clientSecret: string): void => {
    try {
        const keys: NaverApiKeys = { clientId, clientSecret };
        const jsonString = JSON.stringify(keys);
        const encoded = encode(jsonString);
        if (encoded) {
            localStorage.setItem(NAVER_API_KEYS_STORAGE_KEY, encoded);
        }
    } catch (error) {
        console.error("Failed to save Naver API keys:", error);
    }
};

export const loadNaverApiKeys = (): NaverApiKeys | null => {
    try {
        const encoded = localStorage.getItem(NAVER_API_KEYS_STORAGE_KEY);
        if (!encoded) {
            return null;
        }
        const jsonString = decode(encoded);
        if (jsonString) {
            return JSON.parse(jsonString) as NaverApiKeys;
        }
        return null;
    } catch (error) {
        console.error("Failed to load or parse Naver API keys:", error);
        // Clear corrupted data
        localStorage.removeItem(NAVER_API_KEYS_STORAGE_KEY);
        return null;
    }
};

export const clearNaverApiKeys = (): void => {
    try {
        localStorage.removeItem(NAVER_API_KEYS_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear Naver API keys:", error);
    }
};
