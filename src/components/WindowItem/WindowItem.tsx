import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faFloppyDisk, faFolderPlus, faCopy, faArrowsRotate, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import TabItem from '../TabItem/TabItem'
import { useState } from 'react'


const WindowItem = () => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div className='window-item mt-2'>
            <div
                className="window-item-header d-flex justify-content-between align-items-center gap-2"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <span className="window-title">{`[Window ID: %d | Tabs: %d | Incognito: false]`}</span>
                {showActions && <div className="window-actions d-flex justify-content-between gap-2">
                    <FontAwesomeIcon icon={faSquareCheck} title='Check \ Uncheck all tabs' />
                    <FontAwesomeIcon icon={faFloppyDisk} title='Save window' />
                    <FontAwesomeIcon icon={faFolderPlus} title='Add copied tabs' />
                    <FontAwesomeIcon icon={faCopy} title='Copy tabs' />
                    <FontAwesomeIcon icon={faArrowsRotate} title='Refresh all tabs' />
                    <FontAwesomeIcon icon={faCircleXmark} title='Close window' />
                </div>}
            </div>
            <div className="window-item-tabs">
                <TabItem />
            </div>
        </div>
    )
}

export default WindowItem