import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Toolbar from './componenets/Toolbar';
import HomeScreen from './componenets/Home/HomeScreen';
import Contact from './componenets/Home/Contact';
import Algorithm from './componenets/Algorithms/AlgorithmsPage';
import Information from './componenets/Home/Information';

function App() {
  return (
    <Router>
      <div className="App">
        <Toolbar /> {}
        <Routes>
          <Route path="*" element={<HomeScreen/>} />
          <Route path="/AlgorithmsPage" element={<Algorithm/>} />
          <Route path="/Information" element={<Information/>} />
          <Route path="/contact" element={<Contact/>} /> 
        </Routes>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
      </div>
    </Router>
  );
}

export default App;
