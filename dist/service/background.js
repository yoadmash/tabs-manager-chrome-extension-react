import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { v4 as uuid } from 'https://jspm.dev/uuid';

let firebaseApp = null;
let firebaseDB = null;

const connectToFireStore = async () => {
    const storage = await chrome.storage.local.get();

    if (storage.firebaseConfig) {
        firebaseApp = initializeApp(storage.firebaseConfig);
        if (firebaseApp) {
            firebaseDB = getFirestore(firebaseApp);
            console.log('Connected to firebase');
        }

    } else {
        console.warn('Firebase config is missing');
    }
}

connectToFireStore();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const storage = await chrome.storage.local.get();
    if (message.from === 'app' && storage.firebaseConfig) {
        if (message.action === 'save-window-to-firestore') {
            await setDoc(doc(firebaseDB, storage.extension_uid, String(message.window.id)), {
                id: message.window.id,
                incognito: message.window.incognito,
                tabs: message.window.tabs
            });

            await setDoc(doc(firebaseDB, 'connections_list', storage.extension_uid), {
                saved_windows_count: storage.savedWindows.length
            })
        } else if (message.action === 'delete-window-from-firestore') {
            await deleteDoc(doc(firebaseDB, storage.extension_uid, String(message.window.id)));

            await setDoc(doc(firebaseDB, 'connections_list', storage.extension_uid), {
                saved_windows_count: storage.savedWindows.length
            })
        } else if (message.action === 'copy') {
            await storage.savedWindows.forEach(async window => {
                await setDoc(doc(firebaseDB, storage.extension_uid, String(window.id)), {
                    id: window.id,
                    incognito: window.incognito,
                    tabs: window.tabs
                });
            });

            await setDoc(doc(firebaseDB, 'connections_list', storage.extension_uid), {
                saved_windows_count: storage.savedWindows.length
            })
            chrome.runtime.sendMessage({
                from: 'service',
                data: 'done-copying-to-firebase'
            });
        }
    }
});

chrome.runtime.onInstalled.addListener(async () => {
    const data = await chrome.storage.local.get();
    if (Object.entries(data).length === 0) {
        chrome.storage.local.set({
            extension_uid: uuid(),
            options: {
                dark_theme: false,
                show_favicons: true,
                auto_scroll: true,
                hide_saved: false,
                bypass_cache: false,
                dupilcated_tab_active: false,
                show_incognito: false
            },
            firebaseConfig: null,
            currentWindow: {
                id: null,
                incognito: null
            },
            openedWindows: [],
            savedWindows: [],
            clipboard: null,
            popup: null,
        });
    } else {
        chrome.storage.local.set({ popup: null })
    }
});

chrome.action.setBadgeBackgroundColor({
    tabId: undefined,
    color: '#0d6dfd7b'
});

chrome.action.setBadgeTextColor({
    tabId: undefined,
    color: '#FFFFFF'
})

chrome.windows.onFocusChanged.addListener(async (windowId) => {
    const storage = await chrome.storage.local.get();
    if (windowId !== -1 && windowId !== storage.popup?.id) {
        const windowObj = await chrome.windows.get(windowId);
        chrome.storage.local.set({
            currentWindow: {
                id: windowId,
                incognito: windowObj.incognito
            }
        })
    }
});

chrome.windows.onRemoved.addListener(async (windowId) => {
    chrome.storage.local.get().then(storage => {
        const popupId = storage.popup?.id;
        if (popupId === windowId) {
            chrome.storage.local.set({ popup: null });
        }
    });
    saveCurrentWindows();
});

chrome.storage.onChanged.addListener((changes) => {
    console.log(changes);
    chrome.storage.local.get().then(storage => {
        let badgeTxt = '';
        let title = '';
        if (!storage?.currentWindow?.incognito) {
            title += `Total tabs: ${calculateTotalTabs(storage.openedWindows.filter(window => !window.incognito))}`
            badgeTxt = storage.openedWindows.filter(window => !window.incognito).length
        } else {
            title += `Total tabs: ${calculateTotalTabs(storage.openedWindows.filter(window => window.incognito))}`
            badgeTxt = storage.openedWindows.filter(window => window.incognito).length;
        }
        chrome.action.setBadgeText({
            text: String(badgeTxt)
        });
        chrome.action.setTitle({ title });

        if (changes.firebaseConfig) {
            connectToFireStore();
        }
    });
});

function calculateTotalTabs(windows_soruce) {
    let sum = 0;
    windows_soruce?.forEach(window => sum += window.tabs.length);
    return sum;
}

chrome.tabs.onActivated.addListener(async (info) => {
    await saveCurrentWindows();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        await saveCurrentWindows();
    }
});

chrome.commands.onCommand.addListener((command, tab) => {
    if (command) {
        switch (command) {
            case "duplicate_tab":
                chrome.storage.local.get()
                    .then(storage => {
                        chrome.tabs.create({
                            active: storage.options.dupilcated_tab_active,
                            url: tab.url,
                            windowId: tab.windowId,
                            index: tab.index + 1
                        });
                    })
                break;
            case "bypass_cache_reload":
                chrome.tabs.reload(tab.id, { bypassCache: true });
                break;
            case "open_as_external_popup":
                chrome.storage.local.get().then(storage => {
                    if (!storage.popup) {
                        chrome.windows.get(tab.windowId).then(window => {
                            chrome.windows.create({
                                focused: true,
                                state: 'normal',
                                type: 'popup',
                                top: window.height / 2 - 800 / 2,
                                left: window.width / 2 - 700 / 2,
                                height: 800,
                                width: 700,
                                url: `js/index.html`
                            }).then(async popup => {
                                chrome.storage.local.set({ popup: { id: popup.id, incognito: window.incognito } });
                            });
                        });
                    } else {
                        chrome.windows.get(storage.popup.id, { populate: true, windowTypes: ['popup'] })
                            .then(window => {
                                if (window.focused) {
                                    chrome.windows.remove(window.id);
                                    chrome.storage.local.set({ popup: null });
                                } else {
                                    chrome.windows.update(window.id, { focused: true });
                                }
                            })
                    }
                })
                break;
        }
    }
});

async function saveCurrentWindows() {
    await chrome.storage.local.set({ openedWindows: await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }) });
    try {
        await chrome.runtime.sendMessage({ from: 'service' });
    } catch (err) {
        console.log(err);
    }
}