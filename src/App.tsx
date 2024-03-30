import './App.css';
import Search from './components/Search/Search';
import RefreshOrExpandBtn from './components/RefreshOrExpandBtn/RefreshOrExpandBtn';
import Navigation from './components/Navigation/Navigation';
import Content from './components/Content/Content';
import { NavProvider } from './contexts/NavContext';
import Options from './components/Options/Options';
import { StorageProvider } from './contexts/AppContext';
import { ModalProvider } from './contexts/ModalContext';

function App() {

  return (
    <StorageProvider>
      <div className="App">
        <div className="header d-flex justify-content-between align-items-center flex-wrap">
          <Search />
          <RefreshOrExpandBtn />
        </div>
        <div className="body">
          <NavProvider>
            <Options />
            <Navigation />
            <ModalProvider>
              <Content />
            </ModalProvider>
          </NavProvider>
        </div>
      </div>
    </StorageProvider>
  );
}

export default App;
