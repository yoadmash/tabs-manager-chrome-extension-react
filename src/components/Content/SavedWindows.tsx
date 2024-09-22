import ReactPaginate from "react-paginate"
import { useStorage } from "../../contexts/AppContext"
import { useEffect, useState } from "react";
import WindowItem from "../WindowItem/WindowItem";
import SavedWindowSelect from "./SavedWindowSelect";

interface Props {
    savedWindows: Array<any>;
}

const SavedWindows = ({ savedWindows }: Props) => {

    const storage = useStorage();
    const [pagination, setPagination] = useState<any>({
        offset: 0,
        numberPerPage: storage?.options?.windows_per_page || 15,
        pageCount: 1,
        currentData: [],
        selectedPage: 0
    });

    useEffect(() => {
        setPagination((prevState: any) => {
            let offset = pagination.offset;
            let page = pagination.selectedPage;

            if (pagination.currentData.length === 0 && pagination.selectedPage !== 0) {
                offset = (pagination.selectedPage - 1) * pagination.numberPerPage;
                page = pagination.selectedPage - 1;
            }

            return ({
                ...prevState,
                offset: offset,
                pageCount: Math.ceil(savedWindows?.length / prevState.numberPerPage),
                currentData: savedWindows?.slice(offset, offset + pagination.numberPerPage),
                selectedPage: page
            })
        });
    }, [savedWindows, pagination.numberPerPage, pagination.offset, pagination.currentData.length, pagination.selectedPage]);

    const handleChange = (e: any) => {
        const offset = e.selected * pagination.numberPerPage;
        setPagination({ ...pagination, offset, selectedPage: e.selected });
        document.querySelector('.windows-lists')?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <>
            <div className={`d-flex flex-column justify-content-center align-items-center gap-1 sticky-top ${storage?.options?.dark_theme || (storage?.currentWindow?.incognito && storage?.options?.dark_theme_incognito_only) ? 'bg-dark' : 'bg-white'}`}>
                {savedWindows?.[0]?.id !== 'searchResults' &&
                    <>
                        <SavedWindowSelect savedWindows={pagination.currentData} />
                        <ReactPaginate
                            forcePage={(pagination.selectedPage)}
                            pageCount={pagination.pageCount}
                            pageRangeDisplayed={0}
                            marginPagesDisplayed={2}
                            onPageChange={handleChange}
                            previousLabel="<<"
                            nextLabel=">>"
                            containerClassName="pagination pagination-sm m-0"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </>
                }
            </div >
            <div className="list d-flex flex-column gap-4">
                {pagination?.currentData?.map((window: any, index: number) => <WindowItem key={index} windowObj={window} savedWindow={true} />)}
            </div>
        </>
    )
}

export default SavedWindows