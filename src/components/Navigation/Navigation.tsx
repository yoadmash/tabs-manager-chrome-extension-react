import { Nav, NavItem, NavLink } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useStorage } from '../../contexts/AppContext';

const Navigation = () => {
  const { currentNavTab, updateCurrentNavTab } = useNavContext();
  const storage = useStorage();

  const dataToRender = [
    { id: 0, title: 'Current Windows', count: storage?.openedWindows?.filter(window => !window.incognito).length },
    { id: 1, title: 'Saved Windows', count: storage?.savedWindows?.length },
    { id: 2, title: 'Incognito Windows', count: storage?.openedWindows?.filter(window => window.incognito).length },
  ]

  return (
    <Nav tabs className='mt-1'>
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
  )
}

export default Navigation