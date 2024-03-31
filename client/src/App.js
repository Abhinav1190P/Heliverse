import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginationPage from './PaginationPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/pagination/:page" element={<PaginationPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
