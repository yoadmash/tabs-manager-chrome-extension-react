import { Nav, NavItem, NavLink } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useStorage } from '../../contexts/AppContext';
import { useEffect } from 'react';

const Navigation = () => {
  const { currentNavTab, updateCurrentNavTab } = useNavContext();
  const storage = useStorage();

  const dataToRender = [
    { id: 0, title: 'Current Windows', count: storage?.openedWindows?.filter(window => !window.incognito).length },
    { id: 1, title: 'Saved Windows', count: storage?.savedWindows?.length },
    { id: 2, title: 'Incognito Windows', count: storage?.openedWindows?.filter(window => window.incognito).length },
  ]

  useEffect(() => {
    if ((currentNavTab === 0 && !storage?.options?.auto_scroll) || currentNavTab === 1) {
      document.querySelector('.windows-lists')?.scrollTo({
        top: 0,
      });
    }
  }, [currentNavTab, storage?.options?.auto_scroll]);


  const calculateTotalTabs = (currentNavTab: number): number => {
    let totalTabs = 0;
    let windows: Array<any> = [];

    switch (currentNavTab) {
      case 0:
        windows = storage?.openedWindows?.filter(window => !window.incognito);
        break;
      case 1:
        windows = storage?.savedWindows;
        break;
      case 2:
        windows = storage?.openedWindows?.filter(window => window.incognito);
        break;
      default:
        break;
    }

    windows?.map(window => totalTabs += window.tabs.length);
    return totalTabs;
  }

  return (
    <>
      <h6 className={`mt-3 mb-2 sticky-top align-self-start ${storage?.options?.dark_theme ? 'bg-dark' : 'bg-white'}`}>Total tabs: {calculateTotalTabs(currentNavTab)}</h6>
      <Nav tabs>
        {dataToRender.map((item) => {
          if (item.id === 1 && (storage?.options?.hide_saved || !storage?.savedWindows?.length)) return null;
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