import { useEffect, useRef, useState } from 'react';
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useModal } from '../../contexts/ModalContext';
import { useStorage } from '../../contexts/AppContext';
import { useSearchContext } from '../../contexts/SearchContext';
import { useNavContext } from '../../contexts/NavContext';

interface Props {
    open?: boolean;
    modalType?: 'add-to-opened-window' | 'add-to-saved-window' | 'edit-saved-tab' | 'set-firebase-config' | 'set-window-title';
}

const InteractionsModal = ({ open, modalType }: Props) => {

    const modal = useModal();
    const storage = useStorage();
    const { currentNavTab } = useNavContext();
    const { searchData, updateSearchData } = useSearchContext();
    const [modalData, setModalData] = useState({ ...modal.data });
    const [isValidJSON, setIsValidJSON] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && modal.data) {
            if (currentNavTab !== 3) {
                document.body.style.height = '600px';
            }
            setModalData({ ...modal.data });
        } else {
            document.body.style.height = 'max-content'
        }

    }, [open, currentNavTab, modal.data])

    const toggle = () => {
        setModalData({});
        setIsValidJSON(true);
        modal.updateModal({
            open: false
        });
    }

    const add = () => {
        try {
            if (JSON.parse(modal?.data?.tabs)) {
                const parsed = JSON.parse(modal.data.tabs);
                for (const tab of parsed) {
                    if (checkTabObjStructure(tab) && !tab?.url?.match('https://gxcorner.games/')) {
                        chrome.tabs?.create({
                            url: tab.url,
                            windowId: modal.data.id,
                        }).then(tab => console.log(tab));
                    }
                }

                setModalData({});
                modal.updateModal({ ...modal, open: false });
            }
        } catch (err) {
            console.error(err);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    const setFirebase = () => {
        try {
            if (JSON.parse(modal?.data?.config)) {
                const parsed = JSON.parse(modal.data.config);
                storage.update('firebaseConfig', parsed);
                storage.update('firebaseConnectionName', inputRef.current?.value || storage.extension_uid);

                chrome.runtime?.sendMessage({
                    from: 'app',
                    action: 'connect-to-firebase',
                });

                setModalData({});
                modal.updateModal({ ...modal, open: false });
            }
        } catch (err) {
            setIsValidJSON(false);
        }
    }

    const saveChanges = () => {
        const tabWindowIdx = storage?.savedWindows?.findIndex(window => window.tabs.find(tab => tab.id === modal?.data?.id));
        const tabIdx = storage?.savedWindows[tabWindowIdx]?.tabs?.findIndex(tab => tab.id === modal?.data?.id);
        let tabObj = storage?.savedWindows[tabWindowIdx]?.tabs[tabIdx];
        tabObj = {
            ...tabObj,
            title: modalData?.title,
            url: modalData?.url,
            favIconUrl: modalData?.favIconUrl
        }

        storage.savedWindows[tabWindowIdx].tabs[tabIdx] = tabObj;
        storage?.update('savedWindows', storage.savedWindows);
        storage?.update('clipboard', null);

        if (searchData?.[0]?.id === 'searchResults') {
            const searchedTabIdx = searchData[0].tabs.findIndex((tab: any) => tab.id === modal?.data?.id);
            searchData[0].tabs[searchedTabIdx] = tabObj;
            updateSearchData([...searchData]);
        }

        chrome.runtime?.sendMessage({
            from: 'app',
            action: 'sync-saved-window',
            windowId: tabObj.windowId,
            updatedWindowTabs: storage?.savedWindows[tabWindowIdx]?.tabs,
        })

        setModalData({});
        modal.updateModal({ ...modal, open: false });
    }

    const saveNew = () => {
        const regex = /\d+/g

        const tabObj: any = {
            favIconUrl: modalData?.favIconUrl,
            id: `T${Number(modal?.data?.lastSavedTabId?.match(regex)[0]) + 1}W${modal.data.id}`,
            incognito: modal.data.incognito,
            title: modalData?.title,
            url: modalData?.url,
            windowId: modal.data.id,
        }

        if (!tabObj.title || !tabObj.url) return;

        const savedWindowIdx = storage?.savedWindows?.findIndex(window => window.id === modal.data.id);
        storage.savedWindows[savedWindowIdx].tabs.push(tabObj);

        storage.update('savedWindows', storage.savedWindows);
        storage?.update('clipboard', null);

        chrome.runtime?.sendMessage({
            from: 'app',
            action: 'sync-saved-window',
            windowId: tabObj.windowId,
            updatedWindowTabs: storage.savedWindows[savedWindowIdx].tabs
        })

        setModalData({});
        modal.updateModal({ ...modal, open: false });
    }

    const copyOrFree = (action: 'copy' | 'set') => {
        switch (action) {
            case 'copy':
                setModalData({
                    ...modalData,
                    title: storage?.clipboard?.title,
                    url: storage?.clipboard?.url,
                    favIconUrl: storage?.clipboard?.favIconUrl
                });
                break;
            case 'set':
                setModalData({
                    ...modalData,
                    title: 'Free Slot',
                    url: null,
                    favIconUrl: null,
                })
                break;
            default:
                break;
        }
    }

    const performDoneAction = (modalType: string) => {
        switch (modalType) {
            case 'add-to-opened-window':
                add();
                break;
            case 'set-firebase-config':
                setFirebase();
                break;
            case 'set-window-title':
                modal.data.formattedWindow.title = inputRef?.current?.value;
                modal.data.saveWindowFunc(modal.data.formattedWindow);
                setModalData({});
                modal.updateModal({ ...modal, open: false });
                break;
            default:
                break;
        }
    }

    const checkTabObjStructure = (tabObj: any) => {
        const allowedTabProps = ['favIconUrl', 'id', 'incognito', 'title', 'url', 'windowId'];
        for (const tab_key in tabObj) {
            if (!allowedTabProps.includes(tab_key)) {
                return false;
            }
        }
        return true;
    }

    return (
        <Modal centered isOpen={modalType && open} fade={false} unmountOnClose>
            <ModalHeader toggle={() => toggle()}>
                <span>
                    {(modalType === 'add-to-opened-window' || modalType === 'add-to-saved-window') && `Add tabs to window '${modal?.data?.id}'`}
                    {(modalType === 'edit-saved-tab') && `Edit tab '${modal?.data?.id}'`}
                    {(modalType === 'set-firebase-config') && 'Configure Firebase Connection'}
                    {(modalType === 'set-window-title') && 'Save window'}
                </span>
            </ModalHeader>
            <ModalBody>
                {modalType === 'add-to-opened-window' &&
                    <>
                        <Label>
                            Paste copied tabs array
                        </Label>
                        <Input type="text" placeholder='Must be a valid JSON' innerRef={inputRef} onChange={(e) => modal.data.tabs = e.target.value} />
                    </>
                }
                {(modalType === 'edit-saved-tab' || modalType === 'add-to-saved-window') &&
                    <div className='d-flex flex-column'>
                        <Label className='w-100'>
                            Title
                            <Input type="text" defaultValue={modalData?.title} onChange={(e) => setModalData({ ...modalData, title: e.target.value })} />
                        </Label>
                        <Label className='w-100'>
                            URL
                            <Input type="text" defaultValue={modalData?.url} onChange={(e) => setModalData({ ...modalData, url: e.target.value })} />
                        </Label>
                        {storage?.options?.show_favicons && <Label className='w-100'>
                            Favicon URL
                            <Input type="text" defaultValue={modalData?.favIconUrl} onChange={(e) => setModalData({ ...modalData, favIconUrl: e.target.value })} />
                        </Label>}
                    </div>
                }
                {(modalType === 'set-firebase-config') &&
                    <>
                        <Input
                            className='mb-3'
                            placeholder='Connection name'
                            defaultValue={storage.extension_uid}
                            innerRef={inputRef}
                        />
                        <Input
                            invalid={!isValidJSON}
                            style={{
                                height: 210,
                                resize: 'none',
                            }}
                            type="textarea"
                            defaultValue={`${JSON.stringify({
                                apiKey: "",
                                authDomain: "",
                                projectId: "",
                                storageBucket: "",
                                messagingSenderId: "",
                                appId: ""
                            }, null, 2)}`}
                            onChange={(e) => {
                                setIsValidJSON(true);
                                modal.data.config = e.target.value
                            }}
                        />
                        {!isValidJSON &&
                            <Label className='text-danger mt-2'>
                                ERROR: Invalid JSON
                            </Label>
                        }
                    </>
                }
                {(modalType === 'set-window-title') &&
                    <>
                        <Label>Title</Label>
                        <Input
                            type="search"
                            placeholder='Up to 24 characters'
                            maxLength={24}
                            innerRef={inputRef}
                            defaultValue={modal.data.formattedWindow.title}
                        />
                    </>
                }
            </ModalBody>
            <ModalFooter>
                {(modalType === 'add-to-opened-window' || modalType === 'set-firebase-config' || modalType === 'set-window-title') &&
                    <Button
                        className='w-100'
                        color="primary"
                        onClick={() => performDoneAction(modalType)}
                    >
                        Done
                    </Button>
                }
                {(modalType === 'edit-saved-tab' || modalType === 'add-to-saved-window') &&
                    <>
                        <Button color="primary" onClick={() => modalType === 'edit-saved-tab' ? saveChanges() : saveNew()}>Save</Button>
                        <Button
                            color={storage?.clipboard ? 'secondary' : 'danger'}
                            onClick={() => copyOrFree(storage?.clipboard ? 'copy' : 'set')}
                        >
                            {storage?.clipboard ? 'Copy from clipboard' : 'Set as Free Slot'}
                        </Button>
                    </>
                }
            </ModalFooter>
        </Modal>
    )
}

export default InteractionsModal