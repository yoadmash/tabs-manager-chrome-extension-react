import { faPen, faCopy, faArrowsRotate, faCircleXmark, faTrashCan, faFileCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from 'reactstrap'
import { useStorage } from '../../contexts/AppContext';
import { useNavContext } from '../../contexts/NavContext';
import { useModal } from '../../contexts/ModalContext';
import Icon from '../Icon/Icon';
import { useSearchContext } from '../../contexts/SearchContext';

interface Props {
  tab: any;
  checked: boolean;
  fromSavedWindow?: boolean;
  updateSelectedTabs: null | ((tabId: number, checked: boolean) => void);
}

const TabItem = ({ tab, checked, fromSavedWindow, updateSelectedTabs }: Props) => {

  const storage = useStorage();
  const modal = useModal();
  const { currentNavTab, updateCurrentNavTab } = useNavContext();
  const { searchData, updateSearchData } = useSearchContext();
  const [checkedState, setCheckedState] = useState(false);
  const [hoverTab, setHoverTab] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const notGXCorner = !tab?.url?.match('https://gxcorner.games/');

  useEffect(() => {
    if (tab?.active && tab?.windowId === storage?.currentWindow?.id && storage?.options?.auto_scroll && (currentNavTab === 0 || currentNavTab === 2)) {
      titleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [tab, titleRef, storage.currentWindow.id, storage.options.auto_scroll, currentNavTab]);

  useEffect(() => {
    if (notGXCorner) {
      setCheckedState(checked);
    }
  }, [notGXCorner, checked]);

  const checkTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState(e.target.checked);
    updateSelectedTabs && updateSelectedTabs(tab.id, e.target.checked);
  }

  const navigate = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (notGXCorner) {
      if (!fromSavedWindow) {
        chrome.tabs?.update(tab.id, { active: true }, (clickedTab) => {
          if (clickedTab && clickedTab.windowId !== storage?.currentWindow?.id) {
            chrome.windows?.update(clickedTab.windowId, { focused: true })
          }
        });
        storage.update('storage', null);
      } else {
        switch (e.button) {
          case 0: //left click
            chrome.windows?.create({
              focused: true,
              incognito: tab?.incognito,
              state: 'maximized',
              url: tab.url
            });
            break;
          case 1: //middle click
            chrome.tabs?.create({
              active: false,
              windowId: storage?.currentWindow?.id,
              url: tab.url
            })
            break;
          case 2: //right click
            if (storage?.popup === null) {
              chrome.tabs?.update({
                url: tab.url,
              }).then(() => window.close());
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const edit = () => {
    modal.updateModal({
      open: true,
      type: 'edit-saved-tab',
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
      favIconUrl: tab?.favIconUrl?.length > 0 ? tab.favIconUrl : '/generic_tab.svg'
    }
    storage.update('clipboard', data);
  }

  const checkIfSaved = () => {
    modal.updateModal({
      open: true,
      type: 'check-if-saved',
      data: {
        title: tab.title,
        url: tab.url,
      },
    })
  }

  const refresh = () => {
    chrome.tabs.reload(tab?.id, { bypassCache: storage?.options?.bypass_cache });
  }

  const closeTab = async () => {
    let openedWindows: any = storage?.openedWindows;
    const tabWindowIdx: number = openedWindows?.findIndex((window: any) => window.id === tab?.windowId);

    if (openedWindows[tabWindowIdx]?.tabs?.length > 1) {
      await chrome.tabs?.remove(tab?.id);
      const filteredTabs: [] = openedWindows[tabWindowIdx]?.tabs.filter((openedTab: any) => openedTab.id !== tab?.id);
      openedWindows[tabWindowIdx].tabs = filteredTabs;
    } else {
      await chrome.windows?.remove(openedWindows[tabWindowIdx].id);
      openedWindows = openedWindows?.filter((window: any) => window.id !== openedWindows[tabWindowIdx]?.id);
    }

    if (searchData[0]?.id === 'searchResults') {
      const updatedSearchData: any = searchData[0]?.tabs?.filter((t: any) => t.id !== tab.id);
      updateSearchData(updatedSearchData.length > 0 ? [{ ...searchData[0], tabs: updatedSearchData }] : []);
    }

    storage.update('openedWindows', openedWindows);
  }

  const deleteTab = () => {
    let savedWindows: any = storage?.savedWindows;
    const tabWindowIdx: number = savedWindows?.findIndex((window: any) => window.id === tab?.windowId);

    if (savedWindows[tabWindowIdx]?.tabs?.length > 1) {
      const filteredTabs: [] = savedWindows[tabWindowIdx]?.tabs?.filter((savedTab: any) => savedTab.id !== tab?.id);
      savedWindows[tabWindowIdx].tabs = filteredTabs;
    } else {
      savedWindows = savedWindows?.filter((window: any) => window.id !== savedWindows[tabWindowIdx]?.id)
      if (!savedWindows?.length) {
        updateCurrentNavTab(0);
      }
    }

    if (searchData[0]?.id === 'searchResults') {
      const updatedSearchData: any = searchData[0]?.tabs?.filter((t: any) => t.id !== tab.id);
      updateSearchData(updatedSearchData.length > 0 ? [{ ...searchData[0], tabs: updatedSearchData }] : []);
    }

    storage.update('savedWindows', savedWindows);
  }

  return (
    <div className="tab-item d-flex justify-content-between align-items-center gap-3">
      <div className="tab-title"
        onMouseEnter={() => storage?.options?.show_favicons && setHoverTab(!hoverTab)}
        onMouseLeave={() => storage?.options?.show_favicons && setHoverTab(!hoverTab)}
        ref={titleRef}
      >
        {
          storage?.options?.show_favicons
            ? notGXCorner && !fromSavedWindow && (hoverTab || checkedState) && searchData[0]?.id !== 'searchResults'
              ? <Input type='checkbox' checked={checkedState} className='me-3' onChange={(e) => checkTab(e)} />
              : <img
                src={tab?.favIconUrl || '/generic_tab.svg'}
                alt="favicon"
                className="tab-favicon me-3"
                onError={({ currentTarget }) => {
                  currentTarget.src = '/generic_tab.svg';
                }}
              />
            : notGXCorner && !fromSavedWindow && <Input type='checkbox' checked={checkedState} className='me-3' onChange={(e) => checkTab(e)} />
        }
        <span
          title={tab?.title}
          className={tab?.active ? 'active' : ''}
          onMouseDown={(e) => navigate(e)}
        >
          {tab?.title}
        </span>
      </div>
      <div className="tab-actions d-flex justify-content-between mt-1 gap-1">
        {fromSavedWindow && <Icon id={`tab-${tab?.id}-saved-window-edit`} icon={faPen} title='Edit' onClick={() => edit()} />}
        {(notGXCorner && !fromSavedWindow) && <Icon id={`tab-${tab?.id}-copy-data`} icon={faCopy} title='Copy tab data' onClick={() => copyData()} />}
        {(notGXCorner && !fromSavedWindow) && <Icon id={`tab-${tab?.id}-check-if-saved`} icon={faFileCircleQuestion} title='Check if saved' onClick={() => checkIfSaved()} />}
        {!fromSavedWindow && <Icon id={`tab-${tab?.id}-refresh`} icon={faArrowsRotate} title='Refresh' onClick={() => refresh()} />}
        {(notGXCorner && !fromSavedWindow) && <Icon id={`tab-${tab?.id}-close`} icon={faCircleXmark} title='Close tab' onClick={() => closeTab()} />}
        {fromSavedWindow && <Icon id={`tab-${tab?.id}-saved-window-delete`} icon={faTrashCan} title='Delete' onClick={() => deleteTab()} />}
      </div>
    </div>
  )
}

export default TabItem