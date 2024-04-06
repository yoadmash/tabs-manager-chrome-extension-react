import './App.css';
import Search from './components/Search/Search';
import RefreshOrExpandBtn from './components/RefreshOrExpandBtn/RefreshOrExpandBtn';
import Navigation from './components/Navigation/Navigation';
import Content from './components/Content/Content';
import { NavProvider } from './contexts/NavContext';
import { ModalProvider } from './contexts/ModalContext';
import OptionsPage from './components/Options/OptionsPage';
import { useStorage } from './contexts/AppContext';
import { useEffect } from 'react';

function App() {

  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');

  const storage = useStorage();

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', (storage?.options?.dark_theme) ? 'dark' : 'light');
  }, [storage.options?.dark_theme]);

  return (
    <>
      {view && view === 'options'
        ?
        <OptionsPage />
        :
        <div className="App">
          <div className="header d-flex justify-content-between align-items-center flex-wrap">
            <Search />
            <RefreshOrExpandBtn />
          </div>
          <div className="body">
            <NavProvider>
              <Navigation />
              <ModalProvider>
                <Content />
              </ModalProvider>
            </NavProvider>
          </div>
        </div>
      }
    </>
  );
}

export default App;
