import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faFloppyDisk, faFolderPlus, faCopy, faArrowsRotate, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import TabItem from '../TabItem/TabItem'
import { useState } from 'react'

interface Props {
    windowObj?: any
}

const WindowItem = ({ windowObj }: Props) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div className='window-item mt-2'>
            <div
                className="window-item-header d-flex justify-content-between align-items-center gap-2"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <span className={windowObj?.focused ? 'window-title active' : 'window-title'}>[Window ID: {windowObj?.id} | Tabs: {windowObj?.tabs?.length} | Incognito: {String(windowObj?.incognito)}]</span>
                {showActions && <div className="window-actions d-flex justify-content-between gap-2">
                    {windowObj?.tabs?.length > 1 && <FontAwesomeIcon icon={faSquareCheck} title='Check \ Uncheck all tabs' />}
                    <FontAwesomeIcon icon={faFloppyDisk} title='Save window' />
                    <FontAwesomeIcon icon={faFolderPlus} title='Add copied tabs' />
                    {windowObj?.tabs?.length > 1 && [
                        <FontAwesomeIcon key={1} icon={faCopy} title='Copy tabs' />,
                        <FontAwesomeIcon key={2} icon={faArrowsRotate} title='Refresh all tabs' />,
                        <FontAwesomeIcon key={3} icon={faCircleXmark} title='Close window' />
                    ]}
                </div>}
            </div>
            <div className="window-item-tabs">
                {windowObj?.tabs?.map((tab: any, index: number) => <TabItem key={index} tab={tab} />)}
            </div>
        </div>
    )
}

export default WindowItem