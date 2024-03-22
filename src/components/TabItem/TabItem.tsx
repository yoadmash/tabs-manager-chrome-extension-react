import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCopy, faArrowsRotate, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { Input } from 'reactstrap'

interface Props {
  tab: any;
  checked?: boolean;
}

const TabItem = ({ tab, checked }: Props) => {

  const [checkedState, setCheckedState] = useState(checked);
  const [hoverTab, setHoverTab] = useState(false);
  const [editTitleState, setEditTitleState] = useState(false);
  const editTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTitleState && editTitleInputRef.current) {
      editTitleInputRef.current.focus();
      editTitleInputRef.current.setSelectionRange(0, editTitleInputRef.current.value.length);
    }
  }, [editTitleState, editTitleInputRef])

  return (
    <div className="tab-item d-flex justify-content-between align-items-center gap-3">
      {editTitleState
        ? <Input type='text' placeholder={'Current title: ' + tab?.title} defaultValue={tab?.title} innerRef={editTitleInputRef} title={tab?.title} />
        :
        <div className="tab-title"
          onMouseEnter={() => !tab?.active && setHoverTab(!hoverTab)}
          onMouseLeave={() => !tab?.active && setHoverTab(!hoverTab)}
        >
          {hoverTab || checkedState
            ? <Input type='checkbox' className='me-3' onChange={() => setCheckedState(!checkedState)} />
            : <img src={tab?.favIconUrl || '/generic_tab.svg'} alt="favicon" className="tab-favicon me-3" />
          }
          <span title={tab?.title} className={tab?.active ? 'active' : ''}>{tab?.title}</span>
        </div>
      }
      <div className="tab-actions d-flex justify-content-between gap-2">
        {(!tab?.url.match('https://gxcorner.games/') && !tab?.url?.match('chrome://*/')) && <FontAwesomeIcon icon={faPen} title={'Edit tab title'} onClick={() => setEditTitleState(!editTitleState)} />}
        {(!tab?.url.match('https://gxcorner.games/')) && <FontAwesomeIcon icon={faCopy} title='Copy tab data' />}
        <FontAwesomeIcon icon={faArrowsRotate} title='Refresh' />
        {(!tab?.url.match('https://gxcorner.games/')) && <FontAwesomeIcon icon={faCircleXmark} title='Close tab' />}
      </div>
    </div>
  )
}

export default TabItem