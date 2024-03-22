import './App.css';
import Search from './components/Search/Search';
import RefreshOrExpandBtn from './components/RefreshOrExpandBtn/RefreshOrExpandBtn';
import Navigation from './components/Navigation/Navigation';
import Content from './components/Content/Content';
import { useEffect } from 'react';
import { NavProvider } from './contexts/NavContext';
import Options from './components/Options/Options';
import { StorageProvider } from './contexts/AppContext';

function App() {

  useEffect(() => {
    if (!localStorage.getItem('data')) {
      localStorage.setItem('data', JSON.stringify({}));
    }
  }, []);

  return (
    <StorageProvider>
      <div className="App border">
        <div className="header d-flex justify-content-between align-items-center flex-wrap">
          <Search />
          <RefreshOrExpandBtn expanded={true} />
        </div>
        <div className="body">
          <NavProvider>
            <Options />
            <Navigation />
            <Content />
          </NavProvider>
        </div>
      </div>
    </StorageProvider>
  );
}

export default App;
