import { ReactNode, createContext, useContext, useState } from "react";

interface NavState {
    currentNavTab: number;
    updateCurrentNavTab: (tabIndex: number) => void;
}

const NavContext = createContext<NavState | undefined>(undefined);

interface Props {
    children: ReactNode
}

export const NavProvider = ({ children }: Props) => {
    const [currentNavTab, setCurrentNavTab] = useState<number>(0);

    const updateCurrentNavTab = (tabIndex: number) => {
        setCurrentNavTab(tabIndex);
    }

    const contextValue: NavState = {
        currentNavTab,
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