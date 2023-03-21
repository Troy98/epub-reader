import React from 'react';
import './css/slider.css';
import Navbar from '../components/Navbar';
import Panel from '../components/Panel/Panel';

function ConfigPage() {
  return (
    <div className="bg-neutral-300 w-full min-h-screen h-full items-center flex flex-col">

      <Navbar />

      <div className="w-full flex-1 h-full flex items-center justify-center">
        <Panel />
      </div>

    </div>
  );
}

export default ConfigPage;
