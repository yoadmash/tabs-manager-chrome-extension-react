import { Nav, NavItem, NavLink } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useStorage } from '../../contexts/AppContext';
import { useEffect } from 'react';
import { useSearchContext } from '../../contexts/SearchContext';

const Navigation = () => {
  const { currentNavTab, updateCurrentNavTab } = useNavContext();
  const { searchData } = useSearchContext();
  const storage = useStorage();

  const dataToRender = [
    { id: 0, title: 'Current Windows', count: storage?.openedWindows?.filter(window => !window.incognito).length },
    { id: 1, title: 'Saved Windows', count: storage?.savedWindows?.length },
    { id: 2, title: 'Incognito Windows', count: storage?.openedWindows?.filter(window => window.incognito).length },
  ]

  const getWindowsListSource = (navTab: number): Array<any> => {
    return (navTab === 0)
      ? storage?.openedWindows?.filter(window => !window.incognito)
      : (navTab === 1)
        ? storage?.savedWindows
        : (navTab === 2)
          ? storage?.openedWindows?.filter(window => window.incognito)
          : []
  }

  const calculateTotalTabs = (): number => {
    let totalTabs = 0;
    if (searchData?.[0]?.id === 'searchResults') {
      searchData?.map(window => totalTabs += window.tabs.length);
    } else {
      getWindowsListSource(currentNavTab)?.map(window => totalTabs += window.tabs.length);
    }
    return totalTabs;
  }

  useEffect(() => {
    if ((currentNavTab === 0 && !storage?.options?.auto_scroll) || currentNavTab === 1) {
      document.querySelector('.windows-lists')?.scrollTo({
        top: 0,
      });
    }

    if(currentNavTab === 0 || currentNavTab === 2) {
      storage.update('storage', null);
    }

  }, [currentNavTab, storage?.options?.auto_scroll]);

  return (
    <>
      <h6 className={`mt-3 mb-2 sticky-top align-self-start ${storage?.options?.dark_theme || (storage?.currentWindow?.incognito && storage?.options?.dark_theme_incognito_only) ? 'bg-dark' : 'bg-white'}`}>Total tabs: {calculateTotalTabs()}</h6>
      <Nav tabs>
        {dataToRender.map((item) => {
          if (item.id === 1 && (storage?.options?.hide_saved)) return null;
          if (item.id === 2 && !storage?.options?.show_incognito && !storage?.currentWindow?.incognito) return null;

          return (
            <NavItem key={item.id}>
              <NavLink active={currentNavTab === item.id} onClick={() => updateCurrentNavTab(item.id)}>
                {item.title} ({item.count})
              </NavLink>
            </NavItem>
          )
        })}
      </Nav>
    </>
  )
}

export default Navigation