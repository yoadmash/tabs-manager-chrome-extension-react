import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faExpand } from '@fortawesome/free-solid-svg-icons'

interface Props {
    expanded: boolean
}


const RefreshOrExpandBtn = ({ expanded }: Props) => {
    return (
        <FontAwesomeIcon icon={expanded ? faArrowsRotate : faExpand} className='refresh-expand-btn' title={expanded ? 'Refresh' : 'Expand'}/>
    )
}

export default RefreshOrExpandBtn