import { useEffect, useRef, useState } from 'react';
import { Input, Label } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useSearchContext } from '../../contexts/SearchContext';
import { useStorage } from '../../contexts/AppContext';

const Search = () => {

    const [exactMatch, setExactMatch] = useState(true);
    const [searchTarget, setSearchTarget] = useState(-1);
    const [searchBy, setSearchBy] = useState<'title' | 'url'>('title');
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
    }, [exactMatch, searchTarget, searchBy]);

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        setSearchEvent({ ...event });
        if (event.key === 'Enter' && event.currentTarget.value.length > 0) {
            const searchValue: string = event.currentTarget.value.toLocaleLowerCase();
            const useKeywords = searchBy === 'url' || /^".*"$/.test(searchValue);
            const search_string_or_keywords: string[] = useKeywords
                ? [searchValue.toLowerCase().replace(/^"|"$/g, '')] // use search value
                : searchValue.split(/[.,:;\s]/).filter(keyword => keyword.length) // break to keywords exclude commas and spaces
            search(search_string_or_keywords, useKeywords);
        }
    }

    const search = (search_string_or_keywords: string[], useKeyWordsOnly?: boolean) => {
        let filteredWindows = [];

        if (searchTarget === -1) {
            filteredWindows = getWindowsListSource(currentNavTab)
                ?.filter(window => window?.tabs
                    ?.find((tab: any) => {
                        if (searchBy === 'title') {
                            const tabTitleWords = useKeyWordsOnly
                                ? tab.title.toLowerCase()
                                : tab.title.toLowerCase().split(/[.,:;\s]/).filter((word: string) => word.length);

                            if (search_string_or_keywords.some((searchWord: string) => tabTitleWords.includes(searchWord))) {
                                return tab;
                            }
                        } else if (searchBy === 'url') {
                            const tabUrl = tab.url?.toLowerCase();
                            if (search_string_or_keywords.some((searchWord: string) => tabUrl?.includes(searchWord))) {
                                return tab;
                            }
                        }
                        return null
                    }));
        } else if (searchTarget > -1) {
            filteredWindows[0] = storage?.savedWindows[searchTarget];
        }

        const filteredTabs: any = [];

        filteredWindows.forEach(window => {
            window.tabs.forEach((tab: any) => {
                if (searchBy === 'title') {
                    const tabTitleWords = useKeyWordsOnly
                        ? tab.title.toLowerCase()
                        : tab.title.toLowerCase().split(/[.,:;\s]/).filter((word: string) => word.length);

                    if (!exactMatch && search_string_or_keywords.some((word: string) => tabTitleWords.includes(word))) {
                        filteredTabs.push(tab);
                    } else if (search_string_or_keywords.every((word: string) => tabTitleWords.includes(word))) {
                        filteredTabs.push(tab);
                    }
                } else if (searchBy === 'url') {
                    const tabUrl = tab.url?.toLowerCase();
                    if (search_string_or_keywords.some((searchWord: string) => tabUrl?.includes(searchWord))) {
                        filteredTabs.push(tab);
                    }
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
    }

    return (
        <div className='d-flex align-items-center w-100 flex-wrap'>
            <div className="d-flex w-100 gap-2">
                {currentNavTab === 1 &&
                    <>
                        <Input
                            type='select'
                            style={{ width: '20%' }}
                            onChange={(e) => (e.target.value === 'title' || e.target.value === 'url') && setSearchBy(e.target.value)}
                        >
                            <option value={'title'}>Title</option>
                            <option value={'url'}>URL</option>
                        </Input>
                        <Input
                            type='select'
                            style={{ width: '20%' }}
                            onChange={(e) => setSearchTarget(Number(e.target.value))}
                        >
                            <option value={-1}>All</option>
                            {storage?.savedWindows?.map((sw, index) => <option key={index} value={index}>{sw.id}</option>)}
                        </Input>
                    </>
                }
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
            </div>
            {
                <Label className='d-flex align-items-center gap-2 mt-2'>
                    <Input
                        disabled={searchBy === 'url'}
                        type='checkbox'
                        checked={searchBy !== 'url' && exactMatch}
                        onChange={() => setExactMatch(!exactMatch)}
                    />
                    Match all keywords
                </Label>
            }
        </div >
    )
}

export default Search