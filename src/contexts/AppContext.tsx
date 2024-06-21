import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface Storage {
    extension_uid: string;
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
        duplicated_tab_active: boolean;
        show_incognito: boolean;
        allow_background_update: boolean;
        allow_window_title_set_onsave: boolean;
        hide_on_remote: boolean;
        delete_all_from_firebase: boolean;
        access_options_from_popup: boolean;
        windows_per_page: number;
        force_firebase_disconnect: boolean;
    }
    firebaseConfig: boolean;
    popup: {
        id: number;
        incognito: boolean;
    };
    savedWindows: SavedWindow[];
    update: (key: string, value: any) => void;
    size: () => string;
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

    chrome.runtime?.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.from === 'service' && storage?.options?.allow_background_update) {
            await getStorage();
        }
        return true;
    })

    const update = async (key: string, value: any) => {
        if (key !== 'storage') {
            setStorage((prev: any) => {
                prev[key] = value;
                chrome.storage?.local.set(prev);
                return { ...prev };
            });
        } else {
            getStorage();
        }
    }

    const size = () => {
        const size: number = new Blob([JSON.stringify(storage)]).size;
        const sizeToMB: number = Number((size / Math.pow(1000, 2)).toFixed(2)) * 1;
        return `${sizeToMB}MB / 10MB`;
    }

    const contextValue: any = {
        ...storage,
        update,
        size
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