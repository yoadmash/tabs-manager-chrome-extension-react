import { useEffect, useRef, useState } from 'react';
import { Input, Label } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useSearchContext } from '../../contexts/SearchContext';
import { useStorage } from '../../contexts/AppContext';

const Search = () => {

    const [exactMatch, setExactMatch] = useState(true);
    const [searchEvent, setSearchEvent] = useState<React.KeyboardEvent<HTMLInputElement> | null>(null);

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
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        updateSearchData(getWindowsListSource(currentNavTab));

    }, [currentNavTab, storage.openedWindows, storage.savedWindows]);

    useEffect(() => {
        if (searchEvent) {
            handleSearch(searchEvent);
        }
    }, [exactMatch]);

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        setSearchEvent({ ...event });
        if (event.key === 'Enter' && event.currentTarget.value.length > 0) {
            const searchValue: string = event.currentTarget.value.toLocaleLowerCase();
            const useKeywords = /^".*"$/.test(searchValue);
            const search_string_or_keywords: string[] = useKeywords
                ? [searchValue.toLowerCase().substring(1, searchValue.length - 1)] // use search value
                : searchValue.split(' ').filter(keyword => keyword.length) // break to keywords
            search(search_string_or_keywords, useKeywords);
        }
    }

    const search = (search_string_or_keywords: string[], useKeyWordsOnly?: boolean) => {
        const filteredWindows = getWindowsListSource(currentNavTab)
            ?.filter(window => window?.tabs
                ?.find((tab: any) => {
                    const tabTitleWords = useKeyWordsOnly
                        ? tab.title.toLowerCase()
                        : tab.title.toLowerCase().split(' ').filter((word: string) => word.length);

                    if (search_string_or_keywords.some((searchWord: string) => tabTitleWords.includes(searchWord))) {
                        return tab;
                    }
                }));

        const filteredTabs: any = [];

        filteredWindows.forEach(window => {
            window.tabs.forEach((tab: any) => {
                const tabTitleWords = useKeyWordsOnly
                    ? tab.title.toLowerCase()
                    : tab.title.toLowerCase().split(' ').filter((word: string) => word.length);

                if (!exactMatch && search_string_or_keywords.some((word: string) => tabTitleWords.includes(word))) {
                    filteredTabs.push(tab);
                } else if (search_string_or_keywords.every((word: string) => tabTitleWords.includes(word))) {
                    filteredTabs.push(tab);
                }
            })
        });

        const searchResults = {
            id: 'searchResults',
            searchValue: search_string_or_keywords,
            incognito: storage?.currentWindow?.incognito,
            tabs: filteredTabs,
        }

        updateSearchData([searchResults]);
        inputRef.current?.blur();
    }

    return (
        <div className='d-flex align-items-center w-100 flex-wrap'>
            <Input
                type='search'
                placeholder='Search'
                spellCheck={false}
                innerRef={inputRef}
                onKeyDown={(e) => handleSearch(e)}
                onChange={(e) => {
                    if (e.currentTarget.value.length === 0) {
                        updateSearchData([]);
                    }
                }}
            />
            <Label className='d-flex align-items-center gap-2 mt-2'>
                <Input
                    type='checkbox'
                    checked={exactMatch}
                    onChange={() => setExactMatch(!exactMatch)}
                />
                Match all keywords
            </Label>
        </div>
    )
}

export default Search