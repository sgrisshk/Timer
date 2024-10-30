import React from 'react';
import ReactDOM from 'react-dom/client';
import Timer from "./TimerProps";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Timer title={"Timer"} endTime={0} elapsedTime={0}/>
  </React.StrictMode>
);
