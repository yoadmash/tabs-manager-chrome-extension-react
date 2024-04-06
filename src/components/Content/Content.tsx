import { Button, TabContent, TabPane } from "reactstrap"
import WindowItem from "../WindowItem/WindowItem"
import { useNavContext } from "../../contexts/NavContext"
import { useStorage } from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import InteractionsModal from "./InteractionsModal";
import { useModal } from "../../contexts/ModalContext";
import SavedWindows from "./SavedWindows";

const Content = () => {

    const { currentNavTab, updateCurrentNavTab } = useNavContext();
    const [allowedIncognito, setAllowedIncognito] = useState(false);
    const isIncognito = useRef(false);
    const storage = useStorage();
    const modal = useModal();

    useEffect(() => {
        if (storage?.currentWindow?.incognito && !isIncognito.current) {
            updateCurrentNavTab(2);
            isIncognito.current = true;
        }
    }, [storage, updateCurrentNavTab, isIncognito]);

    useEffect(() => {
        if (!allowedIncognito) {
            checkAllowedIncognito()
        }
    }, [allowedIncognito]);

    const checkAllowedIncognito = async () => {
        const allowed = await chrome.extension?.isAllowedIncognitoAccess();
        setAllowedIncognito(allowed);
    }

    return (
        <>
            <TabContent activeTab={currentNavTab} className="windows-lists">
                <TabPane tabId={0}>
                    <div className="list d-flex flex-column gap-4">
                        {storage?.openedWindows?.map((window: any, index: number) => !window.incognito && window?.tabs?.length > 0 && <WindowItem key={index} windowObj={window} />)}
                        {storage?.openedWindows?.filter(window => !window.incognito).length === 0
                            && <Button
                                color="primary"
                                className="m-3"
                                onClick={() => {
                                    chrome.windows?.create({
                                        focused: true,
                                        incognito: false,
                                        state: 'maximized'
                                    });
                                    window.close();
                                }}
                            >
                                New window
                            </Button>
                        }
                    </div>
                </TabPane>
                <TabPane tabId={1}>
                    {storage.savedWindows && <SavedWindows />}
                </TabPane>
                <TabPane tabId={2}>
                    <div className="list d-flex flex-column gap-4">
                        {
                            allowedIncognito
                                ? storage?.openedWindows?.map((window: any, index: number) => window.incognito && window?.tabs?.length > 0 && <WindowItem key={index} windowObj={window} />)
                                : <p className="mt-3 text-center">Missing incognito permission</p>
                        }
                        {allowedIncognito
                            && storage?.openedWindows?.filter(window => window.incognito).length === 0
                            && <Button
                                color="primary"
                                className="m-3"
                                onClick={() => {
                                    chrome.windows?.create({
                                        focused: true,
                                        incognito: true,
                                        state: 'maximized'
                                    });
                                    window.close();
                                }}
                            >
                                New incognito window
                            </Button>
                        }
                    </div>
                </TabPane>
                <InteractionsModal open={modal.open} modalType={modal.type} />
            </TabContent>
        </>
    )
}

export default Content