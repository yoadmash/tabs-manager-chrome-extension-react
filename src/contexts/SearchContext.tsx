import { ReactNode, createContext, useContext, useState } from "react";

interface SearchState {
    searchData: Array<any>;
    updateSearchData: (data: Array<any>) => void;
}

const SearchContext = createContext<SearchState | undefined>(undefined);

interface Props {
    children: ReactNode
}

export const SearchProvider = ({ children }: Props) => {
    const [searchData, setSearchData] = useState<Array<any>>([]);

    const updateSearchData = (data: Array<any>) => {
        setSearchData(data);
    }

    const contextValue: SearchState = {
        searchData,
        updateSearchData
    }

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    )
}

export function useSearchContext() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
}