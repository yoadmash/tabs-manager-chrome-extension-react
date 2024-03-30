import { useEffect, useRef } from 'react';
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useModal } from '../../contexts/ModalContext';
import { useStorage } from '../../contexts/AppContext';

interface Props {
    open?: boolean;
    modalType?: 'add' | 'edit';
}

const InteractionsModal = ({ open, modalType }: Props) => {

    const modal = useModal();
    const storage = useStorage();
    const addTabsInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            document.body.style.height = '600px';
        } else {
            document.body.style.height = 'max-content'
        }

    }, [open])

    const toggle = () => modal.updateModal({
        open: false
    })

    const add = () => {
        try {
            if (JSON.parse(modal?.data?.tabs)) {
                const parsed = JSON.parse(modal.data.tabs);
                for (const tab of parsed) {
                    if (checkTabObjStructure(tab) && !tab?.url.match('https://gxcorner.games/')) {
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
        <Modal centered isOpen={modalType && open} fade={false}>
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
                            <Input type="text" defaultValue={modal?.data?.title} onChange={(e) => modal.data.title = e.target.value} />
                        </Label>
                        <Label className='w-100'>
                            URL
                            <Input type="text" defaultValue={modal?.data?.url} onChange={(e) => modal.data.url = e.target.value} />
                        </Label>
                        <Label className='w-100'>
                            Favicon URL
                            <Input type="text" disabled defaultValue={modal?.data?.favIconUrl} />
                        </Label>
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
                        <Button color="primary" onClick={() => console.log(modal?.data)}>Save</Button>
                        <Button color={storage?.clipboard ? 'secondary' : 'danger'}>{storage?.clipboard ? 'Copy from clipboard' : 'Set as Free Slot'}</Button>
                    </>
                }
            </ModalFooter>
        </Modal>
    )
}

export default InteractionsModal