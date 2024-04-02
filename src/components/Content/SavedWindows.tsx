import ReactPaginate from "react-paginate"
import { useStorage } from "../../contexts/AppContext"
import { useEffect, useState } from "react";
import WindowItem from "../WindowItem/WindowItem";

const SavedWindows = () => {
    const storage = useStorage();
    const [pagination, setPagination] = useState<any>({
        offset: 0,
        numberPerPage: 15,
        pageCount: 0,
        currentData: [],
        selectedPage: 0
    });

    useEffect(() => {
        setPagination((prevState: any) => {
            return ({
                ...prevState,
                pageCount: Math.ceil(storage.savedWindows.length / prevState.numberPerPage),
                currentData: storage.savedWindows.slice(pagination.offset, pagination.offset + pagination.numberPerPage),
            })
        });
    }, [storage.savedWindows, pagination.numberPerPage, pagination.offset]);

    const handleChange = (e: any) => {
        console.log(e);
        const offset = e.selected * pagination.numberPerPage;
        setPagination({ ...pagination, offset, selectedPage: e.selected });
    }

    return (
        <>
            <div className="d-flex justify-content-center mt-3">
                <ReactPaginate
                    pageCount={pagination.pageCount}
                    pageRangeDisplayed={0}
                    marginPagesDisplayed={2}
                    onPageChange={handleChange}
                    previousLabel="<<"
                    nextLabel=">>"
                    containerClassName="pagination pagination-sm"
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
            </div>
            <div className="list d-flex flex-column gap-4">
                {pagination?.currentData?.map((window: any, index: number) => <WindowItem key={index} windowObj={window} savedWindow={true} />)}
            </div>
        </>
    )
}

export default SavedWindows