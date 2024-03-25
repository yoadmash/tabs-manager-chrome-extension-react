import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faArrowsRotate, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { Input } from 'reactstrap'
import { useStorage } from '../../contexts/AppContext';

interface Props {
  tab: any;
  checked: boolean;
  fromSavedWindow?: boolean;
  updateSelectedTabs: (tabId: number, checked: boolean) => void;
}

const TabItem = ({ tab, checked, fromSavedWindow, updateSelectedTabs }: Props) => {

  const storage = useStorage();
  const [checkedState, setCheckedState] = useState(false);
  const [hoverTab, setHoverTab] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tab?.active && tab?.windowId === storage?.currentWindow?.id && storage?.options?.auto_scroll) {
      titleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [tab, titleRef, storage]);

  useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  const checkTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(e.target.checked);
    updateSelectedTabs(tab.id, e.target.checked);
  }

  const copyData = () => {
    const data = {
      title: tab.title,
      url: tab.url,
      favIcon: tab.favIconUrl.length > 0 ? tab.favIconUrl : '/generic_tab.svg'
    }
    storage.update('clipboard', data);
  }

  const refresh = () => {
    chrome.tabs.reload(tab?.id, {bypassCache: true});
  }

  const closeTab = async (tabId: number) => {
    let openedWindows: any = storage?.openedWindows;
    const tabWindowIdx: number = openedWindows?.findIndex((window: any) => window.id === tab?.windowId);
    
    if(openedWindows[tabWindowIdx].tabs.length > 1) {
      const filteredTabs: [] = openedWindows[tabWindowIdx]?.tabs.filter((tab: any) => tab.id !== tabId);
      openedWindows[tabWindowIdx].tabs = filteredTabs;
      await chrome.tabs?.remove(tabId);
    } else {
      await chrome.windows?.remove(openedWindows[tabWindowIdx].id);
      openedWindows = openedWindows.filter((window: any) => window.id !== openedWindows[tabWindowIdx]?.id);
    }

    storage.update('openedWindows', openedWindows);
  }

  return (
    <div className="tab-item d-flex justify-content-between align-items-center gap-3">
        <div className="tab-title"
          onMouseEnter={() => setHoverTab(!hoverTab)}
          onMouseLeave={() => setHoverTab(!hoverTab)}
          ref={titleRef}
        >
          {hoverTab || checkedState
            ? <Input type='checkbox' checked={checkedState} className='me-3' onChange={(e) => checkTab(e)} />
            : <img src={tab?.favIconUrl || '/generic_tab.svg'} alt="favicon" className="tab-favicon me-3" />
          }
          <span title={tab?.title} className={tab?.active && tab?.windowId === storage?.currentWindow?.id ? 'active' : ''}>{tab?.title}</span>
        </div>
      <div className="tab-actions d-flex justify-content-between gap-2">
        {(!tab?.url.match('https://gxcorner.games/')) && <FontAwesomeIcon icon={faCopy} title='Copy tab data' onClick={() => copyData()} />}
        {!fromSavedWindow && <FontAwesomeIcon icon={faArrowsRotate} title='Refresh' onClick={() => refresh()}/>}
        {(!tab?.url.match('https://gxcorner.games/') && !fromSavedWindow) && <FontAwesomeIcon icon={faCircleXmark} title='Close tab' onClick={() => closeTab(tab?.id)} />}
      </div>
    </div>
  )
}

export default TabItem