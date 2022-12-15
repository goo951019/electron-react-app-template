import './App.css';
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from './pages/Page_Landing';

function App() {
  return (
    <div className="App" style={{margin: 0, padding: 0}}>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
