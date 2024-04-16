import { useEffect, useRef } from 'react';
import { Input } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useSearchContext } from '../../contexts/SearchContext';
import { useStorage } from '../../contexts/AppContext';

const Search = () => {

    const inputRef = useRef<HTMLInputElement>(null);
    const storage = useStorage();
    const { currentNavTab } = useNavContext();
    const { updateSearchData } = useSearchContext();

    useEffect(() => {
        inputRef?.current?.focus();
    }, []);

    const getWindowsListSource = (navTab: number): Array<any> => {
        return (navTab === 0)
            ? storage?.openedWindows?.filter(window => !window.incognito)
            : (navTab === 1)
                ? storage?.savedWindows
                : (navTab === 2)
                    ? storage?.openedWindows?.filter(window => window.incognito)
                    : []
    }

    useEffect(() => {
        if(inputRef.current) {
            inputRef.current.value = '';
        }

        updateSearchData(getWindowsListSource(currentNavTab));

    }, [currentNavTab, storage.openedWindows, storage.savedWindows]);

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.currentTarget.value.length > 0) {
            search(event.currentTarget.value.toLocaleLowerCase());
        }
    }

    const search = (searchValue: string) => {
        const filteredWindows = getWindowsListSource(currentNavTab)?.filter(window => window?.tabs?.find((tab: any) => tab.title.toLocaleLowerCase().includes(searchValue)));
        const filteredTabs: any = [];

        filteredWindows.forEach(window => {
            window.tabs.forEach((tab: any) => {
                if (tab.title.toLocaleLowerCase().includes(searchValue)) {
                    filteredTabs.push(tab);
                }
            })
        });

        const searchResults = {
            id: 'searchResults',
            searchValue: searchValue,
            incognito: storage?.currentWindow?.incognito,
            tabs: filteredTabs,
        }

        updateSearchData([searchResults]);
    }

    return (
        <Input
            type='search'
            placeholder='Search'
            innerRef={inputRef}
            onKeyDown={(e) => handleSearch(e)}
            onChange={(e) => {
                if (e.currentTarget.value.length === 0) {
                    updateSearchData([]);
                }
            }}
        />
    )
}

export default Search