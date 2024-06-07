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
        show_favicons: boolean;
        auto_scroll: boolean;
        hide_saved: boolean;
        bypass_cache: boolean;
        duplicated_tab_active: boolean;
        show_incognito: boolean;
        allow_background_update: boolean;
        allow_window_title_set_onsave: boolean;
        hide_on_remote: boolean;
    }
    firebaseConfig: boolean;
    popup: {
        id: number;
        incognito: boolean;
    };
    savedWindows: SavedWindow[];
    update: (key: string, value: any) => void;
    size: () => string;
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
        // await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
        // const storage = await chrome.storage?.local.get();
        // setStorage({ ...storage });

        setStorage({
            "clipboard": null,
            "currentWindow": {
                "id": 468787046,
                "incognito": false
            },
            "extension_uid": "dbc2947d-32fb-464d-8091-9196f1181d1d",
            "firebaseConfig": null,
            "firebaseConnectionName": null,
            "openedWindows": [
                {
                    "alwaysOnTop": false,
                    "focused": false,
                    "height": 1120,
                    "id": 468786758,
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
                            "id": 468787072,
                            "incognito": false,
                            "index": 0,
                            "lastAccessed": 1717749389962.614,
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
                            "windowId": 468786758
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
                    "id": 468787046,
                    "incognito": false,
                    "left": 2040,
                    "state": "maximized",
                    "tabs": [
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://eucfassetsblue.freshdesk.com/production/a/assets/images/favicon-0878e344085488420907386ac885d19ca701f7f04f10e7f28925397b9ebe7af5.ico",
                            "groupId": -1,
                            "height": 983,
                            "highlighted": false,
                            "id": 468787045,
                            "incognito": false,
                            "index": 0,
                            "lastAccessed": 1717749525125.438,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "מערכת תמיכה : PayPlus",
                            "url": "https://payplus.freshdesk.com/a/tickets/filters/391172",
                            "width": 2048,
                            "windowId": 468787046
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://github.githubassets.com/favicons/favicon.svg",
                            "groupId": -1,
                            "height": 983,
                            "highlighted": false,
                            "id": 468787173,
                            "incognito": false,
                            "index": 1,
                            "lastAccessed": 1717749575691.575,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "yoadmash/tabs-manager-chrome-extension-react",
                            "url": "https://github.com/yoadmash/tabs-manager-chrome-extension-react/tree/main",
                            "width": 2048,
                            "windowId": 468787046
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
                            "id": 468787174,
                            "incognito": false,
                            "index": 2,
                            "lastAccessed": 1717749686630.161,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": true,
                            "status": "complete",
                            "title": "React App",
                            "url": "http://localhost:3000/",
                            "width": 2048,
                            "windowId": 468787046
                        }
                    ],
                    "top": -8,
                    "type": "normal",
                    "width": 2064
                }
            ],
            "options": {
                "allow_background_update": false,
                "allow_window_title_set_onsave": true,
                "auto_scroll": true,
                "bypass_cache": false,
                "dark_theme": false,
                "duplicated_tab_active": false,
                "hide_on_remote": false,
                "hide_saved": false,
                "show_favicons": true,
                "show_incognito": false
            },
            "popup": null,
            "savedWindows": [
                {
                    "id": 100,
                    "incognito": false,
                    "tabs": [
                        {
                            "favIconUrl": "https://eucfassetsblue.freshdesk.com/production/a/assets/images/favicon-0878e344085488420907386ac885d19ca701f7f04f10e7f28925397b9ebe7af5.ico",
                            "id": "T1W100",
                            "incognito": false,
                            "title": "מערכת תמיכה : PayPlus",
                            "url": "https://payplus.freshdesk.com/a/tickets/filters/391172",
                            "windowId": 100
                        },
                        {
                            "favIconUrl": "https://github.githubassets.com/favicons/favicon.svg",
                            "id": "T2W100",
                            "incognito": false,
                            "title": "yoadmash/tabs-manager-chrome-extension-react",
                            "url": "https://github.com/yoadmash/tabs-manager-chrome-extension-react/tree/main",
                            "windowId": 100
                        },
                        {
                            "favIconUrl": "http://localhost:3000/favicon.ico",
                            "id": "T3W100",
                            "incognito": false,
                            "title": "React App",
                            "url": "http://localhost:3000/",
                            "windowId": 100
                        }
                    ]
                }
            ]
        })
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
        return `${sizeToMB}MB / 10MB`;
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