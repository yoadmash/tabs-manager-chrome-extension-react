import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface Storage {
    clipboard: string;
    currentWindow: {
        id: number
        incognito: boolean
    };
    openedWindows: any[];
    options: {
        auto_scroll: boolean;
        show_incognito: false;
    }
    popup: number;
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

    useEffect(() => {
        const getStorage = async () => {
            const data = await fetch('/example_data/data.json');
            setStorage(await data.json());
        }

        getStorage();
    }, []);

    const update = (key: string, value: any) => {
        setStorage((prev: any) => {
            prev[key] = value;
            console.log(prev);
            return { ...prev };
        });
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