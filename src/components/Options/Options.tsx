import { Button } from "reactstrap";
import { useStorage } from "../../contexts/AppContext"
import Option from "./Option"
import { useModal } from "../../contexts/ModalContext";
import InteractionsModal from "../Content/InteractionsModal";
import { useState } from "react";

const Options = () => {

    const storage = useStorage();
    const modal = useModal();
    const [loading, setLoading] = useState(false);

    const settings: any = {
        dark_theme: storage?.options?.dark_theme,
        show_favicons: storage?.options?.show_favicons,
        auto_scroll: storage?.options?.auto_scroll,
        hide_saved: storage?.options?.hide_saved,
        bypass_cache: storage?.options?.bypass_cache,
        dupilcated_tab_active: storage?.options?.dupilcated_tab_active,
        show_incognito: storage?.currentWindow?.incognito ? true : storage?.options?.show_incognito,
        allow_background_update: storage?.options?.allow_background_update
    }

    const options = [
        { id: 'dark_theme', title: 'Dark theme' },
        { id: 'show_favicons', title: 'Show favicons' },
        { id: 'auto_scroll', title: 'Auto scroll to active tab' },
        { id: 'hide_saved', title: 'Hide saved windows' },
        { id: 'bypass_cache', title: 'Bypass cache on refresh from list' },
        { id: 'dupilcated_tab_active', title: 'Set duplicated tab active (shortcut only)' },
        { id: 'show_incognito', title: 'Always show incognito windows' },
        { id: 'allow_background_update', title: 'Allow background update' }
    ]

    const setSetting = (setting_key: string, setting: boolean) => {
        settings[setting_key] = setting;
        storage.update('options', settings);
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
            storage.update('firebaseConfig', null)
        }
    }

    const copyToFirebase = async () => {
        setLoading(true);
        chrome.runtime.sendMessage({
            from: 'app',
            action: 'copy',
        });
    }

    chrome.runtime?.onMessage.addListener((message, sender, sendResponse) => {
        if(message.from === 'service' && message.data === 'done-copying-to-firebase') {
            setLoading(false);
        }
    })

    return (
        <>
            <div className="d-flex flex-column">
                {options.map(option => <Option
                    key={option.id}
                    title={option.title}
                    onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                    checked={settings[option.id]} />
                )}
            </div>
            <div className="d-flex flex-column gap-2 w-100">
                <div className="d-flex gap-2">
                    <Button
                        color={storage.firebaseConfig
                            ? 'warning'
                            : 'success'
                        }
                        className="w-50"
                        onClick={() => setFirebaseConfig()}
                    >
                        {storage.firebaseConfig
                            ? 'Disconnect from Firestore'
                            : 'Connect to Firestore'
                        }
                    </Button>
                    <Button
                        disabled={!storage.firebaseConfig || loading}
                        color="primary"
                        outline
                        className="w-50"
                        onClick={() => copyToFirebase()}
                    >
                        {
                            !loading
                                ? 'Copy to Firestore'
                                : 'Copying...'
                        }
                    </Button>
                </div>
                <Button color="danger" className="w-100" onClick={() => resetStorage()}>Delete saved windows</Button>
            </div>
            <InteractionsModal open={modal.open} modalType={modal.type} />
        </>
    )
}

export default Options