import { useRef, useState } from 'react'
import { Button, Input, Label, Nav, NavItem, NavLink, Progress, TabContent, TabPane } from 'reactstrap'
import { useModal } from '../../contexts/ModalContext';
import { useStorage } from '../../contexts/AppContext';
import Option from './Option';
import InteractionsModal from '../Content/InteractionsModal';
import { Tooltip } from 'react-tooltip';
import Icon from '../Icon/Icon';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const NewOptions = () => {

    const [activeTab, setActiveTab] = useState(0);
    const windows_per_page_ref = useRef<HTMLInputElement>(null);
    const firebase_credentials = useRef<HTMLInputElement>(null);

    const storage = useStorage();
    const modal = useModal();
    const [copiedCreds, setCopiedCreds] = useState(false);
    const [copyLoading, setCopyLoading] = useState(false);
    const [disconnectLoading, setDisconnectLoading] = useState(false);
    const [resetStorageLoading, setResetStorageLoading] = useState(false);

    const settings: any = {
        dark_theme: storage?.options?.dark_theme,
        show_favicons: storage?.options?.show_favicons,
        auto_scroll: storage?.options?.auto_scroll,
        hide_saved: storage?.options?.hide_saved,
        bypass_cache: storage?.options?.bypass_cache,
        duplicated_tab_active: storage?.options?.duplicated_tab_active,
        show_incognito: storage?.currentWindow?.incognito ? true : storage?.options?.show_incognito,
        allow_background_update: storage?.options?.allow_background_update,
        allow_window_title_set_onsave: storage?.options?.allow_window_title_set_onsave,
        hide_on_remote: storage?.options?.hide_on_remote,
        delete_all_from_firebase: storage?.options?.delete_all_from_firebase,
        access_options_from_popup: storage?.options?.access_options_from_popup,
        windows_per_page: storage?.options?.windows_per_page,
        force_firebase_disconnect: storage?.options?.force_firebase_disconnect,
    }

    const looksOptions = [
        { id: 'dark_theme', title: 'Dark theme' },
        { id: 'show_favicons', title: 'Show favicons' },
        { id: 'hide_saved', title: 'Hide saved windows' },
        { id: 'show_incognito', title: 'Always show incognito windows' },
        { id: 'access_options_from_popup', title: 'Access options from popup' },
    ]

    const functionalityOptions = [
        { id: 'auto_scroll', title: 'Auto scroll to active tab' },
        { id: 'bypass_cache', title: 'Bypass cache on refresh from list' },
        { id: 'duplicated_tab_active', title: 'Set duplicated tab active (shortcut only)' },
        { id: 'allow_background_update', title: 'Allow background update' },
        { id: 'allow_window_title_set_onsave', title: 'On window save, show a popup to set a title (default title: current date)' },
    ]

    const firebaseOptions = [
        { id: 'hide_on_remote', title: 'Hide on remote' },
        { id: 'force_firebase_disconnect', title: 'Force disconnect' }
    ]

    const storageOptions = [
        { id: 'delete_all_from_firebase', title: 'Delete saved windows from Firebase' }
    ]

    const setSetting = async (setting_key: string, setting: boolean | number) => {
        if (setting_key === 'hide_on_remote') {
            await hideOnRemote();
        }

        settings[setting_key] = setting;
        storage.update('options', settings);
    }

    const hideOnRemote = async () => {
        chrome.runtime?.sendMessage({
            from: 'app',
            action: 'hide-on-remote',
            data: !storage?.options?.hide_on_remote
        });
    }

    const resetStorage = async () => {
        if (storage?.savedWindows?.length > 0) {
            await chrome.storage?.local.set({ savedWindows: [] })
            storage.update('savedWindows', []);
        }

        if (storage.firebaseConfig && storage.options.delete_all_from_firebase) {
            setResetStorageLoading(true);
            chrome.runtime?.sendMessage({
                from: 'app',
                action: 'delete-saved-windows'
            });
        }
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
            if (!storage?.options?.force_firebase_disconnect) {
                setDisconnectLoading(true);
            } else {
                storage.update('firebaseConfig', null);
                setSetting('force_firebase_disconnect', false);
            }
            chrome.runtime?.sendMessage({
                from: 'app',
                action: 'disconnect-from-firebase',
            });
        }
    }

    const copyToFirebase = async () => {
        setCopyLoading(true);
        chrome.runtime?.sendMessage({
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
        } else if (message.from === 'service' && message.data === 'deleted-saved-windows') {
            setSetting('delete_all_from_firebase', false);
            setResetStorageLoading(false);
        }
    })

    const tabs = [
        { id: 0, title: 'Looks' },
        { id: 1, title: 'Functionality' },
        { id: 2, title: 'Firebase' },
        { id: 3, title: 'Storage' },
    ]

    return (
        <div className='mt-3'>
            <Nav tabs>
                {tabs.map((tab) => (
                    <NavItem key={tab.id}>
                        <NavLink
                            className={tab.id === activeTab ? 'active' : ''}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.title}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={String(activeTab)} className='mt-2'>
                <TabPane tabId="0">
                    {looksOptions.map(option =>
                        <Option
                            key={option.id}
                            title={option.title}
                            onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                            checked={settings[option.id]}
                        />
                    )}
                    <div className='d-flex gap-3 align-items-end mt-3'>
                        <Label>
                            Saved windows per page (total pages: {Math.ceil(storage?.savedWindows?.length / storage?.options?.windows_per_page)}):
                            <Input
                                type='number'
                                className='p-0 text-center'
                                min={1}
                                max={15}
                                defaultValue={storage?.options?.windows_per_page}
                                innerRef={windows_per_page_ref}
                            />
                        </Label>
                        <Button className='p-2 px-3' color='primary'
                            onClick={() => {
                                if (!windows_per_page_ref.current?.value) return;
                                const value: number = Number(windows_per_page_ref.current.value);

                                if (value >= 1 && value <= 15) {
                                    setSetting('windows_per_page', Number(value))
                                }
                            }}
                        >
                            Set
                        </Button>
                    </div>
                </TabPane>
                <TabPane tabId="1">
                    {functionalityOptions.map(option =>
                        <Option
                            key={option.id}
                            title={option.title}
                            onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                            checked={settings[option.id]}
                        />
                    )}
                </TabPane>
                <TabPane tabId="2">
                    {firebaseOptions.map(option => (
                        <Option
                            key={option.id}
                            title={option.title}
                            onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                            checked={settings[option.id]}
                            hide={!storage?.firebaseConfig}
                        />
                    ))}
                    <div className="d-flex flex-wrap gap-1 mt-3">
                        {(storage.firebaseConfig && storage.savedWindows.length > 0) &&
                            <Button
                                disabled={copyLoading}
                                color="primary"
                                outline
                                className="w-100"
                                onClick={() => copyToFirebase()}
                            >
                                {
                                    !copyLoading
                                        ? 'Copy to Firestore'
                                        : 'Copying...'
                                }
                            </Button>
                        }
                        <Button
                            disabled={disconnectLoading}
                            color={storage.firebaseConfig
                                ? 'warning'
                                : 'success'
                            }
                            className='w-100'
                            onClick={() => setFirebaseConfig()}
                        >
                            {storage.firebaseConfig
                                ? !disconnectLoading
                                    ? 'Disconnect from Firestore'
                                    : 'Disconnecting...'
                                : 'Connect to Firestore'
                            }
                        </Button>
                        {storage?.firebaseConfig &&
                            <div className='mt-3 w-100'>
                                <Label className='d-flex align-items-center justify-content-between w-100'>
                                    Credentials
                                    <Icon
                                        id='copy-firebase-creds'
                                        icon={faCopy}
                                        title={copiedCreds ? 'Copied' : 'Copy'}
                                        onClick={() => {
                                            window.navigator.clipboard.writeText(JSON.stringify(storage?.firebaseConfig, null, 2));
                                            setCopiedCreds(true);
                                            setTimeout(() => {
                                                setCopiedCreds(false);
                                            }, 1000)
                                        }}
                                    />
                                </Label>
                                <Input
                                    innerRef={firebase_credentials}
                                    type='textarea'
                                    readOnly
                                    value={JSON.stringify(storage?.firebaseConfig, null, 2) || ''}
                                    rows={8}
                                    style={{
                                        resize: 'none'
                                    }}
                                />
                            </div>
                        }
                    </div>
                </TabPane>
                <TabPane tabId="3">
                    <div className='d-flex flex-column gap-1'>
                        Usage: {storage.size()}MB / 10MB
                        <Progress max={10} value={storage.size()} />
                    </div>
                    <div className='mt-3'>
                        {storageOptions.map(option => (
                            <Option
                                key={option.id}
                                title={option.title}
                                onChange={() => setSetting(option.id, !settings[option.id])}
                                checked={settings[option.id]}
                                hide={option.id === 'delete_all_from_firebase' && !storage?.firebaseConfig}
                            />
                        ))}
                    </div>
                    <Button
                        id='delete-saved-windows-btn'
                        disabled={storage?.savedWindows?.length === 0 && !storage?.options?.delete_all_from_firebase}
                        color="danger"
                        className="mt-3 w-100"
                        onClick={() => resetStorage()}
                    >
                        {
                            !resetStorageLoading
                                ? storage?.savedWindows?.length === 0 && !storage?.options?.delete_all_from_firebase
                                    ? 'No saved windows to delete'
                                    : 'Delete saved windows'
                                : storage.firebaseConfig && storage?.options?.delete_all_from_firebase
                                    ? 'Please wait, deleting from Firebase as well...'
                                    : 'Deleting...'
                        }
                    </Button>
                    {storage.firebaseConfig && storage.options.delete_all_from_firebase && storage.savedWindows.length > 0 && <Tooltip anchorSelect={`#delete-saved-windows-btn`} className='p-1' place='bottom'>Will delete from Firebase as well</Tooltip>}
                </TabPane>
            </TabContent>
            <InteractionsModal open={modal.open} modalType={modal.type} />
        </div>
    )
}

export default NewOptions