import { GroupedVirtuoso } from "react-virtuoso";
import WindowItem from "../WindowItem/WindowItem";
import TabItem from "../TabItem/TabItem";

interface WindowList {
    data: Array<any>;
}

export const VirtualizedList = ({ data }: WindowList) => {
    const groupCounts = data.map(window => window?.tabs?.length);
    const all_tabs: Array<any> = [];
    data.map(window => all_tabs.push(...window?.tabs));

    return (
        <div className="list virtualized">
            <GroupedVirtuoso
                style={{ height: "425px", width: "100%" }}
                groupCounts={groupCounts}
                groupContent={(index) => {
                    return (
                        <WindowItem windowObj={data[index]} savedWindow={true} virtualized/>
                    )
                }}
                itemContent={(index) => {
                    return (
                        <TabItem
                            tab={all_tabs[index]}
                            fromSavedWindow={true}
                            checked={false}
                            updateSelectedTabs={null}
                        />
                    )
                }}
            />
        </div>
    )
}