import './App.css';
import Search from './components/Search/Search';
import RefreshOrExpandBtn from './components/RefreshOrExpandBtn/RefreshOrExpandBtn';
import Navigation from './components/Navigation/Navigation';
import Content from './components/Content/Content';
import { useNavContext } from './contexts/NavContext';
import { ModalProvider } from './contexts/ModalContext';
import OptionsPage from './components/Options/OptionsPage';
import { useStorage } from './contexts/AppContext';
import { useEffect } from 'react';
import { SearchProvider } from './contexts/SearchContext';
import OptionsBtn from './components/Options/OptionsBtn';

function App() {

  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');

  const storage = useStorage();
  const { currentNavTab, updateCurrentNavTab } = useNavContext();

  useEffect(() => {
    if (view && view === 'options') {
      updateCurrentNavTab(3);
    }
  }, [view, updateCurrentNavTab])

  useEffect(() => {
    const darkMode =
      storage?.options?.dark_theme
        ? 'dark'
        : storage?.currentWindow?.incognito && storage?.options?.dark_theme_incognito_only
          ? 'dark'
          : 'light'

    document.documentElement.setAttribute('data-bs-theme', (darkMode));

  }, [storage.options?.dark_theme, storage?.currentWindow?.incognito, storage?.options?.dark_theme_incognito_only]);

  return (
    <SearchProvider>
      <ModalProvider>
        {currentNavTab === 3
          ?
          <OptionsPage />
          :
          <div className="App">
            <div className="d-flex align-items-center gap-2">
              <Search />
              <RefreshOrExpandBtn />
              {storage?.options?.access_options_from_popup && <OptionsBtn />}
            </div>
            <div className="body">
              <Navigation />
              <Content />
            </div>
          </div >
        }
      </ModalProvider>
    </SearchProvider>
  );
}

export default App;
