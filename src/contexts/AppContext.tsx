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

    const getStorage = async () => {
        await chrome.storage?.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
        const storage = await chrome.storage?.local.get();
        setStorage({ ...storage });

        // setStorage({
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
        //                     "favIconUrl": "",
        //                     "id": "T2W100",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 100
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W100",
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
        //                     "favIconUrl": "",
        //                     "id": "T2W101",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 101
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W101",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/",
        //                     "windowId": 101
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 102,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W102",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 102
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W102",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 102
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W102",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/",
        //                     "windowId": 102
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 103,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W103",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 103
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W103",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 103
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W103",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 103
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W103",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 103
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W103",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 103
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W103",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 103
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 104,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W104",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 104
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W104",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 104
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W104",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 104
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W104",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 104
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W104",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 104
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W104",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 104
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 105,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W105",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 105
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W105",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 105
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W105",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 105
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W105",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 105
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W105",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 105
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W105",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 105
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 106,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W106",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 106
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W106",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 106
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W106",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 106
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W106",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 106
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W106",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 106
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W106",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 106
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 107,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W107",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 107
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W107",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 107
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W107",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 107
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W107",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 107
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W107",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 107
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W107",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 107
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 108,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W108",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 108
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W108",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 108
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W108",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 108
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W108",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 108
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W108",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 108
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W108",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 108
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 109,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W109",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 109
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W109",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 109
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W109",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 109
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W109",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 109
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W109",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 109
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W109",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 109
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 110,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W110",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 110
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W110",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 110
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W110",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 110
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W110",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 110
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W110",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 110
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W110",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 110
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 111,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W111",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 111
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W111",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 111
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W111",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 111
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W111",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 111
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W111",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 111
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W111",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 111
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 112,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W112",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 112
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W112",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 112
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W112",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 112
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W112",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 112
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W112",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 112
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W112",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 112
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 113,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W113",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 113
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W113",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 113
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W113",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 113
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W113",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 113
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W113",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 113
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W113",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 113
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 114,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W114",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 114
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W114",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 114
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W114",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 114
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W114",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 114
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W114",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 114
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W114",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 114
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 115,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W115",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 115
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W115",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 115
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W115",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 115
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W115",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 115
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W115",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 115
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W115",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 115
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 116,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W116",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 116
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W116",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 116
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W116",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 116
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W116",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 116
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W116",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 116
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W116",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 116
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 117,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W117",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 117
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W117",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 117
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W117",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 117
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W117",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 117
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W117",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 117
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W117",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 117
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 118,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W118",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 118
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W118",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 118
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W118",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 118
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W118",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 118
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W118",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 118
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W118",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 118
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 119,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W119",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 119
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W119",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 119
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W119",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 119
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W119",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 119
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W119",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 119
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W119",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 119
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 120,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W120",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 120
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W120",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 120
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W120",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 120
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W120",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 120
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W120",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 120
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W120",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 120
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 121,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W121",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 121
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W121",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 121
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W121",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 121
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W121",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 121
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W121",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 121
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W121",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 121
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 122,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W122",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 122
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W122",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 122
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W122",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 122
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W122",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 122
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W122",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 122
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W122",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 122
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 123,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W123",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 123
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W123",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 123
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W123",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 123
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W123",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 123
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W123",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 123
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W123",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 123
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 124,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W124",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 124
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W124",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 124
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W124",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 124
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W124",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 124
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W124",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 124
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W124",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 124
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 125,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W125",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 125
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W125",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 125
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W125",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 125
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W125",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 125
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W125",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 125
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W125",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 125
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 126,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W126",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 126
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W126",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 126
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W126",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 126
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W126",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 126
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W126",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 126
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W126",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 126
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 127,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W127",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 127
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W127",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 127
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W127",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 127
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W127",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 127
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W127",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 127
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W127",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 127
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 128,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W128",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 128
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W128",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 128
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W128",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 128
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W128",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 128
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W128",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 128
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W128",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 128
        //                 }
        //             ]
        //         },
        //         {
        //             "id": 129,
        //             "incognito": false,
        //             "tabs": [
        //                 {
        //                     "favIconUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgZD0iTTMuNjIgMy4wODZjMy40MjMtLjM1NCAyLjU0LjUwMSAzLjQyMy41MDFIOC44MWMuODgzIDAgLjE5My0uNzg4IDMuNDE0LS41MDEgMS44ODUuNTAxIDMuMDk2IDQuNTQ4IDIuNTgxIDcuNDk1QzE0LjQ1OCAxMi4xOCAxNC4xMDggMTMgMTIuMzQyIDEzYy0xLjc2NiAwLTIuNjUtLjg1Ni0zLjUzMy0yLjU2Ny0uMDI1LS4wNS0xLjczNi0uMDYtMS43NjYgMEM2LjIwNiAxMi4xNDQgNS4yNzcgMTMgMy41MTEgMTNzLTIuMTItLjgwOS0yLjQ3Mi0yLjQxOWMtLjUwOC0yLjkzNC43MDYtNi45OTQgMi41ODEtNy40OTV6bS0xLjYwNCA3LjI4MkMyLjMzOCAxMS44MzkgMi40OCAxMiAzLjUxMSAxMmMxLjI0OCAwIDEuODk1LS40OTYgMi42MzQtMi4wMDcuMzkzLS44MDMgMy4xNTItLjc5NSAzLjU1My0uMDE5LjggMS41NTIgMS40MTIgMi4wMjYgMi42NDQgMi4wMjYgMS4wMjUgMCAxLjE2Ny0uMTY0IDEuNDc3LTEuNTkuNDQ5LTIuNTcxLS42MjYtNS45MTUtMS43ODctNi4zMzctLjc0My0uMDYyLTEuMjczLS4wNjQtMS42MjctLjAyLS4yMTguMDI4LS4zMDguMDU5LS4zNzQuMWE3LjU4NiA3LjU4NiAwIDAgMC0uMTUxLjEwNiAxLjc1NiAxLjc1NiAwIDAgMS0xLjA3LjMyOEg3LjA0MmMtLjQ3NyAwLS44MTctLjE0LTEuMTMtLjQxM2EyLjQwNSAyLjQwNSAwIDAgMC0uMDk5LS4wODdjLS4wMjItLjAxNy0uMDcyLS4wMzYtLjI2Ni0uMDYtLjM1Ny0uMDQ1LS45Mi0uMDM2LTEuNzMuMDQ0LTEuMTU2LjQxNC0yLjIzOCAzLjc3NS0xLjgwMiA2LjI5N3oiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIxMC41IiB5PSI3LjUiIGZpbGw9ImhzbCg0MCA2NCUgNjQlKSIgcng9IjEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIzLjUiIHk9IjcuNSIgZmlsbD0iaHNsKDQwIDY0JSA2NCUpIiByeD0iMSIvPjwvZz48L3N2Zz4=",
        //                     "id": "T1W129",
        //                     "incognito": false,
        //                     "title": "GX Corner",
        //                     "url": "https://gxcorner.games/",
        //                     "windowId": 129
        //                 },
        //                 {
        //                     "favIconUrl": "",
        //                     "id": "T2W129",
        //                     "incognito": false,
        //                     "title": "Extensions",
        //                     "url": "chrome://extensions/",
        //                     "windowId": 129
        //                 },
        //                 {
        //                     "favIconUrl": "http://localhost:3000/favicon.ico",
        //                     "id": "T3W129",
        //                     "incognito": false,
        //                     "title": "React App",
        //                     "url": "http://localhost:3000/#",
        //                     "windowId": 129
        //                 },
        //                 {
        //                     "favIconUrl": "https://blog.logrocket.com/wp-content/uploads/2019/06/cropped-cropped-favicon-196x196.png?w=32",
        //                     "id": "T4W129",
        //                     "incognito": false,
        //                     "title": "Rendering large lists in React: 5 methods with examples - LogRocket Blog",
        //                     "url": "https://blog.logrocket.com/render-large-lists-react-5-methods-examples/",
        //                     "windowId": 129
        //                 },
        //                 {
        //                     "favIconUrl": "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico",
        //                     "id": "T5W129",
        //                     "incognito": false,
        //                     "title": "React Paginate Usage",
        //                     "url": "https://codepen.io/monsieurv/pen/abyJQWQ",
        //                     "windowId": 129
        //                 },
        //                 {
        //                     "favIconUrl": "https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png",
        //                     "id": "T6W129",
        //                     "incognito": false,
        //                     "title": "react-paginate - npm",
        //                     "url": "https://www.npmjs.com/package/react-paginate",
        //                     "windowId": 129
        //                 }
        //             ]
        //         }
        //     ]
        // })
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