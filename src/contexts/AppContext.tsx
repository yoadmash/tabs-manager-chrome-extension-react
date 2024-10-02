import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface Storage {
    extension_uid: string;
    clipboard: any;
    currentWindow: {
        id: number
        incognito: boolean
    };
    openedWindows: any[];
    options: {
        dark_theme: boolean;
        dark_theme_incognito_only: boolean;
        show_favicons: boolean;
        auto_scroll: boolean;
        hide_saved: boolean;
        bypass_cache: boolean;
        duplicated_tab_active: boolean;
        show_incognito: boolean;
        allow_background_update: boolean;
        allow_window_title_set_onsave: boolean;
        hide_on_remote: boolean;
        delete_all_from_firebase: boolean;
        access_options_from_popup: boolean;
        windows_per_page: number;
        force_firebase_disconnect: boolean;
    }
    firebaseConfig: boolean;
    popup: {
        id: number;
        incognito: boolean;
    };
    savedWindows: SavedWindow[];
    notes: Note[];
    update: (key: string, value: any) => void;
    size: () => string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    tabReference: Partial<Omit<Tab, "id" | "windowId">>;
}

interface SavedWindow {
    id: number;
    incognito: boolean;
    tabs: Tab[]
}

interface Tab {
    favIconUrl: string;
    id: number;
    incognito: boolean;
    title: string;
    url: string;
    windowId: string;
}

const StorageContext = createContext<Storage | undefined>(undefined);

interface Props {
    children: ReactNode
}

