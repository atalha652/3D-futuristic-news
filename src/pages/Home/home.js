import React from 'react';
import Visualization from '../../components/visualization';

export default function Home() {
  return (
    <div>
      <div id="info"></div>
      {/* <div id="menu">
        <button id="grid">GRID</button>
      </div> */}
      <Visualization />
    </div>
  );
}