import './App.css';
import Search from './components/Search/Search';
import RefreshOrExpandBtn from './components/RefreshOrExpandBtn/RefreshOrExpandBtn';
import Navigation from './components/Navigation/Navigation';
import Content from './components/Content/Content';
import { NavProvider } from './contexts/NavContext';
import Options from './components/Options/Options';
import { StorageProvider } from './contexts/AppContext';

function App() {

  return (
    <StorageProvider>
      <div className="App">
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
