import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { News } from './features/news/News';
import { Search } from './features/search/Search';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResponsiveDrawer from './common/Demo';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ResponsiveDrawer>
          <Routes>
            <Route path="/" element={<News />} />
            <Route path="news" element={<News />} />
            <Route path="counter" element={<Counter />} />
            <Route path="search" element={<Search />} />
            <Route path="*" element={<h1>Route does not exist</h1>} />
          </Routes>
        </ResponsiveDrawer>
      </BrowserRouter>

    </div>
  );
}

export default App;
