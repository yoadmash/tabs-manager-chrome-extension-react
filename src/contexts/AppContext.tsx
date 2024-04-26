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
        dupilcated_tab_active: boolean;
        show_incognito: boolean;
        allow_background_update: boolean;
    }
    firebaseConfig: boolean;
    popup: {
        id: number;
        incognito: boolean;
    };
    savedWindows: SavedWindow[];
    update: (key: string, value: any) => void;
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
        await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
        const storage = await chrome.storage?.local.get();
        setStorage({ ...storage });

        /*
        setStorage({
            "clipboard": null,
            "currentWindow": {
                "id": 764291172,
                "incognito": false
            },
            "openedWindows": [
                {
                    "alwaysOnTop": false,
                    "focused": false,
                    "height": 1128,
                    "id": 764291403,
                    "incognito": false,
                    "left": -2056,
                    "state": "maximized",
                    "tabs": [
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764291406,
                            "incognito": false,
                            "index": 0,
                            "lastAccessed": 1712908464510.653,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": true,
                            "selected": false,
                            "status": "complete",
                            "title": "GX Corner",
                            "url": "https://gxcorner.games/",
                            "width": 2007,
                            "windowId": 764291403
                        },
                        {
                            "active": true,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "http://localhost:3000/favicon.ico",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764291445,
                            "incognito": false,
                            "index": 1,
                            "lastAccessed": 1712914992600.655,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": true,
                            "status": "complete",
                            "title": "React App",
                            "url": "http://localhost:3000/",
                            "width": 953,
                            "windowId": 764291403
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://www.youtube.com/s/desktop/24644f83/img/favicon_32x32.png",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764291450,
                            "incognito": false,
                            "index": 2,
                            "lastAccessed": 1712914990305.62,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Node.js Tutorials for Beginners - YouTube",
                            "url": "https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw",
                            "width": 2007,
                            "windowId": 764291403
                        }
                    ],
                    "top": -8,
                    "type": "normal",
                    "width": 2064
                }
            ],
            "options": {
                "auto_scroll": true,
                "bypass_cache": false,
                "dark_theme": false,
                "dupilcated_tab_active": false,
                "hide_saved": false,
                "show_favicons": true,
                "show_incognito": false
            },
            "firebaseConfig": null,
            "popup": null,
            "savedWindows": [
                {
                    "id": 100,
                    "incognito": false,
                    "tabs": [
                        {
                            "favIconUrl": "https://static.xx.fbcdn.net/rsrc.php/yT/r/aGT3gskzWBf.ico",
                            "id": "T2W100",
                            "incognito": false,
                            "title": "Facebook",
                            "url": "https://www.facebook.com/",
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
        */
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

    const contextValue: any = {
        ...storage,
        update
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