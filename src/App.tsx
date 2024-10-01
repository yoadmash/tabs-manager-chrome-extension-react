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
import NotesManagerBtn from './components/NotesManager/NotesManagerBtn';

function App() {
  const storage = useStorage();
  const { currentNavTab, updateCurrentNavTab } = useNavContext();

  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if(e.ctrlKey && e.shiftKey && e.key === 'S' && currentNavTab !== 1) {
      const settings = storage?.options;

      if(!settings?.hide_saved) {
        updateCurrentNavTab(1);
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);

    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    }
  }, []);

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
            <div className="d-flex gap-2">
              <Search />
              <div className="d-flex align-items-center gap-2 h-50">
                <RefreshOrExpandBtn />
                <NotesManagerBtn />
                {storage?.options?.access_options_from_popup && <OptionsBtn />}
              </div>
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
