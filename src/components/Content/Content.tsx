import { TabContent, TabPane } from "reactstrap"
import WindowItem from "../WindowItem/WindowItem"
import { useNavContext } from "../../contexts/NavContext"
import { useStorage } from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";

const Content = () => {

    const { currentNavTab, updateCurrentNavTab } = useNavContext();
    const [allowedIncognito, setAllowedIncognito] = useState(false);
    const isIncognito = useRef(false);
    const storage = useStorage();

    useEffect(() => {
        if (storage?.currentWindow?.incognito && !isIncognito.current) {
            updateCurrentNavTab(2);
            isIncognito.current = true;
        }
    }, [storage, updateCurrentNavTab, isIncognito]);

    useEffect(() => {
        if(!allowedIncognito) {
            checkAllowedIncognito()
        }
    }, [allowedIncognito]);

    const checkAllowedIncognito = async () => {
        const allowed = await chrome.extension?.isAllowedIncognitoAccess();
        setAllowedIncognito(allowed);
    }

    return (
        <TabContent activeTab={currentNavTab} className="windows-lists">
            <TabPane tabId={0}>
                <div className="list d-flex flex-column gap-4">
                    {storage?.openedWindows?.map((window: any, index: number) => !window.incognito && window?.tabs?.length > 0 && <WindowItem key={index} windowObj={window} />)}
                </div>
            </TabPane>
            <TabPane tabId={1}>
                <div className="list d-flex flex-column gap-4">
                    {storage?.savedWindows?.map((window: any, index: number) => <WindowItem key={index} windowObj={window} savedWindow={true} />)}
                </div>
            </TabPane>
            <TabPane tabId={2}>
                <div className="list d-flex flex-column gap-4">
                    {
                        allowedIncognito
                            ? storage?.openedWindows?.map((window: any, index: number) => window.incognito && window?.tabs?.length > 0 && <WindowItem key={index} windowObj={window} />)
                            : <p className="mt-3 text-center">Missing incognito permission</p>
                    }
                    {allowedIncognito && storage?.openedWindows?.filter(window => window.incognito).length === 0 && <p className="mt-3 text-center">No windows</p>}
                </div>
            </TabPane>
        </TabContent>
    )
}

export default Content