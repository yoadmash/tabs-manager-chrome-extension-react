import { Nav, NavItem, NavLink } from 'reactstrap';
import { useNavContext } from '../../contexts/NavContext';
import { useStorage } from '../../contexts/AppContext';

const Navigation = () => {
  const { currentNavTab, updateCurrentNavTab } = useNavContext();
  const storage = useStorage();

  const dataToRender = [
    { id: 0, title: 'Current Windows' },
    { id: 1, title: 'Saved Windows' },
    { id: 2, title: 'Incognito Windows' },
  ]

  return (
    <Nav tabs className='mt-3'>
      {dataToRender.map((item) => {
        if (item.id === 2 && !storage?.options?.show_incognito) return null;

        return (
          <NavItem key={item.id}>
            <NavLink active={currentNavTab === item.id} onClick={() => updateCurrentNavTab(item.id)}>
              {item.title}
            </NavLink>
          </NavItem>
        )
      })}
    </Nav>
  )
}

export default Navigation