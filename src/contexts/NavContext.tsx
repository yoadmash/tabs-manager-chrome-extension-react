import { ReactNode, createContext, useState } from "react";

export const NavContext = createContext({
    currentNavTab: 0,
    setCurrentNavTab: (currentNavTab: number) => { }
})

interface Props {
    children: ReactNode
}

export const NavProvider = ({ children }: Props) => {
    const [currentNavTab, setCurrentNavTab] = useState(0);
    return (
        <NavContext.Provider value={{
            currentNavTab, setCurrentNavTab
        }}>
            {children}
        </NavContext.Provider>
    )
}