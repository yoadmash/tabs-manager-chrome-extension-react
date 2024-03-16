import { useContext } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavContext } from '../../contexts/NavContext';

const Navigation = () => {
  const { currentNavTab, setCurrentNavTab } = useContext(NavContext);

  const dataToRender = [
    { id: 0, title: 'Current Windows' },
    { id: 1, title: 'Saved Windows' },
    { id: 2, title: 'Incognito Windows' },
  ]

  return (
    <Nav tabs className='mt-3'>
      {dataToRender.map((item) => (
        <NavItem key={item.id}>
          <NavLink active={currentNavTab === item.id} onClick={() => setCurrentNavTab(item.id)}>
            {item.title}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  )
}

export default Navigation