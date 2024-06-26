import { faArrowsRotate, faExpand } from '@fortawesome/free-solid-svg-icons'
import { useStorage } from '../../contexts/AppContext'
import { useEffect, useState } from 'react';
import Icon from '../Icon/Icon';

const RefreshOrExpandBtn = () => {

    const storage = useStorage();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setExpanded(storage?.popup !== null);
    }, [storage, expanded, setExpanded]);

    const action = () => {
        if (expanded) {
            window.location.reload();
        } else {
            chrome.windows?.create({
                focused: true,
                state: 'normal',
                type: 'popup',
                top: window.screen.height / 2 - 800 / 2,
                left: window.screen.width / 2 - 700 / 2,
                height: 800,
                width: 700,
                url: `js/index.html`
            }).then(async popup => {
                chrome.storage.local.set({ popup: { id: popup.id, incognito: false } });
                window.close();
            });
        }
    }

    return (
        <>
            <Icon
                id='refresh-expand-btn'
                icon={expanded ? faArrowsRotate : faExpand}
                title={expanded ? 'Refresh' : 'Expand'}
                onClick={() => action()}
            />
        </>
    )
}

export default RefreshOrExpandBtn