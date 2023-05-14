import './App.css';
import HomePage from './components/homepage';
import React from 'react';
import TellStory from './components/tellstory';
import TellStoryCont from './components/tellstorycont';
import HearStory from './components/hearstory';
import SelectStory from './components/selectstory';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import backgroundGif from './assets/stars.gif';



function App() {
  return (
    <div className="relative min-h-screen">
    <div 
      className="absolute inset-0 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${backgroundGif})`,
        zIndex: -1,
      }}
    ></div>
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 opacity-70" style={{ zIndex: -1 }}></div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tellstory" element={<TellStory />} />
          <Route path="/tellstorycont" element={<TellStoryCont />} />
          <Route path="/selectstory" element={<SelectStory />} />
          <Route path="/hearstory" element={<HearStory />} />
        </Routes>
      </Router>
    </div>
  </div>
  );
}

export default App;
