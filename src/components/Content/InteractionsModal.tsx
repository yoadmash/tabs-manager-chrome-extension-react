import { useEffect, useRef, useState } from 'react';
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useModal } from '../../contexts/ModalContext';
import { useStorage } from '../../contexts/AppContext';
import { useSearchContext } from '../../contexts/SearchContext';

interface Props {
    open?: boolean;
    modalType?: 'add' | 'edit';
}

const InteractionsModal = ({ open, modalType }: Props) => {

    const modal = useModal();
    const storage = useStorage();
    const { searchData, updateSearchData } = useSearchContext();
    const [modalData, setModalData] = useState({ ...modal.data });
    const addTabsInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && modal.data) {
            document.body.style.height = '600px';
            setModalData({ ...modal.data });
            console.log(modal.data);
        } else {
            document.body.style.height = 'max-content'
        }

    }, [open, modal.data])

    const toggle = () => {
        setModalData({});
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
            }
        } catch (err) {
            console.error(err);
            if (addTabsInputRef.current) {
                addTabsInputRef.current.value = '';
            }
        }
    }

    const save = () => {
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

        if(searchData?.[0]?.id === 'searchResults') {
            const searchedTabIdx = searchData[0].tabs.findIndex((tab: any) => tab.id === modal?.data?.id);
            searchData[0].tabs[searchedTabIdx] = tabObj;
            updateSearchData([...searchData]);
        }
        
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
                <span>{modalType === 'add' ? `Add tabs to window '${modal?.data?.id}'` : `Edit tab '${modal?.data?.id}'`}</span>
            </ModalHeader>
            <ModalBody>
                {modalType === 'add' &&
                    <>
                        <Label>
                            Paste copied tabs array
                        </Label>
                        <Input type="text" placeholder='Must be a valid JSON' innerRef={addTabsInputRef} onChange={(e) => modal.data.tabs = e.target.value} />
                    </>
                }
                {modalType === 'edit' &&
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
                            <Input type="text" disabled defaultValue={modalData?.favIconUrl} />
                        </Label>}
                    </div>
                }
            </ModalBody>
            <ModalFooter>
                {modalType === 'add' &&
                    <>
                        <Button className='w-100' color="primary" onClick={() => add()}>Add</Button>
                    </>
                }
                {modalType === 'edit' &&
                    <>
                        <Button color="primary" onClick={() => save()}>Save</Button>
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