import { TabContent, TabPane } from "reactstrap"
import WindowItem from "../WindowItem/WindowItem"
import { useNavContext } from "../../contexts/NavContext"
import { useStorage } from "../../contexts/AppContext";

const Content = () => {
    const { currentNavTab } = useNavContext();
    const storage = useStorage();

    return (
        <TabContent activeTab={currentNavTab} className="windows-lists">
            <TabPane tabId={0}>
                <div className="list d-flex flex-column gap-4">
                    {storage?.openedWindows?.map((window: any, index: number) => <WindowItem key={index} windowObj={window} />)}
                </div>
            </TabPane>
            <TabPane tabId={1}>
                <div className="list d-flex flex-column gap-4">
                    {storage?.savedWindows?.map((window: any, index: number) => <WindowItem key={index} windowObj={window} />)}
                </div>
            </TabPane>
            <TabPane tabId={2}>
                <div className="list d-flex flex-column gap-4">

                </div>
            </TabPane>
        </TabContent>
    )
}

export default Content