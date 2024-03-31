import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface Storage {
    clipboard: any;
    currentWindow: {
        id: number
        incognito: boolean
    };
    openedWindows: any[];
    options: {
        auto_scroll: boolean;
        show_incognito: false;
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

    useEffect(() => {
        const getStorage = async () => {
            await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
            const storage = await chrome.storage?.local.get();
            setStorage({ ...storage });
            // setStorage({
            //     openedWindows: [
            //         {
            //             "alwaysOnTop": false,
            //             "focused": false,
            //             "height": 1128,
            //             "id": 764286750,
            //             "incognito": false,
            //             "left": -2056,
            //             "state": "maximized",
            //             "tabs": [
            //                 {
            //                     "active": false,
            //                     "audible": false,
            //                     "autoDiscardable": true,
            //                     "discarded": false,
            //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
            //                     "groupId": -1,
            //                     "height": 1011,
            //                     "highlighted": false,
            //                     "id": 764286753,
            //                     "incognito": false,
            //                     "index": 0,
            //                     "lastAccessed": 1711911130749.774,
            //                     "mutedInfo": {
            //                         "muted": false
            //                     },
            //                     "pinned": true,
            //                     "selected": false,
            //                     "status": "complete",
            //                     "title": "GX Corner",
            //                     "url": "https://gxcorner.games/",
            //                     "width": 2007,
            //                     "windowId": 764286750
            //                 },
            //                 {
            //                     "active": true,
            //                     "audible": false,
            //                     "autoDiscardable": true,
            //                     "discarded": false,
            //                     "favIconUrl": "http://localhost:3000/favicon.ico",
            //                     "groupId": -1,
            //                     "height": 1011,
            //                     "highlighted": false,
            //                     "id": 764286800,
            //                     "incognito": false,
            //                     "index": 1,
            //                     "lastAccessed": 1711911147093.255,
            //                     "mutedInfo": {
            //                         "muted": false
            //                     },
            //                     "pinned": false,
            //                     "selected": true,
            //                     "status": "complete",
            //                     "title": "React App",
            //                     "url": "http://localhost:3000/",
            //                     "width": 2007,
            //                     "windowId": 764286750
            //                 }
            //             ],
            //             "top": -8,
            //             "type": "normal",
            //             "width": 2064
            //         }
            //     ],
            //     savedWindows: [
            //         {
            //             "id": 100,
            //             "incognito": false,
            //             "tabs": [
            //                 {
            //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
            //                     "id": "T1W100",
            //                     "incognito": false,
            //                     "title": "GX Corner",
            //                     "url": "https://gxcorner.games/",
            //                     "windowId": 100
            //                 },
            //                 {
            //                     "favIconUrl": "http://localhost:3000/favicon.ico",
            //                     "id": "T2W100",
            //                     "incognito": false,
            //                     "title": "React App",
            //                     "url": "http://localhost:3000/",
            //                     "windowId": 100
            //                 }
            //             ]
            //         },
            //         {
            //             "id": 101,
            //             "incognito": false,
            //             "tabs": [
            //                 {
            //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
            //                     "id": "T1W101",
            //                     "incognito": false,
            //                     "title": "GX Corner",
            //                     "url": "https://gxcorner.games/",
            //                     "windowId": 101
            //                 },
            //                 {
            //                     "favIconUrl": "http://localhost:3000/favicon.ico",
            //                     "id": "T2W101",
            //                     "incognito": false,
            //                     "title": "React App",
            //                     "url": "http://localhost:3000/",
            //                     "windowId": 101
            //                 }
            //             ]
            //         }
            //     ],
            //     clipboard: {
            //         favIconUrl: "https://www.gstatic.com/devrel-devsite/prod/vc0835d3b6455cc4a7840b9b6bb6705aa0a2f0ac008bf6ab6ed61c7fff6e5cce1/chrome/images/favicon.png",
            //         title: "chrome.runtime  |  API  |  Chrome for Developers",
            //         url: "https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup"
            //     }
            // })
        }

        getStorage();
    }, []);

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