import { faSquareCheck, faFloppyDisk, faFolderPlus, faCopy, faArrowsRotate, faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import TabItem from '../TabItem/TabItem'
import { useState } from 'react'
import { useStorage } from '../../contexts/AppContext'
import { useNavContext } from '../../contexts/NavContext'
import Icon from '../Icon/Icon'
import { useModal } from '../../contexts/ModalContext'

interface Props {
    windowObj?: any
    savedWindow?: boolean;
}

const WindowItem = ({ windowObj, savedWindow }: Props) => {

    const storage = useStorage();
    const modal = useModal();
    const { updateCurrentNavTab } = useNavContext();
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
                if (!tab?.url?.match('https://gxcorner.games/')) {
                    allTabsIds.push(tab.id);
                }
            });
            setSelectedTabs(allTabsIds);
        } else {
            setSelectedTabs([]);
        }
        setChecked(state);
    }

    const saveWindow = () => {
        const lastSavedWindowIdx = storage?.savedWindows?.length - 1;
        let formattedWindow: any = { ...windowObj }
        formattedWindow.id = (storage?.savedWindows[lastSavedWindowIdx]) ? storage?.savedWindows[lastSavedWindowIdx].id + 1 : 100;
        formattedWindow = formatWindowObj(formattedWindow, true);
        const savedWindows = [...storage?.savedWindows, formattedWindow];
        storage.update('savedWindows', savedWindows);
    }

    const add = () => {
        modal.updateModal({
            open: true,
            type: 'add',
            data: {
                id: windowObj.id,
                tabs: [],
            },
        })
    }

    const copyTabs = () => {
        const formattedWindow = formatWindowObj(windowObj, false);
        navigator.clipboard.writeText(JSON.stringify(formattedWindow.tabs));
    }

    const refresh = () => {
        if (!selectedTabs.length) {
            windowObj.tabs.forEach((tab: any) => {
                chrome.tabs?.reload(tab.id, { bypassCache: storage?.options.bypass_cache });
            });
        } else {
            selectedTabs.forEach((tab: any) => {
                chrome.tabs?.reload(tab, { bypassCache: storage?.options.bypass_cache });
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
                setSelectedTabs([]);
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
                        if (!tab?.url?.match('https://gxcorner.games/')) {
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
                        }
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
            >
                <span
                    id={`window-id-${windowObj.id}`}
                    className={windowObj.id === storage?.currentWindow?.id ? 'window-title active' : 'window-title'}
                    onClick={(e) => navigate(e)}
                >
                    {windowObj.id !== 'searchResults'
                        ? `[Window ID: ${windowObj?.id} | Tabs: ${windowObj?.tabs?.length} | Incognito: ${String(windowObj?.incognito)}]`
                        : 'Search results:'
                    }
                </span>
                {windowObj.id !== 'searchResults' && <div className="window-actions d-flex justify-content-between align-items-center gap-2 mt-1">
                    {windowObj?.tabs?.length > 1 && !savedWindow && <Icon id={`window-${windowObj.id}-check-uncheck`} icon={faSquareCheck} title={(checked ? 'Uncheck' : 'Check') + ' all tabs'} onClick={() => checkAllTabs(!checked)} />}
                    {!savedWindow && [
                        <Icon id={`window-${windowObj.id}-save`} key={1} icon={faFloppyDisk} title='Save window' onClick={() => saveWindow()} />,
                        <Icon id={`window-${windowObj.id}-add-tabs`} key={2} icon={faFolderPlus} title='Add copied tabs' onClick={() => add()} />
                    ]}
                    {windowObj?.tabs?.length > 1 && !savedWindow && [
                        <Icon id={`window-${windowObj.id}-copy-tabs`} key={1} icon={faCopy} title='Copy tabs' onClick={() => copyTabs()} />,
                        <Icon id={`window-${windowObj.id}-refresh`} key={2} icon={faArrowsRotate} title={!selectedTabs.length ? 'Refresh all tabs' : 'Refresh selected tabs'} onClick={() => refresh()} />,
                    ]}
                    <Icon
                        id={`window-${windowObj.id}-close-delete`}
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