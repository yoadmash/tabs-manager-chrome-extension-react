chrome.runtime.onInstalled.addListener(async () => {
    const data = await chrome.storage.local.get();
    console.log(data);
    if (Object.entries(data).length === 0) {
        chrome.storage.local.set({
            options: {
                auto_scroll: true,
                show_incognito: false
            },
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

chrome.windows.onFocusChanged.addListener(async (windowId) => {
    const storage = await chrome.storage.local.get();
    if(windowId !== -1 && windowId !== storage.popup?.id) {
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
});

chrome.storage.onChanged.addListener((changes) => {
    console.log(changes);
});

chrome.tabs.onActivated.addListener(async () => {
    await saveCurrentWindows();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    await saveCurrentWindows();
});

chrome.commands.onCommand.addListener((command, tab) => {
    if (command) {
        switch (command) {
            case "duplicate_tab":
                chrome.tabs.create({
                    active: true,
                    url: tab.url,
                    windowId: tab.windowId,
                    index: tab.index + 1
                });
                break;
            case "bypass_cache_reload":
                chrome.tabs.reload(tab.id, { bypassCache: true });
                break;
            case "open_show_saved_windows_expanded":
                chrome.storage.local.get().then(storage => {
                    if (!storage.popup) {
                        chrome.windows.get(tab.windowId).then(window => {
                            chrome.windows.create({
                                focused: true,
                                state: 'normal',
                                type: 'popup',
                                top: window.height / 2 - 800 / 2,
                                left: window.width / 2 - 650 / 2,
                                height: 800,
                                width: 650,
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
                                    chrome.storage.local.set({popup: null});
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
    const openedWindows = await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] });
    await chrome.storage.local.set({ openedWindows: openedWindows });
}