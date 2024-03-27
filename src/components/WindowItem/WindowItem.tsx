import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faFloppyDisk, faFolderPlus, faCopy, faArrowsRotate, faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import TabItem from '../TabItem/TabItem'
import { useState } from 'react'
import { useStorage } from '../../contexts/AppContext'
import { useNavContext } from '../../contexts/NavContext'

interface Props {
    windowObj?: any
    savedWindow?: boolean;
}

const WindowItem = ({ windowObj, savedWindow }: Props) => {

    const storage = useStorage();
    const { updateCurrentNavTab } = useNavContext();
    const [showActions, setShowActions] = useState(false);
    const [selectedTabs, setSelectedTabs] = useState(Array<number>);
    const [checked, setChecked] = useState(false);

    const updateSelectedTabs = (tabId: number, checked: boolean) => {
        if (checked) {
            setSelectedTabs([...selectedTabs, tabId]);
        } else {
            setSelectedTabs(selectedTabs.filter(id => id !== tabId));
        }
    }

    const navigate = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (!savedWindow) {
            if (windowObj.id !== storage?.currentWindow?.id) {
                chrome.windows?.update(windowObj.id, { focused: true })
                storage.update('storage', null);
            }
        } else {
            const tabs_urls: Array<string> = [];
            windowObj?.tabs?.forEach((tab: any) => {
                if (!tab.url.match('https://gxcorner.games/')) {
                    tabs_urls.push(tab.url);
                }
            });
            chrome.windows?.create({
                focused: true,
                incognito: windowObj.incognito,
                state: 'maximized',
                url: tabs_urls
            })
        }
    }

    const checkAllTabs = (state: boolean) => {
        if (state) {
            const allTabsIds: Array<number> = [];
            windowObj.tabs.forEach((tab: any) => {
                allTabsIds.push(tab.id);
            });
            setSelectedTabs(allTabsIds);
        } else {
            setSelectedTabs([]);
        }
        setChecked(state);
    }

    const saveWindow = () => {
        const formattedWindow: any = formatWindowObj(windowObj, true);
        const lastSavedWindowIdx = storage?.savedWindows?.length - 1;
        formattedWindow.id = (storage?.savedWindows[lastSavedWindowIdx]) ? storage?.savedWindows[lastSavedWindowIdx].id + 1 : 100;
        const savedWindows = [...storage?.savedWindows, formattedWindow];
        storage.update('savedWindows', savedWindows);
    }

    const copyTabs = () => {
        const formattedWindow = formatWindowObj(windowObj, false);
        navigator.clipboard.writeText(JSON.stringify(formattedWindow.tabs));
    }

    const refresh = () => {
        if (!selectedTabs.length) {
            windowObj.tabs.forEach((tab: any) => {
                chrome.tabs?.reload(tab.id);
            });
        } else {
            selectedTabs.forEach((tab: any) => {
                chrome.tabs?.reload(tab);
            });
        }
    }

    const closeOrDelete = () => {
        if (!savedWindow) {
            const openedWindows: any = storage?.openedWindows;

            if (!selectedTabs.length || selectedTabs.length === windowObj.tabs.length) {
                const filteredWindows: [] = openedWindows?.filter((window: any) => window.id !== windowObj.id);
                storage.update('openedWindows', filteredWindows);
                chrome.windows?.remove(windowObj.id);
            } else {
                selectedTabs.forEach(tabId => {
                    chrome.tabs?.remove(tabId);
                });

                const currentWindowIdx = openedWindows.findIndex((window: any) => window.id === windowObj.id);
                const filteredTabs = openedWindows[currentWindowIdx].tabs.filter((tab: any) => !selectedTabs.includes(tab.id));

                openedWindows[currentWindowIdx].tabs = filteredTabs;
                storage.update('openedWindows', openedWindows);
                setChecked(false);
            }
        } else {
            let savedWindows = storage?.savedWindows;
            savedWindows = savedWindows?.filter(window => window.id !== windowObj.id);
            storage.update('savedWindows', savedWindows);
            if (savedWindows.length === 0) {
                updateCurrentNavTab(0);
            }
        }
    }

    const formatWindowObj = (windowObj: any, isSavedWindow: boolean): any => {
        const formattedWindowObj: any = {};
        const allowedWindowProps = ['id', 'incognito', 'tabs'];
        const allowedTabProps = ['favIconUrl', 'id', 'incognito', 'title', 'url', 'windowId'];

        for (const window_key in windowObj) {
            if (allowedWindowProps.includes(window_key)) {
                if (window_key === 'tabs') {
                    formattedWindowObj['tabs'] = [];
                    windowObj['tabs'].forEach((tab: any, index: number) => {
                        const formattedTab: any = {};
                        for (const tab_key in tab) {
                            if (allowedTabProps.includes(tab_key)) {
                                formattedTab[tab_key] =
                                    (tab_key === 'windowId') ? windowObj.id
                                        : (tab_key === 'id' && isSavedWindow) ? `T${index + 1}W${windowObj.id}`
                                            : tab[tab_key];
                            }
                        }
                        formattedWindowObj['tabs'].push(formattedTab);
                    });
                    continue;
                }
                formattedWindowObj[window_key] = windowObj[window_key];
            }
        }

        return formattedWindowObj;
    }

    return (
        <div className='window-item mt-2'>
            <div
                className="window-item-header d-flex justify-content-between align-items-center gap-2"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <span
                    className={windowObj.id === storage?.currentWindow?.id ? 'window-title active' : 'window-title'}
                    onClick={(e) => navigate(e)}
                >
                    [Window ID: {windowObj?.id} | Tabs: {windowObj?.tabs?.length} | Incognito: {String(windowObj?.incognito)}]
                </span>
                {showActions && <div className="window-actions d-flex justify-content-between gap-2">
                    {windowObj?.tabs?.length > 1 && !savedWindow && <FontAwesomeIcon icon={faSquareCheck} title={(checked ? 'Uncheck' : 'Check') + ' all tabs'} onClick={() => checkAllTabs(!checked)} />}
                    {!savedWindow && [
                        <FontAwesomeIcon key={1} icon={faFloppyDisk} title='Save window' onClick={() => saveWindow()} />,
                        <FontAwesomeIcon key={2} icon={faFolderPlus} title='Add copied tabs' />
                    ]}
                    {windowObj?.tabs?.length > 1 && !savedWindow && [
                        <FontAwesomeIcon key={1} icon={faCopy} title='Copy tabs' onClick={() => copyTabs()} />,
                        <FontAwesomeIcon key={2} icon={faArrowsRotate} title={!selectedTabs.length ? 'Refresh all tabs' : 'Refresh selected tabs'} onClick={() => refresh()} />,
                    ]}
                    <FontAwesomeIcon
                        icon={!savedWindow ? faCircleXmark : faTrashCan}
                        title={!savedWindow ? (!selectedTabs.length ? 'Close window' : 'Close selected tabs') : 'Delete'}
                        onClick={() => closeOrDelete()}
                    />
                </div>}
            </div>
            <div className="window-item-tabs">
                {windowObj?.tabs?.map((tab: any, index: number) =>
                    <TabItem
                        key={index}
                        tab={tab}
                        fromSavedWindow={savedWindow}
                        updateSelectedTabs={updateSelectedTabs}
                        checked={checked}
                    />
                )}
            </div>
        </div>
    )
}

export default WindowItem