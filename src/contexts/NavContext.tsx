import { ReactNode, createContext, useContext, useState } from "react";

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
    const [currentNavTab, setCurrentNavTab] = useState<number>(process.env.NODE_ENV !== 'development' ? 0 : 1);
    const [prevNavTab, setPrevNavTab] = useState<number>(-1);

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
    if(!context) {
        throw new Error('useNavContext must be used within a NavProvider');
    }
    return context;
}