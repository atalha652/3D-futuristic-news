import React from 'react';
import Visualization from '../../components/visualization';
import backgroundVideo from '../../assets/vecteezy_3d-virtual-tv-studio-news-backdrop-for-tv-shows-tv-on_13654649.mp4'; // Replace with the path to your video file

export default function Home() {
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
      <div>
        <div id="info"></div>
        {/* <div id="menu">
          <button id="grid">GRID</button>
        </div> */}
        <Visualization />
      </div>
    </div>
  );
}
