import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportItem from './pages/ReportItem';
import BrowseItems from './pages/BrowseItems';
import ItemDetails from './pages/ItemDetails';
import Notifications from './pages/Notifications';
import MyClaims from './pages/MyClaims';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/browse" element={<BrowseItems />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/claims" element={<MyClaims />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
