import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface Storage {
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
    }
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
                "id": 764289530,
                "incognito": false
            },
            "openedWindows": [
                {
                    "alwaysOnTop": false,
                    "focused": false,
                    "height": 1128,
                    "id": 764289421,
                    "incognito": true,
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
                            "height": 1010,
                            "highlighted": false,
                            "id": 764289424,
                            "incognito": true,
                            "index": 0,
                            "lastAccessed": 1712412056135.418,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": true,
                            "selected": false,
                            "status": "complete",
                            "title": "GX Corner",
                            "url": "https://gxcorner.games/",
                            "width": 2007,
                            "windowId": 764289421
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
                            "id": 764289426,
                            "incognito": true,
                            "index": 1,
                            "lastAccessed": 1712412517443.267,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": true,
                            "status": "complete",
                            "title": "React App",
                            "url": "http://localhost:3000/",
                            "width": 953,
                            "windowId": 764289421
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://www.youtube.com/s/desktop/3ee2b817/img/favicon_32x32.png",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289523,
                            "incognito": true,
                            "index": 2,
                            "lastAccessed": 1712412319200.929,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Node.js Tutorials for Beginners - YouTube",
                            "url": "https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw",
                            "width": 2007,
                            "windowId": 764289421
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://codedamn.com/assets/images/favicons/favicon-32x32.png",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289525,
                            "incognito": true,
                            "index": 3,
                            "lastAccessed": 1712412320211.822,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Node React Tutorial – How to connect React with backend Node.js?",
                            "url": "https://codedamn.com/news/reactjs/how-to-connect-react-with-node-js",
                            "width": 2007,
                            "windowId": 764289421
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://dashboard.render.com/favicon-dark.png",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289524,
                            "incognito": true,
                            "index": 4,
                            "lastAccessed": 1712412232372.922,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Render · The Easiest Cloud For All Your Apps",
                            "url": "https://dashboard.render.com/login",
                            "width": 2007,
                            "windowId": 764289421
                        }
                    ],
                    "top": -8,
                    "type": "normal",
                    "width": 2064
                },
                {
                    "alwaysOnTop": false,
                    "focused": false,
                    "height": 1128,
                    "id": 764289530,
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
                            "id": 764289533,
                            "incognito": false,
                            "index": 0,
                            "lastAccessed": 1712412517740.917,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": true,
                            "selected": false,
                            "status": "complete",
                            "title": "GX Corner",
                            "url": "https://gxcorner.games/",
                            "width": 2007,
                            "windowId": 764289530
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://cdn.podia.com/assets/legacy/default-favicon-1804e569e149df38db68c35ee7519a529155f12a43711643935400212606ebfa.png",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289528,
                            "incognito": false,
                            "index": 1,
                            "lastAccessed": 1712412517760.34,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Dave Gray Teaches Code",
                            "url": "https://courses.davegray.codes/",
                            "width": 2007,
                            "windowId": 764289530
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://app.netlify.com/favicon.ico",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289534,
                            "incognito": false,
                            "index": 2,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Site overview | polly-application | Netlify",
                            "url": "https://app.netlify.com/sites/polly-application/overview",
                            "width": 2007,
                            "windowId": 764289530
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://ucarecdn.com/27856246-9e5a-41a4-8098-f4cf1d006ef1/",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289535,
                            "incognito": false,
                            "index": 3,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Dashboard | Uploadcare",
                            "url": "https://app.uploadcare.com/accounts/login/",
                            "width": 2007,
                            "windowId": 764289530
                        },
                        {
                            "active": false,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://static.xx.fbcdn.net/rsrc.php/yT/r/aGT3gskzWBf.ico",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289536,
                            "incognito": false,
                            "index": 4,
                            "lastAccessed": 1712412531968.459,
                            "mutedInfo": {
                                "muted": false
                            },
                            "pinned": false,
                            "selected": false,
                            "status": "complete",
                            "title": "Facebook",
                            "url": "https://www.facebook.com/",
                            "width": 2007,
                            "windowId": 764289530
                        },
                        {
                            "active": true,
                            "audible": false,
                            "autoDiscardable": true,
                            "discarded": false,
                            "favIconUrl": "https://www.youtube.com/s/desktop/3ee2b817/img/favicon_32x32.png",
                            "groupId": -1,
                            "height": 1011,
                            "highlighted": false,
                            "id": 764289538,
                            "incognito": false,
                            "index": 5,
                            "lastAccessed": 1712412542590.944,
                            "mutedInfo": {
                                "muted": false
                            },
                            "openerTabId": 764289536,
                            "pinned": false,
                            "selected": true,
                            "status": "complete",
                            "title": "YouTube",
                            "url": "https://www.youtube.com/",
                            "width": 2007,
                            "windowId": 764289530
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
            "popup": null,
            "savedWindows": []
        })
        */
    }

    useEffect(() => {
        getStorage();
    }, []);

    chrome.runtime?.onMessage.addListener((message, sender, sendResponse) => {
        if (message.from === 'service') {
            getStorage();
            return true;
        }
    })

    const update = async (key: string, value: any) => {
        if (key !== 'storage') {
            setStorage((prev: any) => {
                prev[key] = value;
                chrome.storage?.local.set(prev);
                return { ...prev };
            });
        } else {
            await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
            const storage = await chrome.storage?.local.get();
            setStorage({ ...storage });

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