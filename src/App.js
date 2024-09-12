import React from 'react';
import "./App.css";
import Detail from "./pages/Detail/detail";
import Home from "./pages/Home/home";
import { Routes, Route } from "react-router-dom";
import backgroundVideo from './assets/vecteezy_3d-virtual-tv-studio-news-backdrop-for-tv-shows-tv-on_13654649.mp4'; // Adjust the path as necessary

function App() {
  const containerStyle = {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
  };

  const videoStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    zIndex: -1,
  };

  return (
    <div style={containerStyle}>
      <video autoPlay muted loop style={videoStyle}>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;