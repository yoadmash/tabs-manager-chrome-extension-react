import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface Storage {
    clipboard: any;
    currentWindow: {
        id: number
        incognito: boolean
    };
    openedWindows: any[];
    options: {
        dark_theme: boolean;
        show_favicons: boolean;
        auto_scroll: boolean;
        hide_saved: boolean;
        bypass_cache: boolean;
        dupilcated_tab_active: boolean;
        show_incognito: boolean;
    }
    popup: {
        id: number;
        incognito: boolean;
    };
    savedWindows: SavedWindow[];
    update: (key: string, value: any) => void;
}

interface SavedWindow {
    id: number;
    incognito: boolean;
    tabs: Tab[]
}

interface Tab {
    favIconUrl: string;
    id: number;
    incognito: boolean;
    title: string;
    url: string;
    windowId: string;
}

const StorageContext = createContext<Storage | undefined>(undefined);

interface Props {
    children: ReactNode
}

export const StorageProvider = ({ children }: Props) => {
    const [storage, setStorage] = useState<any>({});

    const getStorage = async () => {
        await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
        const storage = await chrome.storage?.local.get();
        setStorage({ ...storage });
    }

    useEffect(() => {
        getStorage();
    }, []);

    chrome.runtime?.onMessage.addListener((message, sender, sendResponse) => {
        if (message.from === 'service') {
            getStorage();
            return true;
        }
    })

    const update = async (key: string, value: any) => {
        if (key !== 'storage') {
            setStorage((prev: any) => {
                prev[key] = value;
                chrome.storage?.local.set(prev);
                return { ...prev };
            });
        } else {
            await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
            const storage = await chrome.storage?.local.get();
            setStorage({ ...storage });

        }
    }

    const contextValue: any = {
        ...storage,
        update
    }

    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    )
}

export function useStorage() {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
}