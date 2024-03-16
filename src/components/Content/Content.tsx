import { TabContent, TabPane } from "reactstrap"
import WindowItem from "../WindowItem/WindowItem"
import { useContext } from "react"
import { NavContext } from "../../contexts/NavContext"

const Content = () => {
    const { currentNavTab } = useContext(NavContext);

    return (
        <TabContent activeTab={currentNavTab} className="windows-lists">
            <TabPane tabId={0}>
                <div className="list d-flex flex-column gap-4">
                    <WindowItem />
                </div>
            </TabPane>
            <TabPane tabId={1}>
                <div className="list d-flex flex-column gap-4">
                    <WindowItem />
                    <WindowItem />
                </div>
            </TabPane>
            <TabPane tabId={2}>
                <div className="list d-flex flex-column gap-4">
                <WindowItem />
                <WindowItem />
                <WindowItem />
                </div>
            </TabPane>
        </TabContent>
    )
}

export default Content