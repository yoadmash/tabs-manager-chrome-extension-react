import { faPen, faCopy, faArrowsRotate, faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from 'reactstrap'
import { useStorage } from '../../contexts/AppContext';
import { useNavContext } from '../../contexts/NavContext';
import { useModal } from '../../contexts/ModalContext';
import Icon from '../Icon/Icon';

interface Props {
  tab: any;
  checked: boolean;
  fromSavedWindow?: boolean;
  updateSelectedTabs: (tabId: number, checked: boolean) => void;
}

const TabItem = ({ tab, checked, fromSavedWindow, updateSelectedTabs }: Props) => {

  const storage = useStorage();
  const modal = useModal();
  const { currentNavTab } = useNavContext();
  const [checkedState, setCheckedState] = useState(false);
  const [hoverTab, setHoverTab] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const notGXCorner = !tab?.url.match('https://gxcorner.games/');

  useEffect(() => {
    if (tab?.active && tab?.windowId === storage?.currentWindow?.id && storage?.options?.auto_scroll && currentNavTab === 0) {
      titleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [tab, titleRef, storage, currentNavTab]);

  useEffect(() => {
    if(notGXCorner) {
      setCheckedState(checked);
    }
  }, [notGXCorner, checked]);

  const checkTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(e.target.checked);
    updateSelectedTabs(tab.id, e.target.checked);
  }

  const navigate = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (notGXCorner) {
      if (!fromSavedWindow) {
        chrome.tabs?.update(tab.id, { active: true }, (clickedTab) => {
          if (clickedTab && clickedTab.windowId !== storage?.currentWindow?.id) {
            chrome.windows?.update(clickedTab.windowId, { focused: true })
          }
        });
        storage.update('storage', null);
      } else {
        chrome.windows?.create({
          focused: true,
          incognito: tab?.incognito,
          state: 'maximized',
          url: tab.url
        })
      }
    }
  }

  const edit = () => {
    modal.updateModal({
      open: true,
      type: 'edit',
      data: {
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl
      },
    })
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
    chrome.tabs.reload(tab?.id, { bypassCache: true });
  }

  const closeTab = async (tabId: number) => {
    let openedWindows: any = storage?.openedWindows;
    const tabWindowIdx: number = openedWindows?.findIndex((window: any) => window.id === tab?.windowId);

    if (openedWindows[tabWindowIdx].tabs.length > 1) {
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
        {notGXCorner && !fromSavedWindow && (hoverTab || checkedState)
          ? <Input type='checkbox' checked={checkedState} className='me-3' onChange={(e) => checkTab(e)} />
          : <img
            src={tab?.favIconUrl?.length > 0 ? tab?.favIconUrl : '/generic_tab.svg'}
            alt="favicon"
            className="tab-favicon me-3"
            onError={() => {
              tab.favIconUrl = '/generic_tab.svg';
              storage.update('storage', null);
            }}
          />
        }
        <span
          title={tab?.title}
          className={tab?.active ? 'active' : ''}
          onClick={(e) => navigate(e)}
        >
          {tab?.title}
        </span>
      </div>
      <div className="tab-actions d-flex justify-content-between mt-1 gap-2">
        {fromSavedWindow && <Icon id={`tab-${tab.id}-saved-window-edit`} icon={faPen} title='Edit' onClick={() => edit()} />}
        {(notGXCorner && !fromSavedWindow) && <Icon id={`tab-${tab.id}-copy-data`} icon={faCopy} title='Copy tab data' onClick={() => copyData()} />}
        {!fromSavedWindow && <Icon id={`tab-${tab.id}-refresh`} icon={faArrowsRotate} title='Refresh' onClick={() => refresh()} />}
        {(notGXCorner && !fromSavedWindow) && <Icon id={`tab-${tab.id}-close`} icon={faCircleXmark} title='Close tab' onClick={() => closeTab(tab?.id)} />}
        {fromSavedWindow && <Icon id={`tab-${tab.id}-saved-window-delete`} icon={faTrashCan} title='Delete' onClick={() => { }} />}
      </div>
    </div>
  )
}

export default TabItem