import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useStorage } from "./AppContext";

interface NavState {
    currentNavTab: number;
    prevNavTab: number;
    updateCurrentNavTab: (tabIndex: number) => void;
}

const NavContext = createContext<NavState | undefined>(undefined);

interface Props {
    children: ReactNode
}

export const NavProvider = ({ children }: Props) => {
    const storage = useStorage();

    const [currentNavTab, setCurrentNavTab] = useState<number>(-1);
    const [prevNavTab, setPrevNavTab] = useState<number>(-1);

    useEffect(() => {
        if (currentNavTab === -1 && storage?.currentWindow) {
            const urlParams = new URLSearchParams(window.location.search);
            const view = urlParams.get('view');
            const popup = urlParams.get('popup');

            const isPopup = (popup === 'true');
            const isOptionPage = (view === 'options');
            const isIncognito = storage?.currentWindow?.incognito;

            setCurrentNavTab(
                isPopup
                    ? 1
                    : isIncognito
                        ? 2
                        : isOptionPage
                            ? 3
                            : 0
            )
        }
    }, [storage?.currentWindow, currentNavTab]);

    const updateCurrentNavTab = (tabIndex: number) => {
        setCurrentNavTab(prev => {
            setPrevNavTab(prev);
            return tabIndex;
        });
    }

    const contextValue: NavState = {
        currentNavTab,
        prevNavTab,
        updateCurrentNavTab
    }

    return (
        <NavContext.Provider value={contextValue}>
            {children}
        </NavContext.Provider>
    )
}

export function useNavContext() {
    const context = useContext(NavContext);
    if (!context) {
        throw new Error('useNavContext must be used within a NavProvider');
    }
    return context;
}