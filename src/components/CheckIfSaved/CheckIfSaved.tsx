import { useEffect, useState } from 'react';
import { useStorage } from '../../contexts/AppContext';

interface Props {
    title: string;
    url: string;
}

const CheckIfSaved = ({ title, url }: Props) => {

    const storage = useStorage();
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any[] | null>(null);

    const searchForTabs = () => {
        const savedWindows = storage?.savedWindows;
        const all_tabs: any = [];

        savedWindows.map(sw => all_tabs.push(...sw?.tabs));

        const titleBrokeToWords = title?.toLowerCase().split(/[.,:;\s]/).filter((word: string) => word.length);

        const results = all_tabs?.filter((tab: any) => titleBrokeToWords?.every(word => tab.title.toLowerCase().includes(word)) || url === tab.url);
        setResults(results);
    }

    useEffect(() => {
        if (!storage) {
            setError('Unable to access storage');
            return;
        }

        if (title && url) {
            searchForTabs();
        }

    }, [title, url, storage]);

    return (
        <>
            {
                !error
                    ? <div className='check-if-saved'>
                        {!results?.length
                            ? <p>Not saved</p>
                            : results?.map(tab => <div key={tab.id} className='tab'>{tab.id}</div>)
                        }
                    </div>
                    : <p>{error}</p>
            }
        </>
    )
}

export default CheckIfSaved