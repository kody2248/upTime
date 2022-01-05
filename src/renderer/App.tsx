import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './assets/css/bootstrap.min.css';
import Nav from './components/nav';
import Home from './components/home';
import Devices from './components/Devices';

export default function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 nav">
            <Nav />
          </div>
          <div className="col-9 content">
            <div>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/devices" element={<Devices />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
