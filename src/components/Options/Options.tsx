import { Button } from "reactstrap";
import { useStorage } from "../../contexts/AppContext"
import Option from "./Option"
import { useModal } from "../../contexts/ModalContext";
import InteractionsModal from "../Content/InteractionsModal";
import { useState } from "react";

const Options = () => {

    const storage = useStorage();
    const modal = useModal();
    const [copyLoading, setCopyLoading] = useState(false);
    const [disconnectLoading, setDisconnectLoading] = useState(false);

    const settings: any = {
        dark_theme: storage?.options?.dark_theme,
        show_favicons: storage?.options?.show_favicons,
        auto_scroll: storage?.options?.auto_scroll,
        hide_saved: storage?.options?.hide_saved,
        bypass_cache: storage?.options?.bypass_cache,
        duplicated_tab_active: storage?.options?.duplicated_tab_active,
        show_incognito: storage?.currentWindow?.incognito ? true : storage?.options?.show_incognito,
        allow_background_update: storage?.options?.allow_background_update,
        hide_on_remote: storage?.options?.hide_on_remote,
    }

    const looksOptions = [
        { id: 'dark_theme', title: 'Dark theme' },
        { id: 'show_favicons', title: 'Show favicons' },
        { id: 'hide_saved', title: 'Hide saved windows' },
        { id: 'show_incognito', title: 'Always show incognito windows' },
    ]

    const functionalityOptions = [
        { id: 'auto_scroll', title: 'Auto scroll to active tab' },
        { id: 'bypass_cache', title: 'Bypass cache on refresh from list' },
        { id: 'duplicated_tab_active', title: 'Set duplicated tab active (shortcut only)' },
        { id: 'allow_background_update', title: 'Allow background update' },
        { id: 'hide_on_remote', title: 'Hide on remote' }
    ]

    const setSetting = async (setting_key: string, setting: boolean) => {
        if (setting_key === 'hide_on_remote') {
            await hideOnRemote();
        }

        settings[setting_key] = setting;
        storage.update('options', settings);
    }

    const hideOnRemote = async () => {
        chrome.runtime.sendMessage({
            from: 'app',
            action: 'hide-on-remote',
            data: !storage?.options?.hide_on_remote
        });
    }

    const resetStorage = async () => {
        await chrome.storage?.local.set({ savedWindows: [] })
        storage.update('savedWindows', []);
        window.close();
    }

    const setFirebaseConfig = async () => {
        if (!storage.firebaseConfig) {
            modal.updateModal({
                open: true,
                type: 'set-firebase-config',
                data: {
                    config: ''
                }
            })
        } else {
            setDisconnectLoading(true);
            chrome.runtime.sendMessage({
                from: 'app',
                action: 'disconnect-from-firebase',
            });
        }
    }

    const copyToFirebase = async () => {
        setCopyLoading(true);
        chrome.runtime.sendMessage({
            from: 'app',
            action: 'copy',
        });
    }

    chrome.runtime?.onMessage.addListener((message, sender, sendResponse) => {
        if (message.from === 'service' && message.data === 'done-copying-to-firebase') {
            setCopyLoading(false);
        } else if (message.from === 'service' && message.data === 'disconnected-from-firestore') {
            storage.update('firebaseConfig', null);
            setDisconnectLoading(false);
        }
    })

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column">
                <h5><u>Looks</u></h5>
                {looksOptions.map(option =>
                    <Option
                        key={option.id}
                        title={option.title}
                        onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                        checked={settings[option.id]}
                        hide={option.id === 'hide_on_remote' && !storage?.firebaseConfig}
                    />
                )}
            </div>
            <div className="d-flex flex-column">
                <h5><u>Functionality</u></h5>
                {functionalityOptions.map(option =>
                    <Option
                        key={option.id}
                        title={option.title}
                        onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                        checked={settings[option.id]}
                        hide={option.id === 'hide_on_remote' && !storage?.firebaseConfig}
                    />
                )}
            </div>
            <div className="d-flex flex-column gap-2 w-100">
                <div className="d-flex gap-2">
                    <Button
                        disabled={disconnectLoading}
                        color={storage.firebaseConfig
                            ? 'warning'
                            : 'success'
                        }
                        className="w-50"
                        onClick={() => setFirebaseConfig()}
                    >
                        {storage.firebaseConfig
                            ? !disconnectLoading
                                ? 'Disconnect from Firestore'
                                : 'Disconnecting...'
                            : 'Connect to Firestore'
                        }
                    </Button>
                    <Button
                        disabled={!storage.firebaseConfig || copyLoading}
                        color="primary"
                        outline
                        className="w-50"
                        onClick={() => copyToFirebase()}
                    >
                        {
                            !copyLoading
                                ? 'Copy to Firestore'
                                : 'Copying...'
                        }
                    </Button>
                </div>
                <Button color="danger" className="w-100" onClick={() => resetStorage()}>Delete saved windows</Button>
            </div>
            <InteractionsModal open={modal.open} modalType={modal.type} />
        </div>
    )
}

export default Options