export const StorageProvider = ({ children }: Props) => {
    const [storage, setStorage] = useState<any>({});

    const getStorage = async () => {
        if (process.env.NODE_ENV !== 'development') {
            await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
            const storage = await chrome.storage?.local.get();
            setStorage({ ...storage });
        } else {
            // const JSON_SERVER_IP = process.env.REACT_APP_JSON_SERVER_IP;
            // fetch(JSON_SERVER_IP + '/chrome-extension', { method: 'GET' })
            //     .then(res => res.json())
            //     .then(data => {
            //         console.warn('getting data from json-server');
            //         setStorage({ ...data })
            //     })
            //     .catch(e => console.error(e));
            setStorage(
                {
                    "clipboard": null,
                    "currentWindow": {
                        "id": 468805696,
                        "incognito": false
                    },
                    "extension_uid": "6a6fcdea-b1e8-4cfc-a03a-17abd2f3a822",
                    "firebaseConfig": null,
                    "firebaseConnectionName": null,
                    "openedWindows": [
                        {
                            "alwaysOnTop": false,
                            "focused": false,
                            "height": 1120,
                            "id": 468804505,
                            "incognito": false,
                            "left": 2040,
                            "state": "maximized",
                            "tabs": [
                                {
                                    "active": false,
                                    "audible": false,
                                    "autoDiscardable": true,
                                    "discarded": false,
                                    "favIconUrl": "https://web.whatsapp.com/favicon/1x/favicon/",
                                    "groupId": -1,
                                    "height": 983,
                                    "highlighted": false,
                                    "id": 468804541,
                                    "incognito": false,
                                    "index": 0,
                                    "lastAccessed": 1727853913644.092,
                                    "mutedInfo": {
                                        "muted": false
                                    },
                                    "pinned": true,
                                    "selected": false,
                                    "status": "complete",
                                    "title": "WhatsApp",
                                    "url": "https://web.whatsapp.com/",
                                    "width": 2048,
                                    "windowId": 468804505
                                },
                                {
                                    "active": true,
                                    "audible": false,
                                    "autoDiscardable": true,
                                    "discarded": false,
                                    "favIconUrl": "https://eucfassetsgreen.freshdesk.com/production/a/assets/images/favicon-4378b9aa66e439cbb7406dfd79cd4858b222446d0756da51cdbe72dd1e697b33.ico",
                                    "groupId": -1,
                                    "height": 983,
                                    "highlighted": true,
                                    "id": 468805360,
                                    "incognito": false,
                                    "index": 1,
                                    "lastAccessed": 1727858262376.23,
                                    "mutedInfo": {
                                        "muted": false
                                    },
                                    "pinned": false,
                                    "selected": true,
                                    "status": "complete",
                                    "title": "מערכת תמיכה : PayPlus",
                                    "url": "https://payplus.freshdesk.com/a/tickets/filters/391172",
                                    "width": 2048,
                                    "windowId": 468804505
                                }
                            ],
                            "top": -8,
                            "type": "normal",
                            "width": 2064
                        },
                        {
                            "alwaysOnTop": false,
                            "focused": false,
                            "height": 1120,
                            "id": 468805149,
                            "incognito": false,
                            "left": -8,
                            "state": "maximized",
                            "tabs": [
                                {
                                    "active": true,
                                    "audible": false,
                                    "autoDiscardable": true,
                                    "discarded": false,
                                    "favIconUrl": "https://crm.corecrm.co/statics/favicons/new/favicon.ico",
                                    "groupId": -1,
                                    "height": 983,
                                    "highlighted": true,
                                    "id": 468805671,
                                    "incognito": false,
                                    "index": 0,
                                    "lastAccessed": 1727858262384.203,
                                    "mutedInfo": {
                                        "muted": true,
                                        "reason": "user"
                                    },
                                    "pinned": false,
                                    "selected": true,
                                    "status": "complete",
                                    "title": "מסך ראשי - PayPlus",
                                    "url": "https://crm.corecrm.co/dashboard",
                                    "width": 2048,
                                    "windowId": 468805149
                                }
                            ],
                            "top": -8,
                            "type": "normal",
                            "width": 2064
                        },
                        {
                            "alwaysOnTop": false,
                            "focused": false,
                            "height": 1120,
                            "id": 468805696,
                            "incognito": false,
                            "left": -8,
                            "state": "maximized",
                            "tabs": [
                                {
                                    "active": false,
                                    "audible": false,
                                    "autoDiscardable": true,
                                    "discarded": false,
                                    "favIconUrl": "https://github.githubassets.com/favicons/favicon.svg",
                                    "groupId": -1,
                                    "height": 983,
                                    "highlighted": false,
                                    "id": 468805686,
                                    "incognito": false,
                                    "index": 0,
                                    "lastAccessed": 1727858270410.929,
                                    "mutedInfo": {
                                        "muted": false
                                    },
                                    "pinned": false,
                                    "selected": false,
                                    "status": "complete",
                                    "title": "tabs-manager-chrome-extension-react/src/contexts/AppContext.tsx at bug-fixes-and-new-features · yoadmash/tabs-manager-chrome-extension-react",
                                    "url": "https://github.com/yoadmash/tabs-manager-chrome-extension-react/blob/bug-fixes-and-new-features/src/contexts/AppContext.tsx",
                                    "width": 2048,
                                    "windowId": 468805696
                                },
                                {
                                    "active": true,
                                    "audible": false,
                                    "autoDiscardable": true,
                                    "discarded": false,
                                    "favIconUrl": "http://localhost:3000/favicon.ico",
                                    "groupId": -1,
                                    "height": 983,
                                    "highlighted": true,
                                    "id": 468805698,
                                    "incognito": false,
                                    "index": 1,
                                    "lastAccessed": 1727858290036.766,
                                    "mutedInfo": {
                                        "muted": false
                                    },
                                    "pinned": false,
                                    "selected": true,
                                    "status": "complete",
                                    "title": "React App",
                                    "url": "http://localhost:3000/",
                                    "width": 934,
                                    "windowId": 468805696
                                }
                            ],
                            "top": -8,
                            "type": "normal",
                            "width": 2064
                        }
                    ],
                    "options": {
                        "access_options_from_popup": true,
                        "allow_background_update": false,
                        "allow_window_title_set_onsave": true,
                        "auto_scroll": true,
                        "bypass_cache": true,
                        "dark_theme": false,
                        "dark_theme_incognito_only": false,
                        "delete_all_from_firebase": false,
                        "duplicated_tab_active": true,
                        "hide_on_remote": false,
                        "hide_saved": false,
                        "show_favicons": true,
                        "show_incognito": false,
                        "windows_per_page": 15
                    },
                    "popup": null,
                    "savedWindows": [],
                    "notes": [
                        {
                            id: 1,
                            title: 'Note 1',
                            content: 'This is note 1',
                            tabReference: {
                                "favIconUrl": "https://github.githubassets.com/favicons/favicon.svg",
                                "incognito": false,
                                "title": "tabs-manager-chrome-extension-react/src/contexts/AppContext.tsx at bug-fixes-and-new-features · yoadmash/tabs-manager-chrome-extension-react",
                                "url": "https://github.com/yoadmash/tabs-manager-chrome-extension-react/blob/bug-fixes-and-new-features/src/contexts/AppContext.tsx",

                            }
                        },
                        {
                            id: 2,
                            title: 'Note 2',
                            content: 'This is note 2'
                        },
                        {
                            id: 3,
                            title: 'Note 3',
                            content: 'This is note 3'
                        },
                        {
                            id: 4,
                            title: 'Note 4',
                            content: 'This is note 4'
                        },
                        {
                            id: 5,
                            title: 'Note 5',
                            content: 'This is note 5'
                        },
                        {
                            id: 6,
                            title: 'Note 6',
                            content: 'This is note 6'
                        },
                        {
                            id: 7,
                            title: 'Note 7',
                            content: 'This is note 7'
                        }
                    ]
                }
            )
        }
    }

    useEffect(() => {
        getStorage();
    }, []);

    chrome.runtime?.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.from === 'service' && storage?.options?.allow_background_update) {
            await getStorage();
        }
        return true;
    })

    const update = async (key: string, value: any) => {
        if (key !== 'storage') {
            setStorage((prev: any) => {
                prev[key] = value;
                chrome.storage?.local.set(prev);
                return { ...prev };
            });
        } else {
            getStorage();
        }
    }

    const size = () => {
        const size: number = new Blob([JSON.stringify(storage)]).size;
        const sizeToMB: number = Number((size / Math.pow(1000, 2)).toFixed(2)) * 1;
        return sizeToMB;
    }

    const contextValue: any = {
        ...storage,
        update,
        size
    }

    return (
        <StorageContext.Provider value={contextValue}>
            {children}
        </StorageContext.Provider>
    )
}

export function useStorage() {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
}