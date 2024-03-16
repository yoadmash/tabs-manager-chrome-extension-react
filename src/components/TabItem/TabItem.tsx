import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCopy, faArrowsRotate, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const TabItem = () => {
  return (
    <div className="tab-item d-flex justify-content-between align-items-center gap-2">
      <div className="tab-title">
        {/* <img src="" alt="" className="tab-favicon" /> */}
        <span className="title">Tab Title</span>
      </div>
      <div className="tab-actions d-flex justify-content-between gap-2">
        <FontAwesomeIcon icon={faPen} title='Edit tab title'/>
        <FontAwesomeIcon icon={faCopy} title='Copy tab data'/>
        <FontAwesomeIcon icon={faArrowsRotate} title='Refresh'/>
        <FontAwesomeIcon icon={faCircleXmark} title='Close tab'/>
      </div>
    </div>
  )
}

export default TabItem