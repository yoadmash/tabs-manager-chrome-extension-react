import './App.css';
import Search from './components/Search/Search';
import RefreshOrExpandBtn from './components/RefreshOrExpandBtn/RefreshOrExpandBtn';
import Navigation from './components/Navigation/Navigation';
import Content from './components/Content/Content';
import { useEffect } from 'react';
import { NavProvider } from './contexts/NavContext';
import Options from './components/Options/Options';

function App() {

  useEffect(() => {
    if (!localStorage.getItem('data')) {
      localStorage.setItem('data', JSON.stringify({}));
    }
  }, []);

  return (
    <div className="App border">
      <div className="header d-flex justify-content-between align-items-center flex-wrap">
        <Search />
        <RefreshOrExpandBtn expanded={true} />
        <Options />
      </div>
      <div className="body">
        <NavProvider>
          <Navigation />
          <Content />
        </NavProvider>
      </div>
    </div>
  );
}

export default App;
